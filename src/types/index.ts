export interface Player {
  playerSession: string;
  name: string;
  isImpostor: boolean;
  assignedWord: string | null;
}

export interface Lobby {
  lobbyId: string;
  createdBy: string;
  status: 'waiting' | 'in_progress';
  players: Player[];
  currentWord: string | null;
  round: number;
}

export interface User {
  playerSession: string;
  name: string;
  online: boolean;
}

export interface WordCategories {
  [category: string]: string[];
}
