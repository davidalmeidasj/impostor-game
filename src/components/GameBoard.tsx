'use client';

import { Box, Typography, Button, Paper, Chip, Divider } from '@mui/material';
import { Lobby, Player } from '@/types';
import PlayerList from './PlayerList';

interface GameBoardProps {
  lobby: Lobby;
  currentPlayer: Player;
  currentSession: string;
  onRestartGame: () => void;
  onLeaveLobby: () => void;
}

export default function GameBoard({
  lobby,
  currentPlayer,
  currentSession,
  onRestartGame,
  onLeaveLobby,
}: GameBoardProps) {
  const isAdmin = lobby.createdBy === currentSession;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Game in Progress</Typography>
        <Chip label={`Round ${lobby.round}`} color="primary" />
      </Box>

      <Box
        sx={{
          bgcolor: currentPlayer.isImpostor ? 'error.light' : 'success.light',
          p: 4,
          borderRadius: 2,
          mb: 3,
          textAlign: 'center',
        }}
      >
        {currentPlayer.isImpostor ? (
          <>
            <Typography variant="h4" color="error.dark" fontWeight="bold">
              You are the Impostor!
            </Typography>
            <Typography variant="body1" color="error.dark" sx={{ mt: 1 }}>
              Try to guess the secret word without getting caught
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1" color="success.dark">
              Your secret word is:
            </Typography>
            <Typography
              variant="h3"
              color="success.dark"
              fontWeight="bold"
              sx={{ mt: 1 }}
            >
              {currentPlayer.assignedWord}
            </Typography>
          </>
        )}
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Players ({lobby.players.length})
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <PlayerList
        players={lobby.players}
        adminSession={lobby.createdBy}
        currentSession={currentSession}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onRestartGame}
          >
            New Round
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
