import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AssessmentSoftSkillsSection } from '../AssessmentSoftSkillsSection';

type Props = {
  configData: Record<string, { title: string, description: string, labels: string[] }[]>;
};

const useStyles = makeStyles({
  content: {
    padding: '0px',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fullWidthButton: {
    width: '100%',
    marginTop: '1rem',
  },
});

export const EditingSoftSkillsComponent = ({ configData }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      {Object.entries(configData).map(([category, sections]) =>
        sections.map(section => (
          <AssessmentSoftSkillsSection
            key={section.title}
            title={section.title}
            description={section.description}
            labels={section.labels}
          />
        ))
      )}
    </div>
  );
};
