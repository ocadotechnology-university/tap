import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  makeStyles,
  Box,
} from '@material-ui/core';
import { Avatar } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    boxShadow: '0 2px 8px rgba(60,60,80,0.08)',
    borderRadius: 12,
    border: `1.5px solid ${theme.palette.divider}`,
    transition: 'all 0.23s cubic-bezier(.4,1,.6,1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    height: 250,
    width: 220,
    position: 'relative',
    '&:hover': {
      boxShadow: '0 4px 16px rgba(60,60,80,0.12)',
      borderColor: theme.palette.divider,
      background: theme.palette.type === 'dark'
        ? '#28292C'
        : theme.palette.grey[200],
      transform: 'translateY(-2px)',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: 0,
    minHeight: 0,
  },
  avatarBox: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(1),
  },
  nameContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  nameText: {
    fontWeight: 700,
    fontSize: '1.3rem',
    color: theme.palette.text.primary,
    textAlign: 'center',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-line',
    lineHeight: 1.3,
    transition: 'color 0.3s',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  button: {
    borderRadius: 10,
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: theme.spacing(1.2),
    marginTop: 'auto',
    backgroundColor: theme.palette.type === 'dark'
      ? '#46494e'
      : '#eff1f5', // slightly lighter
    color: theme.palette.type === 'dark'
      ? '#fff'
      : theme.palette.text.primary,
    border: 'none',
    boxShadow: theme.shadows[1],
    transition: 'background 0.25s, color 0.2s, transform 0.2s',
    width: '100%',
    alignSelf: 'center',
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark'
        ? '#505359'
        : '#e0e3e8', // slightly darker on hover
      color: theme.palette.primary.main,
      transform: 'scale(1.03)',
      border: 'none',
      '& .MuiButton-label': {
        transform: 'none',
      },
    },
  },
}));

type Props = {
  userId: string;
  displayName?: string;
  name?: string;
  picture?: string;
  onSelect: (userId: string) => void;
};

export const UserCard: React.FC<Props> = ({
  userId,
  displayName,
  name,
  picture,
  onSelect,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        {/* Avatar */}
        <Box className={classes.avatarBox}>
          <Box
            style={{
              width: 64,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar
              displayName={displayName?.trim() || name || 'Unnamed User'}
              picture={picture}
            />
          </Box>
        </Box>

        {/* Name centered between avatar and button */}
        <Box className={classes.nameContainer}>
          <Typography variant="h6" className={classes.nameText}>
            {displayName?.trim() || name || 'Unnamed User'}
          </Typography>
        </Box>

        {/* Button pinned to the bottom */}
        <Button className={classes.button} onClick={() => onSelect(userId)}>
          View Stats
        </Button>
      </CardContent>
    </Card>
  );
};
