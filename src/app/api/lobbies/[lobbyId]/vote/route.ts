import { NextRequest, NextResponse } from 'next/server';
import { readLobbies, writeLobbies } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lobbyId: string }> }
) {
  try {
    const { lobbyId } = await params;
    const { playerSession, votedFor } = await request.json();

    if (!playerSession || !votedFor) {
      return NextResponse.json(
        { error: 'Player session and vote target are required' },
        { status: 400 }
      );
    }

    const lobbies = await readLobbies();
    const lobby = lobbies.find((l) => l.lobbyId === lobbyId);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    // Can only vote during voting phase
    if (lobby.status !== 'voting') {
      return NextResponse.json(
        { error: 'Voting is not active' },
        { status: 400 }
      );
    }

    // Find the voting player
    const votingPlayer = lobby.players.find((p) => p.playerSession === playerSession);
    if (!votingPlayer) {
      return NextResponse.json({ error: 'Player not in lobby' }, { status: 400 });
    }

    // Cannot vote for yourself
    if (playerSession === votedFor) {
      return NextResponse.json(
        { error: 'Cannot vote for yourself' },
        { status: 400 }
      );
    }

    // Verify the target exists
    const targetPlayer = lobby.players.find((p) => p.playerSession === votedFor);
    if (!targetPlayer) {
      return NextResponse.json({ error: 'Vote target not found' }, { status: 400 });
    }

    // Record the vote
    votingPlayer.votedFor = votedFor;

    await writeLobbies(lobbies);

    return NextResponse.json(lobby);
  } catch (error) {
    console.error('Error voting:', error);
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 });
  }
}
