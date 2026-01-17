'use client';

import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { Lobby } from '@/types';
import { calculateVotes } from '@/lib/game';

interface VotingResultsProps {
  lobby: Lobby;
  currentSession: string;
  onNextRound: () => void;
}

export default function VotingResults({
  lobby,
  currentSession,
  onNextRound,
}: VotingResultsProps) {
  const isAdmin = lobby.createdBy === currentSession;
  const voteResults = calculateVotes(lobby.players);
  const impostor = lobby.players.find((p) => p.isImpostor);
  const teamWon = lobby.winner === 'team';

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Resultado</Typography>
        <Chip label={`Round ${lobby.round}`} color="primary" />
      </Box>

      <Box
        sx={{
          bgcolor: teamWon ? 'success.light' : 'error.light',
          p: 3,
          borderRadius: 2,
          mb: 3,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          color={teamWon ? 'success.dark' : 'error.dark'}
          fontWeight="bold"
        >
          {teamWon ? 'Time Venceu!' : 'Impostor Venceu!'}
        </Typography>
        <Typography
          variant="body1"
          color={teamWon ? 'success.dark' : 'error.dark'}
          sx={{ mt: 1 }}
        >
          {teamWon
            ? 'O impostor foi descoberto!'
            : 'O impostor enganou a todos!'}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          O impostor era:
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {impostor?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          A palavra secreta era:
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {lobby.currentWord}
        </Typography>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Contagem de Votos
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List>
        {voteResults.map((result, index) => (
          <ListItem
            key={result.playerSession}
            sx={{
              bgcolor: result.isImpostor ? 'error.light' : 'transparent',
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemText
              primary={result.name}
              secondary={`${result.votes} voto${result.votes !== 1 ? 's' : ''}`}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              {index === 0 && result.votes > 0 && (
                <Chip label="Mais votado" color="warning" size="small" />
              )}
              {result.isImpostor && (
                <Chip label="Impostor" color="error" size="small" />
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onNextRound}
          sx={{ mt: 3 }}
        >
          Próximo Round
        </Button>
      )}
    </Paper>
  );
}
