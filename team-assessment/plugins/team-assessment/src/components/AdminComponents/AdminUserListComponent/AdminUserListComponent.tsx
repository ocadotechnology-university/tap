import React from 'react';
import { Typography, Grid, makeStyles } from '@material-ui/core';
import { getTeamAssessments } from '../../../hooks/getTeamAssessments';
import { Progress } from '@backstage/core-components';
import { UserCard } from './UserCard';

const useStyles = makeStyles(theme => ({
  error: {
    color: theme.palette.error.main,
    padding: theme.spacing(2),
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
    <div>
      <Typography variant="h5" gutterBottom>
        Group Members ({value.allUsers.length})
      </Typography>
      <Grid container direction="column" spacing={2}>
        {value.allUsers.map(user => (
          <Grid item key={user.id}>
            <UserCard
              userId={user.id}
              displayName={user.displayName}
              name={user.name}
              onSelect={() => onSelectUser(user.id, user.displayName, user.name)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
