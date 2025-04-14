import React from 'react';
import { InfoCard, Progress } from '@backstage/core-components';
import { fetchApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { AssessmentCard } from '../AssessmentCard';

const useStyles = makeStyles({
  card: {
    minWidth: 200,
    width: '100%', // Занимаем всю доступную ширину
    height: '100%',
    margin: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    padding: '12px',
  },
  content: {
    flexGrow: 1, // Растягиваем контент на доступное пространство
    overflow: 'hidden', // Скрываем переполнение
    wordBreak: 'break-word', // Переносим длинные слова
  },
  dateText: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '8px', // Добавляем отступ сверху
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
        <Typography variant="body1">{error.message}</Typography>
      </InfoCard>
    );
  }

  if (!value || value.length === 0) {
    return (
      <InfoCard title="Assessments">
        <Typography variant="body1">No assessments found</Typography>
      </InfoCard>
    );
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={2}>
        {value.map((assessment) => (
          <Grid item key={assessment.id} xs={12} sm={6} md={4} lg={3}>
            <AssessmentCard assessment={assessment} />
          </Grid>
        ))}
      </Grid>
    </div>);
};