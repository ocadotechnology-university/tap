import React from 'react';
import { Button } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { fetchApiRef } from '@backstage/core-plugin-api';

export const ButtonComponent = () => {
  const fetchApi = useApi(fetchApiRef);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [response, setResponse] = React.useState<string | null>(null);

  const handleCreateAssessment = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await fetchApi.fetch(
        'http://localhost:7007/api/team-assessment/createAssessment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            userId: '123',
            teamId: 'team123',
          }),
        }
      );

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
      }

      const data = await result.json();
      setResponse(data.message || 'Assessment created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateAssessment}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Assessment'}
      </Button>

      {error && (
        <div style={{ color: 'red' }}>Error: {error.message}</div>
      )}

      {response && (
        <div style={{ color: 'green' }}>{response}</div>
      )}
    </div>
  );
};
