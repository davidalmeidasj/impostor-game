'use client';

import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import { Lobby } from '@/types';
import PlayerList from './PlayerList';

interface LobbyWaitingProps {
  lobby: Lobby;
  currentSession: string;
  onStartGame: () => void;
  onLeaveLobby: () => void;
  error?: string;
}

export default function LobbyWaiting({
  lobby,
  currentSession,
  onStartGame,
  onLeaveLobby,
  error,
}: LobbyWaitingProps) {
  const isAdmin = lobby.createdBy === currentSession;
  const canStart = lobby.players.length >= 3;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Waiting Room
      </Typography>

      <Box
        sx={{
          bgcolor: 'grey.100',
          p: 2,
          borderRadius: 1,
          mb: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Lobby Code
        </Typography>
        <Typography variant="h4" fontWeight="bold" fontFamily="monospace">
          {lobby.lobbyId}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="subtitle1" gutterBottom>
        Players ({lobby.players.length}/?)
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <PlayerList
        players={lobby.players}
        adminSession={lobby.createdBy}
        currentSession={currentSession}
      />

      {!canStart && (
        <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
          Minimum 3 players required to start the game
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onStartGame}
            disabled={!canStart}
          >
            Start Game
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={onLeaveLobby}
        >
          Leave Lobby
        </Button>
      </Box>
    </Paper>
  );
}
