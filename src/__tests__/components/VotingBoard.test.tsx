import { render, screen, fireEvent } from '@testing-library/react';
import VotingBoard from '@/components/VotingBoard';
import { Lobby, Player } from '@/types';

describe('VotingBoard', () => {
  const mockLobby: Lobby = {
    lobbyId: 'test-lobby',
    createdBy: 'admin-1',
    status: 'voting',
    players: [
      { playerSession: 'admin-1', name: 'John', isImpostor: false, assignedWord: 'Pizza', votedFor: null },
      { playerSession: 'player-2', name: 'Jane', isImpostor: true, assignedWord: null, votedFor: null },
      { playerSession: 'player-3', name: 'Bob', isImpostor: false, assignedWord: 'Pizza', votedFor: null },
    ],
    currentWord: 'Pizza',
    round: 1,
    winner: null,
    locale: 'en',
  };

  const mockNonImpostorPlayer: Player = {
    playerSession: 'admin-1',
    name: 'John',
    isImpostor: false,
    assignedWord: 'Pizza',
    votedFor: null,
  };

  const mockImpostorPlayer: Player = {
    playerSession: 'player-2',
    name: 'Jane',
    isImpostor: true,
    assignedWord: null,
    votedFor: null,
  };

  const mockPlayerWhoVoted: Player = {
    playerSession: 'admin-1',
    name: 'John',
    isImpostor: false,
    assignedWord: 'Pizza',
    votedFor: 'player-2',
  };

  it('should display voting title', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText('Voting')).toBeInTheDocument();
  });

  it('should display round number', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText('Round 1')).toBeInTheDocument();
  });

  it('should show the word for non-impostor players', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText(/Your word was: Pizza/)).toBeInTheDocument();
  });

  it('should show impostor message for impostor players', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockImpostorPlayer}
        currentSession="player-2"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText(/You are the impostor!/)).toBeInTheDocument();
  });

  it('should display other players to vote for (excluding self)', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    // Should not show current player in voting list
    expect(screen.queryAllByText('John')).toHaveLength(0);
  });

  it('should call onVote when clicking a player', () => {
    const onVote = jest.fn();
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onVote={onVote}
        onEndVoting={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText('Jane'));
    expect(onVote).toHaveBeenCalledWith('player-2');
  });

  it('should show End Voting button for admin', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText('End Voting')).toBeInTheDocument();
  });

  it('should not show End Voting button for non-admin', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockImpostorPlayer}
        currentSession="player-2"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.queryByText('End Voting')).not.toBeInTheDocument();
  });

  it('should call onEndVoting when clicking End Voting', () => {
    const onEndVoting = jest.fn();
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={onEndVoting}
      />
    );

    fireEvent.click(screen.getByText('End Voting'));
    expect(onEndVoting).toHaveBeenCalledTimes(1);
  });

  it('should display vote count', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockNonImpostorPlayer}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText('Votes: 0 / 3')).toBeInTheDocument();
  });

  it('should show success message after voting', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockPlayerWhoVoted}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText('Vote registered! Waiting for other players...')).toBeInTheDocument();
  });

  it('should disable voting buttons after player has voted', () => {
    const onVote = jest.fn();
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockPlayerWhoVoted}
        currentSession="admin-1"
        onVote={onVote}
        onEndVoting={jest.fn()}
      />
    );

    const janeButton = screen.getByText('Jane').closest('div[role="button"]');
    expect(janeButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should show Your vote chip on voted player', () => {
    render(
      <VotingBoard
        lobby={mockLobby}
        currentPlayer={mockPlayerWhoVoted}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText('Your vote')).toBeInTheDocument();
  });

  it('should update vote count when players have voted', () => {
    const lobbyWithVotes: Lobby = {
      ...mockLobby,
      players: [
        { playerSession: 'admin-1', name: 'John', isImpostor: false, assignedWord: 'Pizza', votedFor: 'player-2' },
        { playerSession: 'player-2', name: 'Jane', isImpostor: true, assignedWord: null, votedFor: 'player-3' },
        { playerSession: 'player-3', name: 'Bob', isImpostor: false, assignedWord: 'Pizza', votedFor: null },
      ],
    };

    render(
      <VotingBoard
        lobby={lobbyWithVotes}
        currentPlayer={mockPlayerWhoVoted}
        currentSession="admin-1"
        onVote={jest.fn()}
        onEndVoting={jest.fn()}
      />
    );

    expect(screen.getByText('Votes: 2 / 3')).toBeInTheDocument();
  });
});
