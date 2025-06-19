import React, { useState, useRef, useLayoutEffect } from 'react';
import { Typography, makeStyles, Box, Button } from '@material-ui/core';
import { getTeamAssessments } from '../../../hooks/getTeamAssessments';
import { Progress } from '@backstage/core-components';
import { UserCard } from './UserCard';

const CARD_WIDTH = 240;   // px
const CARD_GAP = 16;      // px

const useStyles = makeStyles(theme => ({
  error: {
    color: theme.palette.error.main,
    padding: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    justifyContent: 'center',
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    gap: theme.spacing(1),
    borderRadius: 10,
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
    width: '100%',
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
  },
  showAllBtn: {
    alignSelf: 'center',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: '1.1rem',
    textTransform: 'none',
  }
}));

type Props = {
  onSelectUser: (userId: string, displayName?: string, name?: string) => void;
};

export const AdminUserListComponent: React.FC<Props> = ({ onSelectUser }) => {
  const classes = useStyles();
  const { loading, error, value } = getTeamAssessments();
  const [expanded, setExpanded] = useState(false);

  const outerRef = useRef<HTMLDivElement>(null);
  const [cardsPerRow, setCardsPerRow] = useState(1);

  useLayoutEffect(() => {
    if (!value?.allUsers) return;
    function calculateCards() {
      const width = outerRef.current?.offsetWidth || 0;
      if (width) {
        const cards = Math.max(1, Math.floor((width + CARD_GAP) / (CARD_WIDTH + CARD_GAP)));
        setCardsPerRow(cards);
      }
    }
    requestAnimationFrame(calculateCards);
    window.addEventListener('resize', calculateCards);
    return () => window.removeEventListener('resize', calculateCards);
  }, [value?.allUsers]); // recalculates when users are loaded

  if (loading) return <Progress />;
  if (error)
    return <Typography className={classes.error}>Error: {error.message}</Typography>;
  if (!value?.allUsers?.length)
    return <Typography className={classes.error}>No users found in this team.</Typography>;

  const toShow = expanded ? value.allUsers : value.allUsers.slice(0, cardsPerRow);

  return (
    <div className={classes.outerContainer} ref={outerRef}>
      <Typography variant="h5" className={classes.title}>
        Group Members ({value.allUsers.length})
      </Typography>
      <div className={classes.container}>
        {toShow.map(user => (
          <UserCard
            key={user.id}
            userId={user.id}
            displayName={user.displayName}
            name={user.name}
            picture={user.picture}
            onSelect={() => onSelectUser(user.id, user.displayName, user.name)}
          />
        ))}
      </div>
      {value.allUsers.length > cardsPerRow && (
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
