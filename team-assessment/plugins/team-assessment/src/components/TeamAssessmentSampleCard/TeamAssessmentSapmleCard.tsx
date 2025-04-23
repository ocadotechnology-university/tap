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
    margin: '0',
    background: theme.palette.background.paper,
    padding: '1rem',
    gap: '1rem',
    width: '100%',
    maxWidth: '100%',
  },
  counter: {
    fontSize: '1rem',
    marginBottom: 0,
  },
}));

export interface TeamAssessmentSampleCardProps {
  onStartEditing?: () => void;
}

export const TeamAssessmentSampleCard = ({ onStartEditing }: TeamAssessmentSampleCardProps) => {
  const classes = useStyles();
  const { loading, error, value } = getTeamAssessments();

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.counter}>
        Team Members ({value?.allUsers.length || 0}):
      </Typography>

      {loading ? (
        <Progress />
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : value?.allUsers.length ? (
        <div style={{ padding: '8px' }}>
          <HorizontalScrollGrid>
            {value.allUsers.map(user => (
              <Box key={user.id} sx={{ minWidth: 240, pr: 2 }}>
                <AssessmentCard
                  user={user}
                  variant="create"
                  onStartEditing={onStartEditing}
                />
              </Box>
            ))}
          </HorizontalScrollGrid>
        </div>
      ) : (
        <div>No members found</div>
      )}
    </div>
  );
};
