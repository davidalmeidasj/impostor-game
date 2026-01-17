import { Player, WordCategories, VoteCount } from '@/types';

export function selectRandomImpostor(players: Player[]): number {
  return Math.floor(Math.random() * players.length);
}

export function selectRandomWord(words: WordCategories): string {
  const categories = Object.keys(words);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const wordsInCategory = words[randomCategory];
  return wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
}

export function assignWordsToPlayers(
  players: Player[],
  word: string,
  impostorIndex: number
): Player[] {
  return players.map((player, index) => ({
    ...player,
    isImpostor: index === impostorIndex,
    assignedWord: index === impostorIndex ? null : word,
    votedFor: null,
  }));
}

export function calculateVotes(players: Player[]): VoteCount[] {
  const voteCounts: Record<string, VoteCount> = {};

  // Initialize vote counts for all players
  players.forEach((player) => {
    voteCounts[player.playerSession] = {
      playerSession: player.playerSession,
      name: player.name,
      votes: 0,
      isImpostor: player.isImpostor,
    };
  });

  // Count votes
  players.forEach((player) => {
    if (player.votedFor && voteCounts[player.votedFor]) {
      voteCounts[player.votedFor].votes++;
    }
  });

  // Sort by votes descending
  return Object.values(voteCounts).sort((a, b) => b.votes - a.votes);
}

export function determineWinner(players: Player[]): 'impostor' | 'team' {
  const voteResults = calculateVotes(players);

  if (voteResults.length === 0) {
    return 'impostor';
  }

  const topVoted = voteResults[0];
  const totalVotes = players.filter(p => p.votedFor !== null).length;

  // Team wins if the most voted player is the impostor AND has majority
  if (topVoted.isImpostor && topVoted.votes > totalVotes / 2) {
    return 'team';
  }

  return 'impostor';
}
