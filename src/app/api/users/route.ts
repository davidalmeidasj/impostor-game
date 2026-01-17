import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers, generateId } from '@/lib/storage';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { name, playerSession } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const users = await readUsers();

    // Check if user already exists
    const existingUser = users.find((u) => u.playerSession === playerSession);
    if (existingUser) {
      existingUser.name = name;
      existingUser.online = true;
      await writeUsers(users);
      return NextResponse.json(existingUser);
    }

    // Create new user
    const newUser: User = {
      playerSession: playerSession || generateId(),
      name: name.trim(),
      online: true,
    };

    users.push(newUser);
    await writeUsers(users);

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
