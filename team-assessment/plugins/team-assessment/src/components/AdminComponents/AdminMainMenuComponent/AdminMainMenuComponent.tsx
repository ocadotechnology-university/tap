import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AdminAssessmentTable } from '../AdminAssessmentTable/AdminAssessmentTable';
import { AdminUserListComponent } from '../AdminUserListComponent/AdminUserListComponent';
import { AdminUserAssessmentStatComponent } from '../AdminUserAssessmentStatComponent/AdminUserAssessmentStatComponent';

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

type User = {
  id: string;
  displayName?: string;
  name?: string;
};

export const AdminMainMenuComponent: React.FC = () => {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUserJson = localStorage.getItem('selectedUser');
    if (savedUserJson) {
      try {
        const parsed = JSON.parse(savedUserJson);
        setSelectedUser(parsed);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
  }, []);

  // Save to localStorage when selected
  const handleSelectUser = (id: string, displayName?: string, name?: string) => {
    const user: User = { id, displayName, name };
    setSelectedUser(user);
    localStorage.setItem('selectedUser', JSON.stringify(user));
  };

  const handleBack = () => {
    setSelectedUser(null);
    localStorage.removeItem('selectedUser');
  };

  // ✅ Показуємо або профіль користувача, або головне меню
  if (selectedUser) {
    return (
      <AdminUserAssessmentStatComponent
        userId={selectedUser.id}
        displayName={selectedUser.displayName}
        name={selectedUser.name}
        onBack={handleBack}
      />
    );
  }

  return (
    <Box className={classes.container} style={{ overflow: 'visible' }}>
      <Typography variant="h1" className={classes.title}>
        Admin Menu
      </Typography>
      <Typography className={classes.description}>
        View all assessments created by team members across the organization.
      </Typography>
      <AdminUserListComponent
        onSelectUser={(id, displayName, name) =>
          handleSelectUser(id, displayName, name)
        }
      />
      <AdminAssessmentTable />
    </Box>
  );
};
