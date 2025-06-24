import React from 'react';
interface Comment {
    id: string;
    text: string;
}
interface Props {
    comments: Comment[];
    onDelete: (id: string) => void;
}
export declare const CommentCardList: ({ comments, onDelete }: Props) => React.JSX.Element;
export {};
