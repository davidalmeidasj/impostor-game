import { NextRequest, NextResponse } from 'next/server';
import { readLobbies, writeLobbies } from '@/lib/storage';
import { determineWinner } from '@/lib/game';

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

    // Only admin can end voting
    if (lobby.createdBy !== playerSession) {
      return NextResponse.json(
        { error: 'Only the lobby admin can end voting' },
        { status: 403 }
      );
    }

    // Can only end voting during voting phase
    if (lobby.status !== 'voting') {
      return NextResponse.json(
        { error: 'Voting is not active' },
        { status: 400 }
      );
    }

    // Determine winner and update status
    lobby.winner = determineWinner(lobby.players);
    lobby.status = 'results';

    await writeLobbies(lobbies);

    return NextResponse.json(lobby);
  } catch (error) {
    console.error('Error ending voting:', error);
    return NextResponse.json({ error: 'Failed to end voting' }, { status: 500 });
  }
}
