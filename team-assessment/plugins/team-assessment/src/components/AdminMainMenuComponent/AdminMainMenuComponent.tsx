import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AdminAssessmentTable } from '../AdminAssessmentTable/AdminAssessmentTable';
import { AdminUserListComponent } from '../AdminUserListComponent';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    padding: theme.spacing(3, 2),
  },
  title: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
    fontSize: '1.6rem',
    fontWeight: 600,
  },
  description: {
    color: theme.palette.text.secondary,
    fontSize: '0.95rem',
    lineHeight: 1.6,
    maxWidth: 800,
    marginBottom: theme.spacing(3),
  },
}));

export const AdminMainMenuComponent: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Typography variant="h1" className={classes.title}>
        Admin Menu
      </Typography>
      <Typography className={classes.description}>
        View all assessments created by team members across the organization.
      </Typography>
      <AdminUserListComponent />
      <AdminAssessmentTable />
      
    </Box>
  );
};
