// team-assessment/plugins/team-assessment/src/components/EditingSoftSkillsComponent/EditingSoftSkillsComponent.tsx
import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { AssessmentSoftSkillsSection } from '../AssessmentSoftSkillsSection/AssessmentSoftSkillsSection';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';

type Props = {
  configData: Record<string, Skill[]>;
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  description: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    lineHeight: 1.5,
  },
  content: {
    paddingTop: '1rem',
  },
}));

export const EditingSoftSkillsComponent: React.FC<Props> = ({ configData }) => {
  const classes = useStyles();

  const softKey = Object.keys(configData).find(k =>
    k.toLowerCase().includes('soft'),
  );
  const softArray: Skill[] = softKey ? configData[softKey] : [];

  const grouped = softArray.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!s.area) return acc;
    if (!acc[s.area]) acc[s.area] = [];
    acc[s.area].push(s);
    return acc;
  }, {});

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h1" className={classes.title}>
          Soft Skills Assessment
        </Typography>
        <Typography className={classes.description}>
          Click on any category to view and assess detailed skills
        </Typography>
      </div>

      <div className={classes.content}>
        {Object.entries(grouped).map(([area, sections]) => (
          <AssessmentSoftSkillsSection
            key={area}
            area={area}
            sections={sections}
          />
        ))}
      </div>
    </div>
  );
};

