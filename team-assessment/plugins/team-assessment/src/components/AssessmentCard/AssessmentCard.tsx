import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button, Box } from '@material-ui/core';
import { Avatar } from '@backstage/core-components';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.default,
    minWidth: 220,
    maxWidth: 220,
    height: '100%',
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(1, 0), // Added top and bottom margin
    boxShadow: theme.shadows[1],
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    flex: 1, // Takes remaining space pushing buttons to bottom
  },
  name: {
    fontWeight: 600,
    fontSize: '1.1rem',
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  email: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    fontSize: '0.875rem',
    wordBreak: 'break-word',
    marginTop: theme.spacing(1),
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: 0, // Remove padding from CardContent
  },
  buttonContainer: {
    padding: theme.spacing(2),
    paddingTop: 0, // Remove top padding
    marginTop: 'auto', // Push to bottom
  },
  buttonGroup: {
    display: 'flex',
    gap: theme.spacing(1),
    width: '100%',
  },
  primaryButton: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.text.primary,
    borderRadius: 10,
    fontWeight: 500,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
      transform: 'scale(1.02)',
    },
    transition: 'all 0.3s ease',
    boxShadow: theme.shadows[2],
  },
  outlinedButton: {
    borderRadius: 10,
    borderColor: theme.palette.secondary.dark,
    color: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.dark,
    },
    transition: 'all 0.3s ease',
  },
  disabledButton: {
    borderRadius: 10,
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
    fontWeight: 500,
    boxShadow: 'none',
  }
}));

interface AssessmentCardProps {
  user: {
    id: string;
    name: string;
    displayName?: string;
    email?: string;
    picture?: string;
    hasAssessment?: boolean;
  };
  variant: 'create' | 'view';
  onCreateAssessment?: () => void;
  onReviewAssessment?: () => void;
  onEditAssessment?: () => void;
  onStartEditing?: () => void;
}

export const AssessmentCard = ({
  user,
  variant,
  onCreateAssessment,
  onReviewAssessment,
  onEditAssessment,
  onStartEditing,
}: AssessmentCardProps) => {
  const classes = useStyles();

  const displayName = user.displayName ||
    user.name.split(/[-_]/).map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <div className={classes.header}>
          <Avatar
            displayName={displayName}
            picture={user.picture}
          />
          <Typography variant="h6" className={classes.name}>
            {displayName}
          </Typography>
          {user.email && (
            <Typography variant="body2" className={classes.email}>
              {user.email}
            </Typography>
          )}
        </div>

        <div className={classes.buttonContainer}>
          {variant === 'create' ? (
            <Button
              onClick={onCreateAssessment}
              variant="contained"
              fullWidth
              disabled={user.hasAssessment}
              className={user.hasAssessment ? classes.disabledButton : classes.primaryButton}
            >
              {user.hasAssessment ? 'Assessment Created' : 'Create Assessment'}
            </Button>
          ) : (
            <div className={classes.buttonGroup}>
              <Button
                onClick={onReviewAssessment}
                variant="contained"
                fullWidth
                className={classes.primaryButton}
              >
                Review
              </Button>
              <Button
                onClick={() => {
                  onEditAssessment?.();
                  onStartEditing?.();
                }}
                variant="outlined"
                fullWidth
                className={classes.outlinedButton}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};