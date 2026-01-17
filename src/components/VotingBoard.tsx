'use client';

import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Divider,
  Alert,
} from '@mui/material';
import { Lobby, Player } from '@/types';

interface VotingBoardProps {
  lobby: Lobby;
  currentPlayer: Player;
  currentSession: string;
  onVote: (votedFor: string) => void;
  onEndVoting: () => void;
}

export default function VotingBoard({
  lobby,
  currentPlayer,
  currentSession,
  onVote,
  onEndVoting,
}: VotingBoardProps) {
  const t = useTranslations();
  const isAdmin = lobby.createdBy === currentSession;
  const hasVoted = currentPlayer.votedFor !== null;
  const votedCount = lobby.players.filter((p) => p.votedFor !== null).length;
  const totalPlayers = lobby.players.length;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">{t('voting.title')}</Typography>
        <Chip label={t('game.round', { round: lobby.round })} color="primary" />
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        {currentPlayer.isImpostor
          ? t('voting.youAreImpostorHint')
          : t('voting.yourWordWas', { word: currentPlayer.assignedWord || '' })}
      </Alert>

      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('voting.votesCount', { current: votedCount, total: totalPlayers })}
        </Typography>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        {t('voting.whoIsImpostor')}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <List>
        {lobby.players
          .filter((p) => p.playerSession !== currentSession)
          .map((player) => (
            <ListItem key={player.playerSession} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => onVote(player.playerSession)}
                disabled={hasVoted}
                selected={currentPlayer.votedFor === player.playerSession}
                sx={{
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor:
                    currentPlayer.votedFor === player.playerSession
                      ? 'primary.main'
                      : 'grey.300',
                }}
              >
                <ListItemText primary={player.name} />
                {currentPlayer.votedFor === player.playerSession && (
                  <Chip label={t('voting.yourVote')} color="primary" size="small" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
      </List>

      {hasVoted && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {t('voting.voteRegistered')}
        </Alert>
      )}

      {isAdmin && (
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={onEndVoting}
          sx={{ mt: 3 }}
        >
          {t('voting.endVoting')}
        </Button>
      )}
    </Paper>
  );
}
