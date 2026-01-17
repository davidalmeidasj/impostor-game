import { NextRequest, NextResponse } from 'next/server';
import { readLobbies, writeLobbies, generateId } from '@/lib/storage';
import { Lobby, Player } from '@/types';

export async function GET() {
  try {
    const lobbies = await readLobbies();
    return NextResponse.json(lobbies);
  } catch (error) {
    console.error('Error reading lobbies:', error);
    return NextResponse.json({ error: 'Failed to read lobbies' }, { status: 500 });
  }
}

const VALID_LOCALES = ['en', 'pt-BR', 'es'];

export async function POST(request: NextRequest) {
  try {
    const { playerSession, playerName, locale } = await request.json();

    if (!playerSession || !playerName) {
      return NextResponse.json(
        { error: 'Player session and name are required' },
        { status: 400 }
      );
    }

    const lobbies = await readLobbies();

    const player: Player = {
      playerSession,
      name: playerName,
      isImpostor: false,
      assignedWord: null,
      votedFor: null,
    };

    // Validate and default locale
    const safeLocale = VALID_LOCALES.includes(locale) ? locale : 'en';

    const newLobby: Lobby = {
      lobbyId: generateId(),
      createdBy: playerSession,
      status: 'waiting',
      players: [player],
      currentWord: null,
      round: 0,
      winner: null,
      locale: safeLocale,
    };

    lobbies.push(newLobby);
    await writeLobbies(lobbies);

    return NextResponse.json(newLobby);
  } catch (error) {
    console.error('Error creating lobby:', error);
    return NextResponse.json({ error: 'Failed to create lobby' }, { status: 500 });
  }
}
