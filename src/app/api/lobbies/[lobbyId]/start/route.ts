import { NextRequest, NextResponse } from 'next/server';
import { readLobbies, writeLobbies, readWords } from '@/lib/storage';
import { selectRandomImpostor, selectRandomWord, assignWordsToPlayers } from '@/lib/game';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lobbyId: string }> }
) {
  try {
    const { lobbyId } = await params;
    const { playerSession } = await request.json();

    if (!playerSession) {
      return NextResponse.json(
        { error: 'Player session is required' },
        { status: 400 }
      );
    }

    const lobbies = await readLobbies();
    const lobby = lobbies.find((l) => l.lobbyId === lobbyId);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    // Only admin can start the game
    if (lobby.createdBy !== playerSession) {
      return NextResponse.json(
        { error: 'Only the lobby admin can start the game' },
        { status: 403 }
      );
    }

    // Minimum 3 players required
    if (lobby.players.length < 3) {
      return NextResponse.json(
        { error: 'Minimum 3 players required to start the game' },
        { status: 400 }
      );
    }

    // Select random word and impostor
    const words = await readWords();
    const selectedWord = selectRandomWord(words);
    const impostorIndex = selectRandomImpostor(lobby.players);

    // Assign words to players
    lobby.players = assignWordsToPlayers(lobby.players, selectedWord, impostorIndex);
    lobby.currentWord = selectedWord;
    lobby.status = 'in_progress';
    lobby.round = 1;

    await writeLobbies(lobbies);

    return NextResponse.json(lobby);
  } catch (error) {
    console.error('Error starting game:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}
