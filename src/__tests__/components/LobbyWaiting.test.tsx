import { render, screen, fireEvent } from '@testing-library/react';
import LobbyWaiting from '@/components/LobbyWaiting';
import { Lobby } from '@/types';

describe('LobbyWaiting', () => {
  const createMockLobby = (playerCount: number): Lobby => ({
    lobbyId: 'abc123',
    createdBy: 'admin-1',
    status: 'waiting',
    players: Array.from({ length: playerCount }, (_, i) => ({
      playerSession: i === 0 ? 'admin-1' : `player-${i + 1}`,
      name: `Player ${i + 1}`,
      isImpostor: false,
      assignedWord: null,
      votedFor: null,
    })),
    currentWord: null,
    round: 0,
    winner: null,
    locale: 'en',
  });

  it('should display lobby code', () => {
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('abc123')).toBeInTheDocument();
  });

  it('should display all players', () => {
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
  });

  it('should show Start Game button for admin', () => {
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('should not show Start Game button for non-admin', () => {
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="player-2"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.queryByText('Start Game')).not.toBeInTheDocument();
  });

  it('should disable Start Game button with less than 3 players', () => {
    const lobby = createMockLobby(2);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    const startButton = screen.getByText('Start Game');
    expect(startButton).toBeDisabled();
  });

  it('should enable Start Game button with 3+ players', () => {
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    const startButton = screen.getByText('Start Game');
    expect(startButton).not.toBeDisabled();
  });

  it('should show minimum players warning when less than 3 players', () => {
    const lobby = createMockLobby(2);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('Minimum 3 players required to start the game')).toBeInTheDocument();
  });

  it('should not show minimum players warning with 3+ players', () => {
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.queryByText('Minimum 3 players required to start the game')).not.toBeInTheDocument();
  });

  it('should call onStartGame when Start Game is clicked', () => {
    const onStartGame = jest.fn();
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={onStartGame}
        onLeaveLobby={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Start Game'));
    expect(onStartGame).toHaveBeenCalledTimes(1);
  });

  it('should call onLeaveLobby when Leave Lobby is clicked', () => {
    const onLeaveLobby = jest.fn();
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={onLeaveLobby}
      />
    );

    fireEvent.click(screen.getByText('Leave Lobby'));
    expect(onLeaveLobby).toHaveBeenCalledTimes(1);
  });

  it('should display error message when provided', () => {
    const lobby = createMockLobby(3);
    render(
      <LobbyWaiting
        lobby={lobby}
        currentSession="admin-1"
        onStartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
        error="Something went wrong"
      />
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
