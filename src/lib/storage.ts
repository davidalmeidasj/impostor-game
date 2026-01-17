import { promises as fs } from 'fs';
import path from 'path';
import { Lobby, User, WordCategories } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function readLobbies(): Promise<Lobby[]> {
  const filePath = path.join(DATA_DIR, 'lobbies.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function writeLobbies(lobbies: Lobby[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'lobbies.json');
  await fs.writeFile(filePath, JSON.stringify(lobbies, null, 2));
}

export async function readUsers(): Promise<User[]> {
  const filePath = path.join(DATA_DIR, 'users.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function writeUsers(users: User[]): Promise<void> {
  const filePath = path.join(DATA_DIR, 'users.json');
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

export async function readWords(): Promise<WordCategories> {
  const filePath = path.join(DATA_DIR, 'words.json');
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
