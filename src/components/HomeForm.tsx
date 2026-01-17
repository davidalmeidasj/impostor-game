'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const SUPPORTED_LOCALES = ['en', 'pt-BR', 'es'] as const;

export default function HomeForm() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const [name, setName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [gameLocale, setGameLocale] = useState(locale);
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
      throw new Error(t('errors.failedToCreateUser'));
    }
    return response.json();
  };

  const handleCreateLobby = async () => {
    if (!name.trim()) {
      setError(t('errors.pleaseEnterName'));
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
        body: JSON.stringify({ playerSession, playerName: name, locale: gameLocale }),
      });

      if (!response.ok) {
        throw new Error(t('errors.failedToCreateLobby'));
      }

      const lobby = await response.json();
      router.push(`/${locale}/lobby/${lobby.lobbyId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLobby = async () => {
    if (!name.trim()) {
      setError(t('errors.pleaseEnterName'));
      return;
    }
    if (!lobbyCode.trim()) {
      setError(t('errors.pleaseEnterLobbyCode'));
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
        throw new Error(data.error || t('errors.failedToJoinLobby'));
      }

      router.push(`/${locale}/lobby/${lobbyCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        {t('home.title')}
      </Typography>

      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label={t('home.yourName')}
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />

        <TextField
          label={t('home.lobbyCode')}
          variant="outlined"
          fullWidth
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          disabled={loading}
          placeholder={t('home.enterCodeToJoin')}
        />

        <FormControl fullWidth>
          <InputLabel id="game-locale-label">{t('languages.label')}</InputLabel>
          <Select
            labelId="game-locale-label"
            value={gameLocale}
            label={t('languages.label')}
            onChange={(e) => setGameLocale(e.target.value)}
            disabled={loading}
          >
            {SUPPORTED_LOCALES.map((loc) => (
              <MenuItem key={loc} value={loc}>
                {t(`languages.${loc}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleJoinLobby}
            disabled={loading}
          >
            {t('home.joinLobby')}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleCreateLobby}
            disabled={loading}
          >
            {t('home.createLobby')}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
