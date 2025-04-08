import React from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { Grid, makeStyles } from '@material-ui/core';


const useStyles = makeStyles({
  card: {
    minWidth: 200,
    maxWidth: 300,
    height: '100%',
    margin: '8px',
  },
  container: {
    padding: '16px',
  },
});

export const AssessmentList = () => {
  const classes = useStyles();
  const fetchApi = useApi(fetchApiRef);

  const { value, loading, error } = useAsync(async () => {
    const response = await fetchApi.fetch(
      'http://localhost:7007/api/team-assessment/getAssessments',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch assessments: ${response.status}`);
    }

    return response.json() as Promise<Assessment[]>;
  }, []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <InfoCard title="Error">
        <div>{error.message}</div>
      </InfoCard>
    );
  }

  if (!value || value.length === 0) {
    return (
      <InfoCard title="Assessments">
        <div>No assessments found</div>
      </InfoCard>
    );
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={2}>
        {value.map((assessment) => (
          <Grid item key={assessment.id} xs={12} sm={6} md={4} lg={3}>
            <div className={classes.card}>
              <InfoCard 
                title={`${assessment.createdBy}`}
                subheader={`ID: ${assessment.id}`}
              >
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  Created: {new Date(assessment.createdAt).toLocaleDateString()}
                </div>
              </InfoCard>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};