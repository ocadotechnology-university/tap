import React from 'react';
interface AssessmentCardProps {
    user: {
        id: string;
        name: string;
        displayName?: string;
        email?: string;
        picture?: string;
        hasAssessment?: boolean;
    };
    variant: 'create' | 'view';
    onCreateAssessment?: () => void;
    onReviewAssessment?: () => void;
    onEditAssessment?: () => void;
}
export declare const AssessmentCard: ({ user, variant, onCreateAssessment, onReviewAssessment, onEditAssessment }: AssessmentCardProps) => React.JSX.Element;
export {};
