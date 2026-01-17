'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack,
} from '@mui/material';

export default function HomeForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getOrCreateSession = (): string => {
    let session = sessionStorage.getItem('playerSession');
    if (!session) {
      session = Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('playerSession', session);
    }
    return session;
  };

  const createUser = async (playerSession: string, playerName: string) => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerSession, name: playerName }),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    return response.json();
  };

  const handleCreateLobby = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const playerSession = getOrCreateSession();
      await createUser(playerSession, name);
      sessionStorage.setItem('playerName', name);

      const response = await fetch('/api/lobbies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSession, playerName: name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create lobby');
      }

      const lobby = await response.json();
      router.push(`/lobby/${lobby.lobbyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLobby = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!lobbyCode.trim()) {
      setError('Please enter lobby code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const playerSession = getOrCreateSession();
      await createUser(playerSession, name);
      sessionStorage.setItem('playerName', name);

      const response = await fetch(`/api/lobbies/${lobbyCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSession, playerName: name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to join lobby');
      }

      router.push(`/lobby/${lobbyCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Impostor Game
      </Typography>

      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Your Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />

        <TextField
          label="Lobby Code"
          variant="outlined"
          fullWidth
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          disabled={loading}
          placeholder="Enter code to join"
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleJoinLobby}
            disabled={loading}
          >
            Join Lobby
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleCreateLobby}
            disabled={loading}
          >
            Create Lobby
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
