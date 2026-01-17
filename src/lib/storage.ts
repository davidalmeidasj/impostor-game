import { kv } from '@vercel/kv';
import { Lobby, User, WordCategories } from '@/types';

const LOBBIES_KEY = 'impostor:lobbies';
const USERS_KEY = 'impostor:users';

// In-memory fallback for local development
let inMemoryLobbies: Lobby[] = [];
let inMemoryUsers: User[] = [];

function isVercelKVConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function readLobbies(): Promise<Lobby[]> {
  if (isVercelKVConfigured()) {
    const lobbies = await kv.get<Lobby[]>(LOBBIES_KEY);
    return lobbies || [];
  }
  return inMemoryLobbies;
}

export async function writeLobbies(lobbies: Lobby[]): Promise<void> {
  if (isVercelKVConfigured()) {
    await kv.set(LOBBIES_KEY, lobbies);
  } else {
    inMemoryLobbies = lobbies;
  }
}

export async function readUsers(): Promise<User[]> {
  if (isVercelKVConfigured()) {
    const users = await kv.get<User[]>(USERS_KEY);
    return users || [];
  }
  return inMemoryUsers;
}

export async function writeUsers(users: User[]): Promise<void> {
  if (isVercelKVConfigured()) {
    await kv.set(USERS_KEY, users);
  } else {
    inMemoryUsers = users;
  }
}

export async function readWords(): Promise<WordCategories> {
  // Words are static, no need for database storage
  return {
    superheroes: ['Superman', 'Batman', 'Spider-Man', 'Wonder Woman', 'Iron Man', 'Thor', 'Hulk', 'Captain America'],
    brazilian_states: ['São Paulo', 'Rio de Janeiro', 'Bahia', 'Minas Gerais', 'Paraná', 'Santa Catarina', 'Ceará', 'Pernambuco'],
    objects: ['Chair', 'Phone', 'Backpack', 'Laptop', 'Book', 'Umbrella', 'Watch', 'Sunglasses'],
    human_body_parts: ['Arm', 'Leg', 'Heart', 'Brain', 'Stomach', 'Kidney', 'Lung', 'Eye'],
    animals: ['Dog', 'Cat', 'Elephant', 'Lion', 'Eagle', 'Dolphin', 'Snake', 'Penguin'],
    food: ['Pizza', 'Hamburger', 'Sushi', 'Pasta', 'Taco', 'Salad', 'Ice Cream', 'Chocolate'],
    countries: ['Brazil', 'Japan', 'France', 'Germany', 'Australia', 'Canada', 'Mexico', 'Italy'],
    sports: ['Soccer', 'Basketball', 'Tennis', 'Swimming', 'Volleyball', 'Golf', 'Boxing', 'Cycling'],
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
