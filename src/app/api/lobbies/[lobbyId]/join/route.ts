import { NextRequest, NextResponse } from 'next/server';
import { readLobbies, writeLobbies } from '@/lib/storage';
import { Player } from '@/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lobbyId: string }> }
) {
  try {
    const { lobbyId } = await params;
    const { playerSession, playerName } = await request.json();

    if (!playerSession || !playerName) {
      return NextResponse.json(
        { error: 'Player session and name are required' },
        { status: 400 }
      );
    }

    const lobbies = await readLobbies();
    const lobby = lobbies.find((l) => l.lobbyId === lobbyId);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    // Check if player is already in lobby
    const existingPlayer = lobby.players.find((p) => p.playerSession === playerSession);
    if (existingPlayer) {
      return NextResponse.json({ error: 'Player already in lobby' }, { status: 400 });
    }

    // Check if game is already in progress
    if (lobby.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Game is already in progress' },
        { status: 400 }
      );
    }

    const newPlayer: Player = {
      playerSession,
      name: playerName,
      isImpostor: false,
      assignedWord: null,
      votedFor: null,
    };

    lobby.players.push(newPlayer);
    await writeLobbies(lobbies);

    return NextResponse.json(lobby);
  } catch (error) {
    console.error('Error joining lobby:', error);
    return NextResponse.json({ error: 'Failed to join lobby' }, { status: 500 });
  }
}
