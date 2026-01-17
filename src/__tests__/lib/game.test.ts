import {
  selectRandomImpostor,
  selectRandomWord,
  assignWordsToPlayers,
  calculateVotes,
  determineWinner,
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

  describe('calculateVotes', () => {
    it('should count votes correctly', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
        { playerSession: '2', name: 'Player 2', isImpostor: true, assignedWord: null, votedFor: '3' },
        { playerSession: '3', name: 'Player 3', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
      ];

      const result = calculateVotes(players);

      expect(result[0].playerSession).toBe('2');
      expect(result[0].votes).toBe(2);
      expect(result[1].playerSession).toBe('3');
      expect(result[1].votes).toBe(1);
      expect(result[2].playerSession).toBe('1');
      expect(result[2].votes).toBe(0);
    });

    it('should return all players with zero votes when no one voted', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: null },
        { playerSession: '2', name: 'Player 2', isImpostor: true, assignedWord: null, votedFor: null },
      ];

      const result = calculateVotes(players);

      expect(result.every((r) => r.votes === 0)).toBe(true);
    });

    it('should include isImpostor flag in results', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
        { playerSession: '2', name: 'Player 2', isImpostor: true, assignedWord: null, votedFor: '1' },
      ];

      const result = calculateVotes(players);
      const impostorResult = result.find((r) => r.playerSession === '2');

      expect(impostorResult?.isImpostor).toBe(true);
    });

    it('should sort results by votes descending', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: '3' },
        { playerSession: '2', name: 'Player 2', isImpostor: false, assignedWord: 'Word', votedFor: '3' },
        { playerSession: '3', name: 'Player 3', isImpostor: true, assignedWord: null, votedFor: '1' },
        { playerSession: '4', name: 'Player 4', isImpostor: false, assignedWord: 'Word', votedFor: '3' },
      ];

      const result = calculateVotes(players);

      expect(result[0].votes).toBeGreaterThanOrEqual(result[1].votes);
      expect(result[1].votes).toBeGreaterThanOrEqual(result[2].votes);
      expect(result[2].votes).toBeGreaterThanOrEqual(result[3].votes);
    });

    it('should include player name in results', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'John', isImpostor: false, assignedWord: 'Word', votedFor: null },
      ];

      const result = calculateVotes(players);

      expect(result[0].name).toBe('John');
    });
  });

  describe('determineWinner', () => {
    it('should return team when impostor gets majority votes', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
        { playerSession: '2', name: 'Player 2', isImpostor: true, assignedWord: null, votedFor: '1' },
        { playerSession: '3', name: 'Player 3', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
      ];

      const result = determineWinner(players);

      expect(result).toBe('team');
    });

    it('should return impostor when non-impostor gets most votes', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: '3' },
        { playerSession: '2', name: 'Player 2', isImpostor: true, assignedWord: null, votedFor: '3' },
        { playerSession: '3', name: 'Player 3', isImpostor: false, assignedWord: 'Word', votedFor: '1' },
      ];

      const result = determineWinner(players);

      expect(result).toBe('impostor');
    });

    it('should return impostor when no one votes', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: null },
        { playerSession: '2', name: 'Player 2', isImpostor: true, assignedWord: null, votedFor: null },
      ];

      const result = determineWinner(players);

      expect(result).toBe('impostor');
    });

    it('should return impostor when impostor does not get majority', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
        { playerSession: '2', name: 'Player 2', isImpostor: true, assignedWord: null, votedFor: '1' },
        { playerSession: '3', name: 'Player 3', isImpostor: false, assignedWord: 'Word', votedFor: '1' },
        { playerSession: '4', name: 'Player 4', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
      ];

      // 2 votes for impostor (player 2), 2 votes for player 1
      // Impostor has 2 votes out of 4 total = 50%, not majority (needs > 50%)
      const result = determineWinner(players);

      expect(result).toBe('impostor');
    });

    it('should return team when impostor has clear majority', () => {
      const players: Player[] = [
        { playerSession: '1', name: 'Player 1', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
        { playerSession: '2', name: 'Player 2', isImpostor: true, assignedWord: null, votedFor: '1' },
        { playerSession: '3', name: 'Player 3', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
        { playerSession: '4', name: 'Player 4', isImpostor: false, assignedWord: 'Word', votedFor: '2' },
      ];

      // 3 votes for impostor out of 4 total = 75% > 50%
      const result = determineWinner(players);

      expect(result).toBe('team');
    });

    it('should return impostor for empty players array', () => {
      const players: Player[] = [];

      const result = determineWinner(players);

      expect(result).toBe('impostor');
    });
  });
});
