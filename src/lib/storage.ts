import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';
import { Lobby, User, WordCategories } from '@/types';

const LOBBIES_KEY = 'impostor:lobbies';
const USERS_KEY = 'impostor:users';
const VALID_LOCALES = ['en', 'pt-BR', 'es'];

// In-memory fallback for local development
let inMemoryLobbies: Lobby[] = [];
let inMemoryUsers: User[] = [];

// Create Redis client if environment variables are set
function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

export async function readLobbies(): Promise<Lobby[]> {
  const redis = getRedisClient();
  if (redis) {
    const lobbies = await redis.get<Lobby[]>(LOBBIES_KEY);
    return lobbies || [];
  }
  return inMemoryLobbies;
}

export async function writeLobbies(lobbies: Lobby[]): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    await redis.set(LOBBIES_KEY, lobbies);
  } else {
    inMemoryLobbies = lobbies;
  }
}

export async function readUsers(): Promise<User[]> {
  const redis = getRedisClient();
  if (redis) {
    const users = await redis.get<User[]>(USERS_KEY);
    return users || [];
  }
  return inMemoryUsers;
}

export async function writeUsers(users: User[]): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    await redis.set(USERS_KEY, users);
  } else {
    inMemoryUsers = users;
  }
}

export async function readWords(locale: string = 'en'): Promise<WordCategories> {
  // Validate locale
  const safeLocale = VALID_LOCALES.includes(locale) ? locale : 'en';

  try {
    const wordsPath = path.join(process.cwd(), 'data', 'words', `${safeLocale}.json`);
    const wordsData = fs.readFileSync(wordsPath, 'utf-8');
    return JSON.parse(wordsData) as WordCategories;
  } catch {
    // Fallback to English if locale file not found
    const wordsPath = path.join(process.cwd(), 'data', 'words', 'en.json');
    const wordsData = fs.readFileSync(wordsPath, 'utf-8');
    return JSON.parse(wordsData) as WordCategories;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
