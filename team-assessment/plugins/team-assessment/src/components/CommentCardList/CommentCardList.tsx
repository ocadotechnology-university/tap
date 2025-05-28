import React from 'react';
import { CommentCard } from '../CommentCard';

interface Comment {
  id: string;
  text: string;
  markId: number;
}

interface Props {
  comments: Comment[];
  section: string;
  teamId: string;
  onDelete: (id: string) => void;
}

export const CommentCardList: React.FC<Props> = ({
  comments,
  section,
  teamId,
  onDelete,
}) => (
  <div style={{ width: '100%' }}>
    {comments.map(({ id, text, markId }) => (
      <CommentCard
        key={id}
        text={text}
        section={section}
        teamId={teamId}
        markId={markId}
        onDelete={() => onDelete(id)}
      />
    ))}
  </div>
);
