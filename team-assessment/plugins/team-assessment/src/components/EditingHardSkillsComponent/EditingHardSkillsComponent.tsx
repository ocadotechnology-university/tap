import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import HardSkillsTab from '../HardSkillsComponent/HardSkillsTab';

const useStyles = makeStyles({
  content: {
    padding: 0,
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fullWidthButton: {
    width: '100%',
    marginTop: '1rem',
  },
});

export const EditingHardSkillsComponent: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <h3>Hard Skills Section</h3>
      <HardSkillsTab />


    </div>
  );
};
