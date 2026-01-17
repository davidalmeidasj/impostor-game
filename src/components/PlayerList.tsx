'use client';

import { List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import { Player } from '@/types';

interface PlayerListProps {
  players: Player[];
  adminSession: string;
  currentSession: string;
}

export default function PlayerList({
  players,
  adminSession,
  currentSession,
}: PlayerListProps) {
  return (
    <List>
      {players.map((player) => (
        <ListItem
          key={player.playerSession}
          sx={{
            bgcolor:
              player.playerSession === currentSession
                ? 'action.selected'
                : 'transparent',
            borderRadius: 1,
            mb: 1,
          }}
        >
          <ListItemText primary={player.name} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {player.playerSession === adminSession && (
              <Chip label="Admin" color="primary" size="small" />
            )}
            {player.playerSession === currentSession && (
              <Chip label="You" color="success" size="small" />
            )}
          </Box>
        </ListItem>
      ))}
    </List>
  );
}
