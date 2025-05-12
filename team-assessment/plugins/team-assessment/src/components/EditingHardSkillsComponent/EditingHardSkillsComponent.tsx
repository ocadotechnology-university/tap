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
    padding: theme.spacing(2),
  },
  sectionHeader: {
    width: '100%',
    padding: theme.spacing(3, 2),
    '& h2': {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1),
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    '& p': {
      color: theme.palette.text.secondary,
      fontSize: '0.95rem',
      lineHeight: 1.6,
      maxWidth: 800,
    },
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
    <div>
      {/* Заголовок и описание раздела */}
      <div className={classes.sectionHeader}>
        <h2>Hard Skills Assessment</h2>
        <p>
          Evaluate technical proficiency across key development areas.
          Select ratings based on demonstrated expertise and practical implementation.
        </p>
      </div>

      {/* Карточки с навыками */}
      <div className={classes.root}>
        {hardArray.map((skill, idx) => (
          <AssessmentHardSkillsSection
            key={skill.title + idx}
            skill={skill}
            selectedAnswer={answers[skill.title] || ''}
            onAnswerChange={(answer) => onAnswerChange(skill.title, answer)}
          />
        ))}
      </div>
    </div>
  );
};