'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useLobby } from '@/hooks/useLobby';
import LobbyWaiting from '@/components/LobbyWaiting';
import GameBoard from '@/components/GameBoard';
import VotingBoard from '@/components/VotingBoard';
import VotingResults from '@/components/VotingResults';

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const lobbyId = params.lobbyId as string;
  const { lobby, loading, error } = useLobby(lobbyId);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('playerSession');
    if (!session) {
      router.push('/');
      return;
    }
    setCurrentSession(session);
  }, [router]);

  const handleStartGame = async () => {
    setActionError(null);
    try {
      const response = await fetch(`/api/lobbies/${lobbyId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSession: currentSession }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start game');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleStartVoting = async () => {
    setActionError(null);
    try {
      const response = await fetch(`/api/lobbies/${lobbyId}/start-voting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSession: currentSession }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start voting');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleVote = async (votedFor: string) => {
    setActionError(null);
    try {
      const response = await fetch(`/api/lobbies/${lobbyId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSession: currentSession, votedFor }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to vote');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleEndVoting = async () => {
    setActionError(null);
    try {
      const response = await fetch(`/api/lobbies/${lobbyId}/end-voting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSession: currentSession }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to end voting');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleNextRound = async () => {
    setActionError(null);
    try {
      const response = await fetch(`/api/lobbies/${lobbyId}/restart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSession: currentSession }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start next round');
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleLeaveLobby = async () => {
    try {
      await fetch(`/api/lobbies/${lobbyId}/leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerSession: currentSession }),
      });
      router.push('/');
    } catch {
      router.push('/');
    }
  };

  if (!currentSession || loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !lobby) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          gap: 2,
        }}
      >
        <Alert severity="error">{error || 'Lobby not found'}</Alert>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          Voltar para o início
        </Typography>
      </Box>
    );
  }

  const currentPlayer = lobby.players.find(
    (p) => p.playerSession === currentSession
  );

  if (!currentPlayer) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          gap: 2,
        }}
      >
        <Alert severity="error">Você não está neste lobby</Alert>
        <Typography
          variant="body2"
          color="primary"
          sx={{ cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          Voltar para o início
        </Typography>
      </Box>
    );
  }

  const renderContent = () => {
    switch (lobby.status) {
      case 'waiting':
        return (
          <LobbyWaiting
            lobby={lobby}
            currentSession={currentSession}
            onStartGame={handleStartGame}
            onLeaveLobby={handleLeaveLobby}
            error={actionError || undefined}
          />
        );
      case 'in_progress':
        return (
          <GameBoard
            lobby={lobby}
            currentPlayer={currentPlayer}
            currentSession={currentSession}
            onStartVoting={handleStartVoting}
            onLeaveLobby={handleLeaveLobby}
          />
        );
      case 'voting':
        return (
          <VotingBoard
            lobby={lobby}
            currentPlayer={currentPlayer}
            currentSession={currentSession}
            onVote={handleVote}
            onEndVoting={handleEndVoting}
          />
        );
      case 'results':
        return (
          <VotingResults
            lobby={lobby}
            currentSession={currentSession}
            onNextRound={handleNextRound}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      {renderContent()}
    </Box>
  );
}
