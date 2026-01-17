import {
  selectRandomImpostor,
  selectRandomWord,
  assignWordsToPlayers,
} from '@/lib/game';
import { Player, WordCategories } from '@/types';

describe('Game Logic', () => {
  describe('selectRandomImpostor', () => {
    it('should return a valid index within players array', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: null },
        { playerSession: '2', name: 'Player 2', isImpostor: false, assignedWord: null },
        { playerSession: '3', name: 'Player 3', isImpostor: false, assignedWord: null },
      ];

      const index = selectRandomImpostor(players);

      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(players.length);
    });

    it('should return 0 for single player', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: null },
      ];

      const index = selectRandomImpostor(players);

      expect(index).toBe(0);
    });

    it('should distribute impostors somewhat evenly over many runs', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: null },
        { playerSession: '2', name: 'Player 2', isImpostor: false, assignedWord: null },
        { playerSession: '3', name: 'Player 3', isImpostor: false, assignedWord: null },
      ];

      const counts = [0, 0, 0];
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const index = selectRandomImpostor(players);
        counts[index]++;
      }

      // Each player should be selected at least 20% of the time (with some margin)
      counts.forEach((count) => {
        expect(count).toBeGreaterThan(iterations * 0.2);
      });
    });
  });

  describe('selectRandomWord', () => {
    const mockWords: WordCategories = {
      animals: ['Dog', 'Cat', 'Bird'],
      food: ['Pizza', 'Burger'],
    };

    it('should return a word from the categories', () => {
      const word = selectRandomWord(mockWords);
      const allWords = Object.values(mockWords).flat();

      expect(allWords).toContain(word);
    });

    it('should handle single category', () => {
      const singleCategory: WordCategories = {
        animals: ['Dog'],
      };

      const word = selectRandomWord(singleCategory);

      expect(word).toBe('Dog');
    });

    it('should return different words over many runs', () => {
      const words = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        words.add(selectRandomWord(mockWords));
      }

      // Should have selected more than 1 unique word
      expect(words.size).toBeGreaterThan(1);
    });
  });

  describe('assignWordsToPlayers', () => {
    const players: Player[] = [
      { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: null },
      { playerSession: '2', name: 'Player 2', isImpostor: false, assignedWord: null },
      { playerSession: '3', name: 'Player 3', isImpostor: false, assignedWord: null },
    ];

    it('should assign the word to non-impostor players', () => {
      const word = 'TestWord';
      const impostorIndex = 1;

      const result = assignWordsToPlayers(players, word, impostorIndex);

      expect(result[0].assignedWord).toBe(word);
      expect(result[2].assignedWord).toBe(word);
    });

    it('should assign null to the impostor', () => {
      const word = 'TestWord';
      const impostorIndex = 1;

      const result = assignWordsToPlayers(players, word, impostorIndex);

      expect(result[1].assignedWord).toBeNull();
    });

    it('should mark only one player as impostor', () => {
      const word = 'TestWord';
      const impostorIndex = 0;

      const result = assignWordsToPlayers(players, word, impostorIndex);

      const impostorCount = result.filter((p) => p.isImpostor).length;
      expect(impostorCount).toBe(1);
    });

    it('should mark the correct player as impostor', () => {
      const word = 'TestWord';
      const impostorIndex = 2;

      const result = assignWordsToPlayers(players, word, impostorIndex);

      expect(result[0].isImpostor).toBe(false);
      expect(result[1].isImpostor).toBe(false);
      expect(result[2].isImpostor).toBe(true);
    });

    it('should not mutate the original players array', () => {
      const originalPlayers: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: null },
        { playerSession: '2', name: 'Player 2', isImpostor: false, assignedWord: null },
      ];
      const word = 'TestWord';
      const impostorIndex = 0;

      assignWordsToPlayers(originalPlayers, word, impostorIndex);

      expect(originalPlayers[0].isImpostor).toBe(false);
      expect(originalPlayers[0].assignedWord).toBeNull();
    });

    it('should preserve player session and name', () => {
      const word = 'TestWord';
      const impostorIndex = 1;

      const result = assignWordsToPlayers(players, word, impostorIndex);

      result.forEach((player, index) => {
        expect(player.playerSession).toBe(players[index].playerSession);
        expect(player.name).toBe(players[index].name);
      });
    });
  });
});
