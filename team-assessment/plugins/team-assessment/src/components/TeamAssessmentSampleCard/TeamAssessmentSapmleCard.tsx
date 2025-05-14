import React from 'react';
import { Progress, HorizontalScrollGrid } from '@backstage/core-components';
import { Typography, Box, makeStyles } from '@material-ui/core';
import { AssessmentCard } from '../AssessmentCard';
import { getTeamAssessments } from '../../hooks/getTeamAssessments';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';

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
    fontSize: '1.1rem', 
    marginBottom: 0,
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  scrollContainer: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(-1), // Compensate for card margin
    marginRight: theme.spacing(-1),
  },
  cardWrapper: {
    minWidth: 240,
    padding: theme.spacing(0, 1),
    paddingBottom: theme.spacing(2),
  },
  errorState: {
    color: theme.palette.error.main,
    padding: theme.spacing(2),
  },
  emptyState: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(2),
  }
}));

export interface TeamAssessmentSampleCardProps {
  onStartEditing?: (assessmentId: number) => void;
}

export const TeamAssessmentSampleCard: React.FC<TeamAssessmentSampleCardProps> = ({
  onStartEditing,
}) => {
  const classes = useStyles();
  const { loading, error, value } = getTeamAssessments();
  const fetchApi = useApi(fetchApiRef);

  const handleAssessment = async (targetUser: string, teamId: string) => {
    try {
      const response = await fetchApi.fetch(
        'http://localhost:7007/api/team-assessment/createAssessment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUser, teamId }),
        },
      );
  
      const data = await response.json();
      console.log('Assessment created:', data);
  
      if (onStartEditing && data?.id) {
        console.log('Calling onStartEditing with id:', data.id);
        onStartEditing(Number(data.id));
      }
    } catch (err) {
      console.error('Error creating assessment:', err);
    }
  };

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.counter}>
        Team Members ({value?.allUsers.length || 0})
      </Typography>

      {loading ? (
        <Progress />
      ) : error ? (
        <Box className={classes.errorState}>Error: {error.message}</Box>
      ) : value?.allUsers.length ? (
        <Box className={classes.scrollContainer}>
          <HorizontalScrollGrid>
            {value.allUsers.map(user => (
              <Box key={user.id} className={classes.cardWrapper}>
                <AssessmentCard
                  user={user}
                  variant="create"
                  onCreateAssessment={() =>
                    handleAssessment(user.id, value.teamId)
                  }
                />
              </Box>
            ))}
          </HorizontalScrollGrid>
        </Box>
      ) : (
        <Box className={classes.emptyState}>No team members found</Box>
      )}
    </Box>
  );
};