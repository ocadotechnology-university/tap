import React, { useRef, useLayoutEffect, useState } from 'react';
import { Typography, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AssessmentCard } from '../AssessmentCard';
import { getTeamAssessments, UserWithAssessment } from '../../hooks/getTeamAssessments';

const CARD_WIDTH = 240;
const CARD_GAP = 16;

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
  cardsWrap: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, 1fr))`,
    gap: theme.spacing(2),
    justifyItems: 'center',
    width: '100%',
  },
  showAllBtn: {
    alignSelf: 'center',
    marginTop: theme.spacing(2),
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '1.1rem',
    textTransform: 'none',
  },
}));

interface MyAssessmentsComponentProps {
  onReviewAssessment: (assessmentId: number) => void;
  onEditAssessment: (assessmentId: number) => void;
}

export const MyAssessmentsComponent: React.FC<MyAssessmentsComponentProps> = ({
  onReviewAssessment,
  onEditAssessment,
}) => {
  const classes = useStyles();
  const { loading, error, value } = getTeamAssessments();

  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsPerRow, setCardsPerRow] = useState(1);

  useLayoutEffect(() => {
    function calculateCards() {
      const width = containerRef.current?.offsetWidth || 0;
      if (width) {
        const cards = Math.max(1, Math.floor((width + CARD_GAP) / (CARD_WIDTH + CARD_GAP)));
        setCardsPerRow(cards);
      }
    }
    requestAnimationFrame(calculateCards);
    window.addEventListener('resize', calculateCards);
    return () => window.removeEventListener('resize', calculateCards);
  }, [value?.allUsers?.length]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!value) return null;

  const usersWithAssessment: UserWithAssessment[] = value.allUsers.filter(u => u.hasAssessment);
  const toShow = expanded ? usersWithAssessment : usersWithAssessment.slice(0, cardsPerRow);

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.counter}>
        My Assessments ({usersWithAssessment.length}):
      </Typography>
      <div className={classes.cardsWrap} ref={containerRef}>
        {toShow.map((user: UserWithAssessment) => (
          <AssessmentCard
            key={user.id}
            user={user}
            variant="view"
            onReviewAssessment={() =>
              user.assessmentId != null && onReviewAssessment(user.assessmentId)
            }
            onStartEditing={() =>
              user.assessmentId != null && onEditAssessment(user.assessmentId)
            }
          />
        ))}
      </div>
      {usersWithAssessment.length > cardsPerRow && (
        <Button
          className={classes.showAllBtn}
          onClick={() => setExpanded(prev => !prev)}
          variant="contained"
          color="primary"
          size="medium"
        >
          {expanded ? 'Collapse' : 'Show all'}
        </Button>
      )}
    </div>
  );
};
