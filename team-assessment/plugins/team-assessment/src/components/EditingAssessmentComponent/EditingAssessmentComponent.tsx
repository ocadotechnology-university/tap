// team-assessment/plugins/team-assessment/src/components/EditingAssessmentComponent/EditingAssessmentComponent.tsx
import React, { useState } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
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

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    padding: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  bottomNav: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(84),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
    zIndex: 1000,
  },
  navButton: {
    flex: '0 1 auto',
    minWidth: 96,
    borderRadius: 20,
    textTransform: 'none',
    fontSize: '0.9rem',
    padding: theme.spacing(1.5, 2.5),
    transition: 'transform 150ms ease, background-color 150ms ease',
    '&:hover': {
      transform: 'scale(1.05)',
      backgroundColor: theme.palette.action.hover,
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
    color: '#fff',
  },
}));

export const EditingAssessmentComponent: React.FC<Props> = ({
  configData,
  onBackToMain,
}) => {
  const classes = useStyles();
  const [currentStage, setCurrentStage] = useState<'softSkills' | 'hardSkills'>(
    'softSkills',
  );

  return (
    <Page themeId="tool">
      <Header title="Assessment Editing" />
      <Content className={classes.content}>
        {currentStage === 'softSkills' && (
          <EditingSoftSkillsComponent configData={configData} />
        )}
        {currentStage === 'hardSkills' && (
          <EditingHardSkillsComponent configData={configData} />
        )}
      </Content>

      <div className={classes.bottomNav}>
        {currentStage === 'softSkills' ? (
          <Button
            onClick={() => setCurrentStage('hardSkills')}
            variant="contained"
            className={classes.navButton}
            style={{ backgroundColor: '#8dc6ff' }}
          >
            Hard Skills
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStage('softSkills')}
            variant="contained"
            className={classes.navButton}
            style={{ backgroundColor: '#8dc6ff' }}
          >
            Soft Skills
          </Button>
        )}

        <Button
          onClick={onBackToMain}
          variant="contained"
          className={classes.navButton}
          style={{ backgroundColor: '#ff80bf' }}
        >
          Back to Main
        </Button>

        <Button
          onClick={onBackToMain}
          variant="contained"
          className={classes.navButton}
          style={{ backgroundColor: '#4caf50' }}
        >
          Submit
        </Button>
      </div>
    </Page>
  );
};
