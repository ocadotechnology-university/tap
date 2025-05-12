import React, { useState } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { Button, Divider } from '@material-ui/core';
import { EditingSoftSkillsComponent } from '../EditingSoftSkillsComponent/EditingSoftSkillsComponent';
import { EditingHardSkillsComponent } from '../EditingHardSkillsComponent/EditingHardSkillsComponent';

export type Skill = {
  area?: string;
  title: string;
  description: string;
  labels: string[];
};

type Props = {
  configData: Record<string, Skill[]>;
  onBackToMain: () => void;
};

type Answers = Record<string, string>;

const useStyles = makeStyles((theme: Theme) => ({
  rootContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    padding: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),

  },
  bottomNav: {
    width: '100%',
    display: 'flex',
    bottom: theme.spacing(3),
    right: theme.spacing(84),
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    backgroundColor: 'transparent', // Убрали фон
    marginTop: 'auto',
  },
  navButton: {
    minWidth: 160,
    borderRadius: 24,
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
    '&.MuiButton-contained': {
      color: theme.palette.common.white,
    },
  },
}));

export const EditingAssessmentComponent: React.FC<Props> = ({
  configData,
  onBackToMain,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [currentStage, setCurrentStage] = useState<'softSkills' | 'hardSkills'>('softSkills');
  const [hardSkillsAnswers, setHardSkillsAnswers] = useState<Answers>({});

  const handleAnswerChange = (skillTitle: string, answer: string) => {
    setHardSkillsAnswers(prev => ({ ...prev, [skillTitle]: answer }));
  };

  const handleSubmit = () => {
    console.log('Submitted answers:', hardSkillsAnswers);
    onBackToMain();
  };

  return (
    <Page themeId="tool">
      <Header title="Assessment Editing" />
      <div className={classes.rootContainer}>
        <Content className={classes.content}>
          {currentStage === 'softSkills' && (
            <EditingSoftSkillsComponent configData={configData} />
          )}
          {currentStage === 'hardSkills' && (
            <EditingHardSkillsComponent
              configData={configData}
              answers={hardSkillsAnswers}
              onAnswerChange={handleAnswerChange}
            />
          )}
        </Content>

        <div className={classes.bottomNav}>
          <Button
            onClick={() => setCurrentStage(prev =>
              prev === 'softSkills' ? 'hardSkills' : 'softSkills'
            )}
            variant="contained"
            className={classes.navButton}
            style={{
              backgroundColor: '#2196F3',
              backgroundImage: 'none',
            }}
          >
            {currentStage === 'softSkills' ? 'Hard Skills →' : '← Soft Skills'}
          </Button>

          <Divider
            orientation="vertical"
            flexItem
            style={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              height: 24,
              margin: theme.spacing(0, 1),
            }}
          />

          <Button
            onClick={onBackToMain}
            variant="contained"
            className={classes.navButton}
            style={{
              backgroundColor: '#FF4081',
              backgroundImage: 'none',
            }}
          >
            Back to Main
          </Button>

          <Divider
            orientation="vertical"
            flexItem
            style={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              height: 24,
              margin: theme.spacing(0, 1),
            }}
          />

          <Button
            onClick={handleSubmit}
            variant="contained"
            className={classes.navButton}
            style={{
              backgroundColor: '#4CAF50',
              backgroundImage: 'none',
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Page>
  );
};