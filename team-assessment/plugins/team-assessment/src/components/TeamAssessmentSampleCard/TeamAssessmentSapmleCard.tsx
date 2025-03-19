import React from 'react';
import { InfoCard } from '@backstage/core-components';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';

export const TeamAssessmentSampleCard = () => {
  const fetchApi = useApi(fetchApiRef);

  const state = useAsync(async () => {
    const response = await fetchApi.fetch(
      'http://localhost:7007/api/team-assessment/getSampleText',
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const greetings = await response.json();
    return greetings.message;
  }, []);

  return (
    <InfoCard>
      {state.loading ? (
        <div>Loading...</div>
      ) : state.error ? (
        <div>Error: {state.error.message}</div>
      ) : (
        <div>{state.value}</div>
      )}
    </InfoCard>
  );
};
