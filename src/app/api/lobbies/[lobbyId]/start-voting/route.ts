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

    // Only admin can start voting
    if (lobby.createdBy !== playerSession) {
      return NextResponse.json(
        { error: 'Only the lobby admin can start voting' },
        { status: 403 }
      );
    }

    // Can only start voting when game is in progress
    if (lobby.status !== 'in_progress') {
      return NextResponse.json(
        { error: 'Game must be in progress to start voting' },
        { status: 400 }
      );
    }

    // Reset all votes and change status
    lobby.players = lobby.players.map((player) => ({
      ...player,
      votedFor: null,
    }));
    lobby.status = 'voting';
    lobby.winner = null;

    await writeLobbies(lobbies);

    return NextResponse.json(lobby);
  } catch (error) {
    console.error('Error starting voting:', error);
    return NextResponse.json({ error: 'Failed to start voting' }, { status: 500 });
  }
}
