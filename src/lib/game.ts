import { Player, WordCategories } from '@/types';

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
  }));
}
