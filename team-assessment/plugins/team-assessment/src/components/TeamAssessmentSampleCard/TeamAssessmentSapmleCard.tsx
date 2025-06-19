import React, { useRef, useLayoutEffect, useState } from 'react';
import { Progress } from '@backstage/core-components';
import { Typography, Box, Button, makeStyles } from '@material-ui/core';
import { AssessmentCard } from '../AssessmentCard';
import { getTeamAssessments } from '../../hooks/getTeamAssessments';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';

const CARD_WIDTH = 240;
const CARD_GAP = 16;

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
  cardsWrap: {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, 1fr))`,
    gap: theme.spacing(2),
    justifyItems: 'center',
    width: '100%',
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
  },
  showAllBtn: {
    alignSelf: 'center',
    marginTop: theme.spacing(2),
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '1.1rem',
    textTransform: 'none',
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

  if (loading) {
    return (
      <Box className={classes.container}>
        <Progress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box className={classes.container}>
        <Box className={classes.errorState}>Error: {error.message}</Box>
      </Box>
    );
  }
  if (!value) {
    return (
      <Box className={classes.container}>
        <Box className={classes.emptyState}>No team members found</Box>
      </Box>
    );
  }

  const users = value.allUsers;
  const toShow = expanded ? users : users.slice(0, cardsPerRow);

  return (
    <Box className={classes.container}>
      <Typography variant="h6" className={classes.counter}>
        Team Members ({users.length})
      </Typography>
      {users.length ? (
        <>
          <div className={classes.cardsWrap} ref={containerRef}>
            {toShow.map(user => (
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
          </div>
          {users.length > cardsPerRow && (
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
        </>
      ) : (
        <Box className={classes.emptyState}>No team members found</Box>
      )}
    </Box>
  );
};
