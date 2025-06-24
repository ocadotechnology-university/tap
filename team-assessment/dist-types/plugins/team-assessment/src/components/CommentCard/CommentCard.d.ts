import React from 'react';
interface CommentCardProps {
    text: string;
    onDelete: () => void;
}
export declare const CommentCard: ({ text, onDelete }: CommentCardProps) => React.JSX.Element;
export {};
