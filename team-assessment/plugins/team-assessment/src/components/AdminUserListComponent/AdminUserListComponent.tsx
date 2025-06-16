import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button, Grid } from '@material-ui/core';
import { AdminUserAssessmentStatComponent } from '../AdminUserAssessmentStatComponent/AdminUserAssessmentStatComponent';
import { getTeamAssessments } from '../../hooks/getTeamAssessments';
import { Progress } from '@backstage/core-components';

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
  error: {
    color: theme.palette.error.main,
    padding: theme.spacing(2),
  },
}));

// 🔹 Типи
type Comment = {
  user: string;
  mark: string;
  commentText: string;
};

type SoftSkill = {
  area: string;
  competency: string;
  comments: Comment[];
};

type HardSkill = {
  section: string;
  marks: {
    user: string;
    mark: string;
  }[];
};

type UserAssessment = {
  softSkills: SoftSkill[];
  hardSkills: HardSkill[];
};

// 🔹 Моки (поки просто для демонстрації — ключ це user.id)
const mockUserStats: Record<string, UserAssessment> = {
  user1: {
    softSkills: [
      {
        area: 'Communication',
        competency: 'Speaking Clearly',
        comments: [
          { user: 'user2', mark: 'Excellent', commentText: 'Very clear!' },
        ],
      },
    ],
    hardSkills: [
      {
        section: 'React',
        marks: [{ user: 'user2', mark: 'Intermediate' }],
      },
    ],
  },
  user2: {
    softSkills: [
      {
        area: 'Teamwork',
        competency: 'Collaboration',
        comments: [
          { user: 'user1', mark: 'Good', commentText: 'Great team player!' },
        ],
      },
    ],
    hardSkills: [
      {
        section: 'Node.js',
        marks: [{ user: 'user1', mark: 'Advanced' }],
      },
    ],
  },
  // інші користувачі будуть з пустими масивами
};

export const AdminUserListComponent: React.FC = () => {
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { loading, error, value } = getTeamAssessments();

  if (selectedUser) {
    const userAssessment = mockUserStats[selectedUser] || {
      softSkills: [],
      hardSkills: [],
    };

  return (
    <AdminUserAssessmentStatComponent
      userId={selectedUser}
      onBack={() => setSelectedUser(null)}
    />
  );

  }

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <Typography className={classes.error}>Error: {error.message}</Typography>;
  }

  if (!value?.allUsers?.length) {
    return <Typography className={classes.error}>No users found in this team.</Typography>;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Group Members ({value.allUsers.length})
      </Typography>
      <Grid container direction="column" spacing={2}>
        {value.allUsers.map(user => (
          <Grid item key={user.id}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h6">
                  {user.displayName?.trim() || user.name || 'Unnamed User'}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={() => setSelectedUser(user.id)}
                >
                  View Stats
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
