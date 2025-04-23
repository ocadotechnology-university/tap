import React, { useState } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { EditingSoftSkillsComponent } from '../EditingSoftSkillsComponent';  // Імпорт для Soft Skills
import { EditingHardSkillsComponent } from '../EditingHardSkillsComponent';  // Імпорт для Hard Skills

type Props = {
  configData: Record<string, { title: string, labels: string[] }[]>;
  onBackToMain: () => void; // Для повернення до головного компонента
};

const useStyles = makeStyles({
  content: {
    padding: '0px',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  grid: {
    width: '100%',
    maxWidth: '100%',
  },
  fullWidthButton: {
    width: '100%', // Задає кнопкам ширину на весь екран
    marginTop: '1rem',
  },
});

export const EditingAssessmentComponent = ({
  configData,
  onBackToMain,
}: Props) => {
  const classes = useStyles();

  const [currentStage, setCurrentStage] = useState<'softSkills' | 'hardSkills'>('softSkills');

  const handleNext = () => {
    setCurrentStage('hardSkills');
  };

  const handleBack = () => {
    setCurrentStage('softSkills');
  };

  return (
    <Page themeId="tool">
      <Header title="Assessment Editing" />
      <Content className={classes.content}>
        {/* Виводимо секції в залежності від поточного етапу */}
        {currentStage === 'softSkills' && (
          <EditingSoftSkillsComponent configData={configData} />
        )}

        {currentStage === 'hardSkills' && (
          <EditingHardSkillsComponent />
        )}

        {/* Кнопки для перемикання між етапами */}
        <div>
          {currentStage === 'softSkills' && (
            <Button
              onClick={handleNext}
              variant="contained"
              color="primary"
              className={classes.fullWidthButton}
            >
              Hard skills
            </Button>
          )}

          {currentStage === 'hardSkills' && (
            <Button
              onClick={handleBack}
              variant="contained"
              color="primary"
              className={classes.fullWidthButton}
            >
              Soft skills
            </Button>
          )}

          <Button
            onClick={onBackToMain}
            variant="contained"
            color="secondary"
            className={classes.fullWidthButton}
          >
            Back to main
          </Button>

          <Button
            onClick={onBackToMain}
            variant="contained"
           // color="secondary"
            className={classes.fullWidthButton}
          >
            Submit
          </Button>
        </div>
      </Content>
    </Page>
  );
};
