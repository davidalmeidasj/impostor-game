export interface Player {
  playerSession: string;
  name: string;
  isImpostor: boolean;
  assignedWord: string | null;
  votedFor: string | null; // playerSession of who they voted for
}

export interface Lobby {
  lobbyId: string;
  createdBy: string;
  status: 'waiting' | 'in_progress' | 'voting' | 'results';
  players: Player[];
  currentWord: string | null;
  round: number;
  winner: 'impostor' | 'team' | null; // who won the round
}

export interface User {
  playerSession: string;
  name: string;
  online: boolean;
}

export interface WordCategories {
  [category: string]: string[];
}

export interface VoteCount {
  playerSession: string;
  name: string;
  votes: number;
  isImpostor: boolean;
}
