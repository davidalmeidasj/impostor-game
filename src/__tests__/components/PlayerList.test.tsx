import { render, screen } from '@testing-library/react';
import PlayerList from '@/components/PlayerList';
import { Player } from '@/types';

describe('PlayerList', () => {
  const mockPlayers: Player[] = [
    { playerSession: 'admin-1', name: 'Admin Player', isImpostor: false, assignedWord: 'Word', votedFor: null },
    { playerSession: 'player-2', name: 'Regular Player', isImpostor: false, assignedWord: 'Word', votedFor: null },
    { playerSession: 'player-3', name: 'Another Player', isImpostor: true, assignedWord: null, votedFor: null },
  ];

  it('should render all players', () => {
    render(
      <PlayerList
        players={mockPlayers}
        adminSession="admin-1"
        currentSession="player-2"
      />
    );

    expect(screen.getByText('Admin Player')).toBeInTheDocument();
    expect(screen.getByText('Regular Player')).toBeInTheDocument();
    expect(screen.getByText('Another Player')).toBeInTheDocument();
  });

  it('should show Admin chip for lobby creator', () => {
    render(
      <PlayerList
        players={mockPlayers}
        adminSession="admin-1"
        currentSession="player-2"
      />
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should show You chip for current player', () => {
    render(
      <PlayerList
        players={mockPlayers}
        adminSession="admin-1"
        currentSession="player-2"
      />
    );

    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('should show both Admin and You chips when current player is admin', () => {
    render(
      <PlayerList
        players={mockPlayers}
        adminSession="admin-1"
        currentSession="admin-1"
      />
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('should render empty list when no players', () => {
    render(
      <PlayerList
        players={[]}
        adminSession="admin-1"
        currentSession="player-2"
      />
    );

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
