// src/components/QuestionItem.tsx
import React, { useState, MouseEvent } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  questionButton: {
    width: '100%',
    minHeight: 80,                        // increased height
    padding: theme.spacing(2, 3),        // extra padding
    backgroundColor: '#4caf50',
    color: '#fff',
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    fontSize: '1.1rem',                  // larger text
    transition: 'background-color 150ms ease, transform 100ms ease',
    '&:hover': {
      backgroundColor: '#43a047',
      transform: 'scale(1.02)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  questionText: {
    flexGrow: 1,
    textAlign: 'left',
    fontWeight: 500,
  },
  answerText: {
    marginLeft: theme.spacing(3),
    fontWeight: 500,
    fontSize: '1.1rem',                  // keep answer text in line
  },
}));

const answerOptions = [
  'Bar',
  'Great',
  'Excellent',
  'Outstanding',
  'Leading',
];

export default function QuestionItem({
  question,
}: {
  question: string;
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleOpen = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (opt: string) => {
    setSelectedAnswer(opt);
    handleClose();
  };

  return (
    <>
      <Button
        className={classes.questionButton}
        onClick={handleOpen}
      >
        <Typography className={classes.questionText}>
          {question}
        </Typography>
        {selectedAnswer ? (
          <Typography className={classes.answerText}>
            {selectedAnswer}
          </Typography>
        ) : (
          <AddIcon fontSize="small" />
        )}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {answerOptions.map(opt => (
          <MenuItem
            key={opt}
            onClick={() => handleSelect(opt)}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
