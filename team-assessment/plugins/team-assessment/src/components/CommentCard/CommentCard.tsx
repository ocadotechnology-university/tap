import React, { useRef, useState } from 'react';
import { Box, IconButton, Typography, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

interface CommentCardProps {
  text: string;
  onDelete: () => void;
}

export const CommentCard = ({ text, onDelete }: CommentCardProps) => {
  const [comment, setComment] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <Box
      style={{
        backgroundColor: '#e0e0e0',
        padding: '8px',
        marginTop: '8px',
        borderRadius: '0.5rem',
        width: '100%',
        position: 'relative',
      }}
    >
      <Typography
        variant="caption"
        style={{
          position: 'absolute',
          top: '4px',
          left: '8px',
          color: '#616161',
        }}
      >
        Comment
      </Typography>

      <TextField
        fullWidth
        multiline
        variant="outlined"
        value={comment}
        onChange={handleChange}
        rows={4}
        style={{
          marginTop: '24px',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '8px',
        }}
        InputProps={{
          style: {
            color: '#000',
          },
        }}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />

      <IconButton
        onClick={onDelete}
        style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          padding: 0,
        }}
      >
        <DeleteIcon style={{ fontSize: '20px', color: '#9e9e9e' }} />
      </IconButton>
    </Box>
  );
};