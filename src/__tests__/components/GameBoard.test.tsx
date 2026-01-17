import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from '@/components/GameBoard';
import { Lobby, Player } from '@/types';

describe('GameBoard', () => {
  const mockLobby: Lobby = {
    lobbyId: 'test-lobby',
    createdBy: 'admin-1',
    status: 'in_progress',
    players: [
      { playerSession: 'admin-1', name: 'John', isImpostor: false, assignedWord: 'Pizza' },
      { playerSession: 'player-2', name: 'Jane', isImpostor: true, assignedWord: null },
    ],
    currentWord: 'Pizza',
    round: 1,
  };

  const mockNonImpostorPlayer: Player = {
    playerSession: 'admin-1',
    name: 'John',
    isImpostor: false,
    assignedWord: 'Pizza',
  };

  const mockImpostorPlayer: Player = {
    playerSession: 'player-2',
    name: 'Jane',
    isImpostor: true,
    assignedWord: null,
  };

  it('should display the secret word for non-impostor', () => {
    render(
      <GameBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onRestartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Your secret word is:')).toBeInTheDocument();
  });

  it('should display impostor message for impostor', () => {
    render(
      <GameBoard
        lobby={mockLobby}
        currentPlayer={mockImpostorPlayer}
        currentSession="player-2"
        onRestartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('You are the Impostor!')).toBeInTheDocument();
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument();
  });

  it('should display round number', () => {
    render(
      <GameBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onRestartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('Round 1')).toBeInTheDocument();
  });

  it('should show New Round button for admin', () => {
    render(
      <GameBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onRestartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('New Round')).toBeInTheDocument();
  });

  it('should not show New Round button for non-admin', () => {
    render(
      <GameBoard
        lobby={mockLobby}
        currentPlayer={mockImpostorPlayer}
        currentSession="player-2"
        onRestartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.queryByText('New Round')).not.toBeInTheDocument();
  });

  it('should call onRestartGame when New Round is clicked', () => {
    const onRestartGame = jest.fn();
    render(
      <GameBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onRestartGame={onRestartGame}
        onLeaveLobby={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('New Round'));
    expect(onRestartGame).toHaveBeenCalledTimes(1);
  });

  it('should call onLeaveLobby when Leave Lobby is clicked', () => {
    const onLeaveLobby = jest.fn();
    render(
      <GameBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onRestartGame={jest.fn()}
        onLeaveLobby={onLeaveLobby}
      />
    );

    fireEvent.click(screen.getByText('Leave Lobby'));
    expect(onLeaveLobby).toHaveBeenCalledTimes(1);
  });

  it('should display all players', () => {
    render(
      <GameBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onRestartGame={jest.fn()}
        onLeaveLobby={jest.fn()}
      />
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });
});
