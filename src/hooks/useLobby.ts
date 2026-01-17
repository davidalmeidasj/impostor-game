'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lobby } from '@/types';

interface UseLobbyResult {
  lobby: Lobby | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLobby(lobbyId: string): UseLobbyResult {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLobby = useCallback(async () => {
    try {
      const response = await fetch(`/api/lobbies/${lobbyId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Lobby not found');
          setLobby(null);
          return;
        }
        throw new Error('Failed to fetch lobby');
      }
      const data = await response.json();
      setLobby(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [lobbyId]);

  useEffect(() => {
    fetchLobby();

    // Poll every 3 seconds
    const interval = setInterval(fetchLobby, 3000);

    return () => clearInterval(interval);
  }, [fetchLobby]);

  return { lobby, loading, error, refetch: fetchLobby };
}
