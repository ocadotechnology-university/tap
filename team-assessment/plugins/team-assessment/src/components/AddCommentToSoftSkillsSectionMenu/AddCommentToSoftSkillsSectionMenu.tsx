import React, { useState, MouseEvent } from 'react';
import {
  Card,
  CardContent,
  Button,
  Box,
  makeStyles,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CommentCardList } from '../CommentCardList';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),

    margin: theme.spacing(1, 2),
    width: '100%',
  },
  content: {
    padding: 0,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#4CAF50',
    color: '#fff',
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    fontSize: '1rem',
    justifyContent: 'space-between',
    transition: 'background-color 200ms ease',
    '&:hover': {
      backgroundColor: '#45A049',
    },
  },
  labelText: {
    flexGrow: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#fff',
  },
  addIconBox: {
    minWidth: 40,
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    transition: 'background-color 200ms ease',
    '&:hover': {
      backgroundColor: '#45A049',
      cursor: 'pointer',
    },
  },
}));

interface Comment {
  id: string;
  text: string;
}

interface Props {
  label: string;
  onClick?: () => void;
}

export const AddCommentToSoftSkillsSectionMenu = ({ label, onClick }: Props) => {
  const classes = useStyles();
  const [comments, setComments] = useState<Comment[]>([]);

  const handleAddClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setComments(prev => [...prev, { id: uuidv4(), text: '' }]);
  };

  const handleDeleteComment = (idToDelete: string) => {
    setComments(prev => prev.filter(c => c.id !== idToDelete));
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Button className={classes.button} onClick={onClick}>
          <Typography className={classes.labelText}>{label}</Typography>
          <Box className={classes.addIconBox} onClick={handleAddClick}>
            <AddIcon fontSize="large" style={{ color: '#fff' }} />
          </Box>
        </Button>

        {comments.length > 0 && (
          <CommentCardList
            comments={comments}
            onDelete={handleDeleteComment}
          />
        )}
      </CardContent>
    </Card>
  );
};
