import React, { useRef, useState } from 'react';
import { Box, IconButton, Typography, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useApi, fetchApiRef, discoveryApiRef } from '@backstage/core-plugin-api';

interface CommentCardProps {
  text: string;
  section: string;
  teamId: string;
  markId: number;
  onDelete: () => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  text,
  section,
  teamId,
  markId,
  onDelete,
}) => {
  const [comment, setComment] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleKeyDown: React.KeyboardEventHandler<any> = async e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputRef.current?.blur();

      const handleComment = async (key: number, markId: number, commentText: string) => {
        const payload = {
          key,
          markId,
          commentText
        }

        try {
          const resp = await fetchApi.fetch('http://localhost:7007/api/team-assessment/addComment',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          if (!resp.ok) {
            console.error('Failed to save comment:', await resp.text());
          } else {
            console.log('Comment saved');
          }
        } catch (error) {
          console.error('Error saving comment:', error);
        }
      }
    };
  }

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
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap', 
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
          style: { color: '#000' },
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
        <DeleteIcon style={{ fontSize: 20, color: '#9e9e9e' }} />
      </IconButton>
    </Box>
  );
};

