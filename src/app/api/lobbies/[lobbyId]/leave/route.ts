import { NextRequest, NextResponse } from 'next/server';
import { readLobbies, writeLobbies } from '@/lib/storage';

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

    const playerIndex = lobby.players.findIndex(
      (p) => p.playerSession === playerSession
    );

    if (playerIndex === -1) {
      return NextResponse.json({ error: 'Player not in lobby' }, { status: 400 });
    }

    lobby.players.splice(playerIndex, 1);

    // If lobby is empty, remove it
    if (lobby.players.length === 0) {
      const lobbyIndex = lobbies.findIndex((l) => l.lobbyId === lobbyId);
      lobbies.splice(lobbyIndex, 1);
    } else if (lobby.createdBy === playerSession) {
      // If the admin left, assign new admin
      lobby.createdBy = lobby.players[0].playerSession;
    }

    await writeLobbies(lobbies);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving lobby:', error);
    return NextResponse.json({ error: 'Failed to leave lobby' }, { status: 500 });
  }
}
