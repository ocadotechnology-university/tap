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
  },
  email: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    fontSize: '0.875rem',
    wordBreak: 'break-word',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '2.2rem',
  },  
  content: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.disabled,
    '&:hover': {
      backgroundColor: theme.palette.action.disabledBackground,
    }
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
}

export const AssessmentCard = ({ 
  user, 
  variant, 
  onCreateAssessment, 
  onReviewAssessment, 
  onEditAssessment 
}: AssessmentCardProps) => {
  const classes = useStyles();

  const displayName = user.displayName || 
    user.name.split(/[-_]/).map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Avatar
          displayName={displayName}
          picture={user.picture}
        />
        <div>
          <Typography variant="h6" className={classes.name}>
            {displayName}
          </Typography>
          {user.email && (
            <Typography variant="body2" className={classes.email}>
              {user.email}
            </Typography>
          )}
        </div>
        
        {variant === 'create' ? (
          <Button 
            onClick={onCreateAssessment}
            variant="contained"
            color="primary"
            fullWidth
            disabled={user.hasAssessment}
            className={user.hasAssessment ? classes.disabledButton : ''}
          >
            {user.hasAssessment ? 'Assessment Created' : 'Create an assessment'}
          </Button>
        ) : (
          <Box className={classes.buttonGroup}>
            <Button 
              onClick={onReviewAssessment}
              variant="contained"
              color="primary"
              fullWidth
            >
              Review
            </Button>
            <Button 
              onClick={onEditAssessment}
              variant="outlined"
              fullWidth
            >
              Edit
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};