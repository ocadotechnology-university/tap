import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  card: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
    borderRadius: 8,
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

type Props = {
  userId: string;
  displayName?: string;
  name?: string;
  onSelect: (userId: string) => void;
};

export const UserCard: React.FC<Props> = ({ userId, displayName, name, onSelect }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">
          {displayName?.trim() || name || 'Unnamed User'}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          onClick={() => onSelect(userId)}
        >
          View Stats
        </Button>
      </CardContent>
    </Card>
  );
};
