'use client';

import { Box, Typography, Button, Paper, Chip, Divider } from '@mui/material';
import { Lobby, Player } from '@/types';
import PlayerList from './PlayerList';

interface GameBoardProps {
  lobby: Lobby;
  currentPlayer: Player;
  currentSession: string;
  onStartVoting: () => void;
  onLeaveLobby: () => void;
}

export default function GameBoard({
  lobby,
  currentPlayer,
  currentSession,
  onStartVoting,
  onLeaveLobby,
}: GameBoardProps) {
  const isAdmin = lobby.createdBy === currentSession;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Jogo em Andamento</Typography>
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
              Você é o Impostor!
            </Typography>
            <Typography variant="body1" color="error.dark" sx={{ mt: 1 }}>
              Tente adivinhar a palavra secreta sem ser descoberto
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="body1" color="success.dark">
              Sua palavra secreta é:
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
        Jogadores ({lobby.players.length})
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
            color="warning"
            fullWidth
            onClick={onStartVoting}
          >
            Iniciar Votação
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={onLeaveLobby}
        >
          Sair do Lobby
        </Button>
      </Box>
    </Paper>
  );
}
