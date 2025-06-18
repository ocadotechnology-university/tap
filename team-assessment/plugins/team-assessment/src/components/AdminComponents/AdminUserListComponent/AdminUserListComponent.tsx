import React from 'react';
import { Typography, makeStyles, Box } from '@material-ui/core';
import { getTeamAssessments } from '../../../hooks/getTeamAssessments';
import { Progress } from '@backstage/core-components';
import { UserCard } from './UserCard';

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
    gap: theme.spacing(2),
    borderRadius: 10,
    boxShadow: theme.shadows[1],
    border: `1px solid ${theme.palette.divider}`,
    width: '100%',
    maxWidth: '100%',
    marginBottom: theme.spacing(2),
  },
}));

type Props = {
  onSelectUser: (userId: string, displayName?: string, name?: string) => void;
};

export const AdminUserListComponent: React.FC<Props> = ({ onSelectUser }) => {
  const classes = useStyles();
  const { loading, error, value } = getTeamAssessments();

  if (loading) return <Progress />;
  if (error)
    return <Typography className={classes.error}>Error: {error.message}</Typography>;
  if (!value?.allUsers?.length)
    return <Typography className={classes.error}>No users found in this team.</Typography>;

  return (
    <Box className={classes.outerContainer}>
      <Typography variant="h5" className={classes.title}>
        Group Members ({value.allUsers.length})
      </Typography>
      <Box className={classes.container}>
        {value.allUsers.map(user => (
          <UserCard
            key={user.id}
            userId={user.id}
            displayName={user.displayName}
            name={user.name}
            picture={user.picture}
            onSelect={() => onSelectUser(user.id, user.displayName, user.name)}
          />
        ))}
      </Box>
    </Box>
  );
};
