import React, { useState, useEffect } from 'react';
import { Header, Content } from '@backstage/core-components';
import CloseIcon from '@material-ui/icons/Close';
import ComputerIcon from '@material-ui/icons/Computer';
import PeopleIcon from '@material-ui/icons/People';
import CheckIcon from '@material-ui/icons/Check';
import {
  Button,
  makeStyles,
  Theme,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { EditingSoftSkillsComponent } from '../EditingSoftSkillsComponent/EditingSoftSkillsComponent';
import { EditingHardSkillsComponent } from '../EditingHardSkillsComponent/EditingHardSkillsComponent';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    flex: 1,
    padding: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  submitButton: {
    position: 'fixed',
    right: theme.spacing(3),
    bottom: theme.spacing(3),
    minWidth: 60,
    minHeight: 60,
    width: 60,
    height: 60,
    borderRadius: '50%',
    padding: 0,
    zIndex: 1000,
    boxShadow: theme.shadows[6],
    color: theme.palette.common.white,
    backgroundColor: '#4CAF50',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: '#388E3C',
      boxShadow: theme.shadows[8],
    },
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardSkillsButton: {
    position: 'fixed',
    left: theme.spacing(30),
    bottom: theme.spacing(3),
    width: 60,
    height: 60,
    minWidth: 60,
    minHeight: 60,
    borderRadius: '50%',
    padding: 0,
    zIndex: 3000,
    boxShadow: theme.shadows[6],
    color: theme.palette.common.white,
    backgroundColor: '#2196F3',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: '#1976D2',
      boxShadow: theme.shadows[8],
    },
    transition: 'all 0.3s ease',
  },
}));

interface Props {
  assessmentId: number;
  configData: Record<string, Skill[]>;
  onBackToMain: () => void;
}

export const ReviewAssessmentComponent: React.FC<Props> = ({
  assessmentId,
  configData,
  onBackToMain,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const fetchApi = useApi(fetchApiRef);

  const [stage, setStage] = useState<'softSkills' | 'hardSkills'>('softSkills');
  const [hardMarks, setHardMarks] = useState<Array<{ questionId: number; markId: number }>>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchApi
      .fetch(`http://localhost:7007/api/team-assessment/hardSkillMarksByAssessment?assessmentId=${assessmentId}`)
      .then(res => res.json())
      .then(setHardMarks)
      .catch(console.error);
  }, [assessmentId, fetchApi]);

  const noop = () => {};

  return (
    <div>
      <Header title="Assessment Review" style={{ marginTop: theme.spacing(-2) }} />

      <Content className={classes.content}>
        {stage === 'softSkills' ? (
          <EditingSoftSkillsComponent
            assessmentId={assessmentId}
            configData={configData}
            readOnly
          />
        ) : (
          <EditingHardSkillsComponent
            assessmentId={assessmentId}
            configData={configData}
            answers={{}}
            onAnswerChange={noop}
            initialMarks={hardMarks}
            readOnly
          />
        )}
      </Content>

      <Button
        onClick={() =>
          setStage(prev => (prev === 'softSkills' ? 'hardSkills' : 'softSkills'))
        }
        variant="contained"
        className={classes.hardSkillsButton}
        style={{ backgroundColor: '#8dc6ff' }}
      >
        {stage === 'softSkills' ? (
          <ComputerIcon fontSize="large" />
        ) : (
          <PeopleIcon fontSize="large" />
        )}
      </Button>

      <Button
        onClick={() => setConfirmOpen(true)}
        variant="contained"
        className={classes.submitButton}
        style={{ backgroundColor: '#4caf50' }}
      >
        <CheckIcon fontSize="large" />
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              onBackToMain();
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
