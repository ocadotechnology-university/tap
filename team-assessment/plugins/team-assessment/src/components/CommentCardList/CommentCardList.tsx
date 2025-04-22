import React from 'react';
import { CommentCard } from '../CommentCard';

interface Comment {
  id: string;
  text: string;
}

interface Props {
  comments: Comment[];
  onDelete: (id: string) => void;
}

export const CommentCardList = ({ comments, onDelete }: Props) => {
  return (
    <div style={{ width: '100%' }}>
      {comments.map(({ id, text }) => (
        <CommentCard key={id} text={text} onDelete={() => onDelete(id)} />
      ))}
    </div>
  );
};