// src/components/MainMenuComponent/MainMenuComponent.tsx

import React from 'react';
import { TeamAssessmentSampleCard } from '../TeamAssessmentSampleCard';
import { MyAssessmentsComponent } from '../MyAssessmentsComponent/MyAssessmentsComponent';

interface Props {
  onStartEditing: (id: number) => void;
  onStartReviewing: (id: number) => void;
}

export const MainMenuComponent: React.FC<Props> = ({
  onStartEditing,
  onStartReviewing,
}) => {
  return (
    <>
      <TeamAssessmentSampleCard onStartEditing={onStartEditing} />
      <MyAssessmentsComponent
        onEditAssessment={onStartEditing}
        onReviewAssessment={onStartReviewing}
      />
    </>
  );
};
