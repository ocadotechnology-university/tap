import React from 'react';
import { Progress, HorizontalScrollGrid } from '@backstage/core-components';
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AssessmentCard } from '../AssessmentCard';
import { getTeamAssessments } from '../../hooks/getTeamAssessments';

const useStyles = makeStyles(theme => ({
  container: {
   display: 'flex',
    flexDirection: 'column',
    margin: 0,
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: '100%',
    maxWidth: '100%',
    borderRadius: 10,
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
  },
  counter: {
    fontSize: '1rem',
    marginBottom: 0,
  },
  wrapper: {
    fontSize: '1rem',
    marginBottom: '1rem',
  },
}));

export const MyAssessmentsComponent = () => {
  const classes = useStyles();
  const { loading, error, value } = getTeamAssessments();

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.counter}>
        My Assessments ({value?.assessedUsers.length || 0}):
      </Typography>

      {loading ? (
        <Progress />
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : value?.assessedUsers.length ? (
        <div style={{ padding: '8px'}}>
          <HorizontalScrollGrid>
            {value.allUsers
            .filter(user => user.hasAssessment)
            .map(user => (
              <Box key={user.id} sx={{ minWidth: 240, pr: 2 }} className={classes.wrapper}>
                <AssessmentCard 
                  user={user} 
                  variant="view" 
                />
              </Box>
            ))}
          </HorizontalScrollGrid>
        </div>
      ) : (
        <div>No assessments found</div>
      )}
    </div>
  );
};