import React from 'react';
import { Progress, HorizontalScrollGrid } from '@backstage/core-components';
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AssessmentCard } from '../AssessmentCard';
import { getTeamAssessments } from '../../hooks/getTeamAssessments';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    background: theme.palette.background.paper,
    padding: '1rem',
    gap: '1rem',
    width: '100%',
    maxWidth: '100%',
  },
  counter: { fontSize: '1rem', marginBottom: 0 },
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
      console.log('\n\n\nAssessment created:', data);

      if (onStartEditing && data?.id) {
        onStartEditing(Number(data.id));
      }
    } catch (err) {
      console.error('Error creating assessment:', err);
    }
  };

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
        <div style={{ padding: 8 }}>
          <HorizontalScrollGrid>
            {value.allUsers.map(user => (
              <Box key={user.id} sx={{ minWidth: 240, pr: 2 }}>
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
        </div>
      ) : (
        <div>No members found</div>
      )}
    </div>
  );
};
