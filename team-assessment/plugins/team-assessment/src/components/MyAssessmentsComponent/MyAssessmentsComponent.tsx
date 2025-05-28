import React from 'react';
import { Progress, HorizontalScrollGrid } from '@backstage/core-components';
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AssessmentCard } from '../AssessmentCard';
import { getTeamAssessments, UserWithAssessment } from '../../hooks/getTeamAssessments';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    borderRadius: 10,
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
  },
  counter: {
    fontSize: '1rem',
    margin: 0,
  },
}));

interface Props {
  onReviewAssessment: (assessmentId: number) => void;
  onEditAssessment: (assessmentId: number) => void;
}

export const MyAssessmentsComponent: React.FC<Props> = ({
  onReviewAssessment,
  onEditAssessment,
}) => {
  const classes = useStyles();
  const { loading, error, value } = getTeamAssessments();

  if (loading) return <Progress />;
  if (error) return <div>Error: {error.message}</div>;

  const usersWithAssessment = value!.allUsers.filter(u => u.hasAssessment);

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.counter}>
        My Assessments ({usersWithAssessment.length}):
      </Typography>

      <Box px={1}>
        <HorizontalScrollGrid>
          {usersWithAssessment.map((user: UserWithAssessment) => (
            <Box key={user.id} minWidth={240} pr={2}>
              <AssessmentCard
                user={user}
                variant="view"
                onReviewAssessment={() =>
                  user.assessmentId != null && onReviewAssessment(user.assessmentId)
                }
                onStartEditing={() =>
                  user.assessmentId != null && onEditAssessment(user.assessmentId)
                }
              />
            </Box>
          ))}
        </HorizontalScrollGrid>
      </Box>
    </Box>
  );
};
