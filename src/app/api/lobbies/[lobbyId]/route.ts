import { NextRequest, NextResponse } from 'next/server';
import { readLobbies, writeLobbies } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lobbyId: string }> }
) {
  try {
    const { lobbyId } = await params;
    const lobbies = await readLobbies();
    const lobby = lobbies.find((l) => l.lobbyId === lobbyId);

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    return NextResponse.json(lobby);
  } catch (error) {
    console.error('Error reading lobby:', error);
    return NextResponse.json({ error: 'Failed to read lobby' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lobbyId: string }> }
) {
  try {
    const { lobbyId } = await params;
    const lobbies = await readLobbies();
    const lobbyIndex = lobbies.findIndex((l) => l.lobbyId === lobbyId);

    if (lobbyIndex === -1) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    lobbies.splice(lobbyIndex, 1);
    await writeLobbies(lobbies);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lobby:', error);
    return NextResponse.json({ error: 'Failed to delete lobby' }, { status: 500 });
  }
}
