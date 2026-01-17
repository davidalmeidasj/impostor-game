import { Redis } from '@upstash/redis';
import { Lobby, User, WordCategories } from '@/types';

const LOBBIES_KEY = 'impostor:lobbies';
const USERS_KEY = 'impostor:users';

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

export async function readWords(): Promise<WordCategories> {
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
