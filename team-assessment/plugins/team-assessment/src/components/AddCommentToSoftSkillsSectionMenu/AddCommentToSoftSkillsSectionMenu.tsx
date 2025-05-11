import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Button, Box } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { CommentCardList } from '../CommentCardList';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    margin: 0,
    boxShadow: 'none',
    minWidth: '120px',
    height: 'auto',
    flexDirection: 'column',
    width: '25%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 0.5rem',
    backgroundColor: '#4CAF50',
    color: '#000',
    '&:hover': {
      backgroundColor: '#45A049',
    },
    borderRadius: '0.5rem',
    width: '100%',
    minHeight: '60px',
    height: 'auto',
    fontSize: '1rem',
    whiteSpace: 'normal',
    textAlign: 'center',
  },
  labelText: {
    flexGrow: 1,
    textAlign: 'left',
    color: '#000',
    fontWeight: 'bold',
  },
  addIconBox: {
    minWidth: '40px',
    height: '40px',
    backgroundColor: '#4CAF50',
    borderRadius: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
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

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setComments(prev => [...prev, { id: uuidv4(), text: '' }]);
  };

  const handleDeleteComment = (idToDelete: string) => {
    setComments(prev => prev.filter(comment => comment.id !== idToDelete));
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Button
          className={classes.button}
          variant="contained"
          onClick={onClick}
        >
          <span className={classes.labelText}>{label}</span>
          <Box className={classes.addIconBox} onClick={handleAddClick}>
            <AddIcon style={{ fontSize: '28px' }} />
          </Box>
        </Button>

        {comments.length > 0 && (
          <CommentCardList comments={comments} onDelete={handleDeleteComment} />
        )}
      </CardContent>
    </Card>
  );
};