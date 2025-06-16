// src/hooks/getUserAssessments.ts
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { useState, useEffect } from 'react';
import { FullAssessment } from '../types/assessment';

export const useUserAssessments = (userId: string) => {
  const fetchApi = useApi(fetchApiRef);

  const [data, setData] = useState<FullAssessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchApi.fetch(`/api/team-assessment/user-assessments?userId=${userId}`)
      .then(async res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch user assessments: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      })
      .catch(err => {
        console.error('Fetch user assessments error:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [userId, fetchApi]);

  return { data, loading, error };
};
