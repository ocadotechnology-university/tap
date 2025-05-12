import React from 'react';
import { makeStyles } from '@material-ui/core';
import { AssessmentHardSkillsSection } from '../AssessmentHardSkillsSection/AssessmentHardSkillsSection';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';

type Props = {
  configData: Record<string, Skill[]>;
  answers: Record<string, string>;
  onAnswerChange: (skillTitle: string, answer: string) => void;
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(-1),
  },
}));

export const EditingHardSkillsComponent: React.FC<Props> = ({
  configData,
  answers,
  onAnswerChange
}) => {
  const classes = useStyles();

  const hardKey = Object.keys(configData).find(k =>
    k.toLowerCase().includes('hard'),
  );
  const hardArray: Skill[] = hardKey ? configData[hardKey] : [];

  return (
    <div className={classes.root}>
      {hardArray.map((skill, idx) => (
        <AssessmentHardSkillsSection
          key={idx}
          skill={skill}
          selectedAnswer={answers[skill.title] || ''}
          onAnswerChange={(answer) => onAnswerChange(skill.title, answer)}
        />
      ))}
    </div>
  );
};