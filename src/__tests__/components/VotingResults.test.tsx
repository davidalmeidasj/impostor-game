import { render, screen, fireEvent } from '@testing-library/react';
import VotingResults from '@/components/VotingResults';
import { Lobby } from '@/types';

describe('VotingResults', () => {
  const mockLobbyTeamWon: Lobby = {
    lobbyId: 'test-lobby',
    createdBy: 'admin-1',
    status: 'results',
    players: [
      { playerSession: 'admin-1', name: 'John', isImpostor: false, assignedWord: 'Pizza', votedFor: 'player-2' },
      { playerSession: 'player-2', name: 'Jane', isImpostor: true, assignedWord: null, votedFor: 'admin-1' },
      { playerSession: 'player-3', name: 'Bob', isImpostor: false, assignedWord: 'Pizza', votedFor: 'player-2' },
    ],
    currentWord: 'Pizza',
    round: 1,
    winner: 'team',
  };

  const mockLobbyImpostorWon: Lobby = {
    lobbyId: 'test-lobby',
    createdBy: 'admin-1',
    status: 'results',
    players: [
      { playerSession: 'admin-1', name: 'John', isImpostor: false, assignedWord: 'Pizza', votedFor: 'player-3' },
      { playerSession: 'player-2', name: 'Jane', isImpostor: true, assignedWord: null, votedFor: 'player-3' },
      { playerSession: 'player-3', name: 'Bob', isImpostor: false, assignedWord: 'Pizza', votedFor: 'admin-1' },
    ],
    currentWord: 'Pizza',
    round: 1,
    winner: 'impostor',
  };

  it('should display Resultado title', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('Resultado')).toBeInTheDocument();
  });

  it('should display round number', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('Round 1')).toBeInTheDocument();
  });

  it('should display Time Venceu when team wins', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('Time Venceu!')).toBeInTheDocument();
    expect(screen.getByText('O impostor foi descoberto!')).toBeInTheDocument();
  });

  it('should display Impostor Venceu when impostor wins', () => {
    render(
      <VotingResults
        lobby={mockLobbyImpostorWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('Impostor Venceu!')).toBeInTheDocument();
    expect(screen.getByText('O impostor enganou a todos!')).toBeInTheDocument();
  });

  it('should reveal who the impostor was', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('O impostor era:')).toBeInTheDocument();
    // Jane appears twice: in the impostor reveal and in the vote list
    expect(screen.getAllByText('Jane')).toHaveLength(2);
  });

  it('should reveal the secret word', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('A palavra secreta era:')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('should display vote counts for all players', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('Contagem de Votos')).toBeInTheDocument();
    expect(screen.getByText('2 votos')).toBeInTheDocument(); // Jane got 2 votes
    expect(screen.getByText('1 voto')).toBeInTheDocument(); // John got 1 vote
  });

  it('should mark the impostor in the vote list', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('Impostor')).toBeInTheDocument();
  });

  it('should mark the most voted player', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('Mais votado')).toBeInTheDocument();
  });

  it('should show Próximo Round button for admin', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('Próximo Round')).toBeInTheDocument();
  });

  it('should not show Próximo Round button for non-admin', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="player-2"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.queryByText('Próximo Round')).not.toBeInTheDocument();
  });

  it('should call onNextRound when clicking Próximo Round', () => {
    const onNextRound = jest.fn();
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={onNextRound}
      />
    );

    fireEvent.click(screen.getByText('Próximo Round'));
    expect(onNextRound).toHaveBeenCalledTimes(1);
  });

  it('should handle singular vote text', () => {
    const lobbyWithOneVote: Lobby = {
      ...mockLobbyTeamWon,
      players: [
        { playerSession: 'admin-1', name: 'John', isImpostor: false, assignedWord: 'Pizza', votedFor: 'player-2' },
        { playerSession: 'player-2', name: 'Jane', isImpostor: true, assignedWord: null, votedFor: null },
        { playerSession: 'player-3', name: 'Bob', isImpostor: false, assignedWord: 'Pizza', votedFor: null },
      ],
    };

    render(
      <VotingResults
        lobby={lobbyWithOneVote}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('1 voto')).toBeInTheDocument();
  });

  it('should display all players in vote results', () => {
    render(
      <VotingResults
        lobby={mockLobbyTeamWon}
        currentSession="admin-1"
        onNextRound={jest.fn()}
      />
    );

    expect(screen.getByText('John')).toBeInTheDocument();
    // Jane appears twice: in the impostor reveal and in the vote list
    expect(screen.getAllByText('Jane').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});
