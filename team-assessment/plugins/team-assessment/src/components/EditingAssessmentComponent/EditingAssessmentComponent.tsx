import React, { useState } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { Button, Divider } from '@material-ui/core';
import { EditingSoftSkillsComponent } from '../EditingSoftSkillsComponent/EditingSoftSkillsComponent';
import { EditingHardSkillsComponent } from '../EditingHardSkillsComponent/EditingHardSkillsComponent';

export type Skill = {
  id?: number;
  area?: string;
  title: string;
  description: string;
  labels: string[];
};

type Props = {
  assessmentId: number;
  configData: Record<string, Skill[]>;
  onBackToMain: () => void;
};

type Answers = Record<string, string>;

const useStyles = makeStyles((theme: Theme) => ({
  rootContainer: { display: 'flex', flexDirection: 'column', minHeight: '100vh' },
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
    backgroundColor: 'transparent',
    marginTop: 'auto',
  },
  navButton: {
    minWidth: 160,
    borderRadius: 24,
    padding: theme.spacing(1.5, 3),
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows[4] },
    '&.MuiButton-contained': { color: theme.palette.common.white },
  },
}));

export const EditingAssessmentComponent: React.FC<Props> = ({
  assessmentId,
  configData,
  onBackToMain,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [stage, setStage] = useState<'soft' | 'hard'>('soft');
  const [answers, setAnswers] = useState<Answers>({});

  const handleAnswerChange = (title: string, answer: string) =>
    setAnswers(prev => ({ ...prev, [title]: answer }));

  const handleSubmit = () => {
    console.log('Submitted answers:', answers);
    onBackToMain();
  };

  return (
    <Page themeId="tool">
      <Header title="Assessment Editing" />
      <div className={classes.rootContainer}>
        <Content className={classes.content}>
          {stage === 'soft' ? (
            <EditingSoftSkillsComponent configData={configData} />
          ) : (
            <EditingHardSkillsComponent
              assessmentId={assessmentId}
              configData={configData}
              answers={answers}
              onAnswerChange={handleAnswerChange}
            />
          )}
        </Content>

        <div className={classes.bottomNav}>
          <Button
            onClick={() => setStage(prev => (prev === 'soft' ? 'hard' : 'soft'))}
            variant="contained"
            className={classes.navButton}
            style={{ backgroundColor: '#2196F3' }}
          >
            {stage === 'soft' ? 'Hard Skills →' : '← Soft Skills'}
          </Button>

          <Divider orientation="vertical" flexItem style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: 24, margin: theme.spacing(0, 1) }} />

          <Button
            onClick={onBackToMain}
            variant="contained"
            className={classes.navButton}
            style={{ backgroundColor: '#FF4081' }}
          >
            Back to Main
          </Button>

          <Divider orientation="vertical" flexItem style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: 24, margin: theme.spacing(0, 1) }} />

          <Button
            onClick={handleSubmit}
            variant="contained"
            className={classes.navButton}
            style={{ backgroundColor: '#4CAF50' }}
          >
            Submit
          </Button>
        </div>
      </div>
    </Page>
  );
};
