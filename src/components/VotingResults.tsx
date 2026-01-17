'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations();
  const isAdmin = lobby.createdBy === currentSession;
  const voteResults = calculateVotes(lobby.players);
  const impostor = lobby.players.find((p) => p.isImpostor);
  const teamWon = lobby.winner === 'team';

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">{t('results.title')}</Typography>
        <Chip label={t('game.round', { round: lobby.round })} color="primary" />
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
          {teamWon ? t('results.teamWon') : t('results.impostorWon')}
        </Typography>
        <Typography
          variant="body1"
          color={teamWon ? 'success.dark' : 'error.dark'}
          sx={{ mt: 1 }}
        >
          {teamWon
            ? t('results.impostorDiscovered')
            : t('results.impostorFooledEveryone')}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          {t('results.theImpostorWas')}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {impostor?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('results.theSecretWordWas')}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {lobby.currentWord}
        </Typography>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        {t('results.voteCount')}
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
              secondary={result.votes === 1
                ? t('results.voteSingular', { count: result.votes })
                : t('results.votePlural', { count: result.votes })}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              {index === 0 && result.votes > 0 && (
                <Chip label={t('results.mostVoted')} color="warning" size="small" />
              )}
              {result.isImpostor && (
                <Chip label={t('results.impostor')} color="error" size="small" />
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
          {t('results.nextRound')}
        </Button>
      )}
    </Paper>
  );
}
