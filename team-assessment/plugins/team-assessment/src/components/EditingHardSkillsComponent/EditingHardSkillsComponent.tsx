import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type Props = {
  // Додаткові пропси, якщо будуть потрібні
};

const useStyles = makeStyles({
  content: {
    padding: '0px',
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

export const EditingHardSkillsComponent = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <h3>Hard Skills Section</h3>
      {/* Додатковий контент тут */}
    </div>
  );
};
