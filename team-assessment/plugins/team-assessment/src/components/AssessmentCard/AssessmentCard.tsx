import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Avatar } from '@material-ui/core';
import { ButtonComponent } from '../ButtonComponent';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.default,
    minWidth: 220,
    maxWidth: 220,
    height: '100%',
    borderRadius: '1rem',
    border: '1px solid rgba(90,90,90)'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main
  },
  name: {
    fontWeight: 600,
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: theme.spacing(0.5)
  },
  email: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    fontSize: '0.875rem',
    wordBreak: 'break-word'
  },
  content: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  }
}));

interface UserCardProps {
  user: {
    id: string;
    name: string;
    displayName?: string;
    email?: string;
    picture?: string;
  };
}

export const UserCard = ({ user }: UserCardProps) => {
  const classes = useStyles();
  
  const initials = user.displayName 
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.name.split(/[-_]/).map(n => n[0]).join('').toUpperCase();

  const displayName = user.displayName || 
    user.name.split(/[-_]/).map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <div className={classes.header}>
          <Avatar 
            className={classes.avatar}
            src={user.picture}
            alt={displayName}
          >
            {initials}
          </Avatar>
          <Typography variant="h6" className={classes.name}>
            {displayName}
          </Typography>
          {user.email && (
            <Typography variant="body2" className={classes.email}>
              {user.email}
            </Typography>
          )}
        </div>
        <ButtonComponent />
      </CardContent>
    </Card>
  );
};