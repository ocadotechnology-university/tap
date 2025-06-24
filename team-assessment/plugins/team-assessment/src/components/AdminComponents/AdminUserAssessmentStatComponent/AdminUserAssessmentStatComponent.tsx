import React, { useEffect, useState, KeyboardEvent } from 'react';
import {
  Typography,
  CircularProgress,
  Button,
  Box,
  TextField,
  Snackbar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi } from '@backstage/core-plugin-api';
import { fetchApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { useAssessmentConfig } from '../../../hooks/useAssessmentConfig';
import { SoftSkillSection } from './SoftSkillSection';
import { HardSkillSection } from './HardSkillSection';
import { SoftSkillProgressBar } from './SoftSkillProgressBar';
import { HardSkillProgressBar } from './HardSkillProgressBar';
import {
  calculateSoftSkillsPercentage,
  calculateHardSkillsPercentage,
} from '../../../utils/ratingUtils';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { NoDataBox } from './styles/NoDataBox';
import { FinalDecisionBox } from './FinalDecisionBox';

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(2),
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'fixed',
    right: theme.spacing(4),
    bottom: theme.spacing(4),
    width: 80,
    height: 80,
    borderRadius: '50%',
    padding: 0,
    zIndex: 2000,
    boxShadow: theme.shadows[6],
    color: theme.palette.common.white,
    backgroundColor: '#616161',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: '#424242',
      boxShadow: theme.shadows[8],
    },
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: 600, marginBottom: theme.spacing(2) },
}));

type Props = {
  userId: string;
  displayName?: string;
  name?: string;
  onBack: () => void;
};

export const AdminUserAssessmentStatComponent: React.FC<Props> = ({
  userId,
  displayName,
  name,
  onBack,
}) => {
  const classes = useStyles();
  const fetchApi = useApi(fetchApiRef);
  const identityApi = useApi(identityApiRef);
  const { config: assessmentConfig } = useAssessmentConfig();

  const [data, setData] = useState<any>(null);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  const [finalSoftDecision, setFinalSoftDecision] = useState('');
  const [finalHardDecision, setFinalHardDecision] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snack, setSnack] = useState<{ open: boolean; msg: string; ok: boolean }>({
    open: false,
    msg: '',
    ok: true,
  });

  const userLabel = displayName || name || userId.split(/[:/]/).pop();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { token } = await identityApi.getCredentials();
        const opts: RequestInit = {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include' as RequestCredentials,
        };

        const [listJson, statJson] = await Promise.all([
          fetchApi
            .fetch(
              `http://localhost:7007/api/team-assessment/user-assessments?userId=${userId}`,
              opts,
            )
            .then(r => r.json()),
          fetchApi
            .fetch(
              `http://localhost:7007/api/team-assessment/user-assessment-stat?userId=${userId}`,
              opts,
            )
            .then(r => r.json()),
        ]);

        setData(statJson);

        if (listJson.length) {
          const latest = listJson.sort(
            (a: any, b: any) => +new Date(b.date) - +new Date(a.date),
          )[0];
          setAssessmentId(latest.id);

          /* soft + hard параллельно */
          const [softRes, hardRes] = await Promise.all([
            fetchApi.fetch(
              `http://localhost:7007/api/team-assessment/leader-soft-decision/${latest.id}`,
              opts,
            ),
            fetchApi.fetch(
              `http://localhost:7007/api/team-assessment/leader-hard-decision/${latest.id}`,
              opts,
            ),
          ]);

          if (softRes.ok) {
            const s = await softRes.json();
            setFinalSoftDecision(s.finalSoftDecision ?? '');
          }
          if (hardRes.ok) {
            const h = await hardRes.json();
            setFinalHardDecision(h.finalHardDecision ?? '');
          }
        }
        setError(null);
      } catch (e: any) {
        setError(e.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, fetchApi, identityApi]);

  /* === helpers === */
  const showSnack = (msg: string, ok = true) => setSnack({ open: true, msg, ok });

  const saveDecision = async (kind: 'soft' | 'hard') => {
    if (!assessmentId) return showSnack('No assessment to save', false);
    try {
      const { token } = await identityApi.getCredentials();
      const opts: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include' as RequestCredentials,
        method: 'PUT',
        body: JSON.stringify(
          kind === 'soft'
            ? { finalSoftDecision }
            : { finalHardDecision },
        ),
      };

      const url =
        kind === 'soft'
          ? `http://localhost:7007/api/team-assessment/leader-soft-decision/${assessmentId}`
          : `http://localhost:7007/api/team-assessment/leader-hard-decision/${assessmentId}`;

      await fetchApi.fetch(url, opts);
      showSnack('Saved ✔︎', true);
    } catch (e: any) {
      showSnack(e.message || 'Error', false);
    }
  };

  const keyHandler =
    (kind: 'soft' | 'hard') => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        saveDecision(kind);
      }
    };

  /* === render === */
  if (loading || !assessmentConfig) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>No data available.</Typography>;

  const softPercent = calculateSoftSkillsPercentage(data.softSkills, assessmentConfig);
  const hardPercent = calculateHardSkillsPercentage(data.hardSkills, assessmentConfig);

  return (
    <Box className={classes.container}>
      <Button onClick={onBack} className={classes.backButton}>
        <ExitToAppIcon />
      </Button>

      <Typography variant="h2" className={classes.title}>
        {userLabel} Assessment Summary
      </Typography>

      {/* SOFT */}
      {Object.keys(data.softSkills).length ? (
        <>
          <SoftSkillSection softSkills={data.softSkills} config={assessmentConfig} />
          <SoftSkillProgressBar percent={softPercent} />
        </>
      ) : (
        <>
          <SoftSkillSection softSkills={{}} config={assessmentConfig} />
          <NoDataBox text="No soft skill data for this user" />
        </>
      )}

      <FinalDecisionBox
        label="Final Soft Skill Decision"
        value={finalSoftDecision}
        onChange={setFinalSoftDecision}
        onSave={() => saveDecision('soft')}
        disabled={!assessmentId}
      />

      {/* HARD */}
      {Object.keys(data.hardSkills).length ? (
        <>
          <HardSkillSection hardSkills={data.hardSkills} config={assessmentConfig} />
          <HardSkillProgressBar percent={hardPercent} />
        </>
      ) : (
        <>
          <HardSkillSection hardSkills={{}} config={assessmentConfig} />
          <NoDataBox text="No hard skill data for this user" />
        </>
      )}

      <FinalDecisionBox
        label="Final Hard Skill Decision"
        value={finalHardDecision}
        onChange={setFinalHardDecision}
        onSave={() => saveDecision('hard')}
        disabled={!assessmentId}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack({ ...snack, open: false })}
        message={snack.msg}
        ContentProps={{ style: { background: snack.ok ? '#2e7d32' : '#c62828' } }}
      />
    </Box>
  );
};
