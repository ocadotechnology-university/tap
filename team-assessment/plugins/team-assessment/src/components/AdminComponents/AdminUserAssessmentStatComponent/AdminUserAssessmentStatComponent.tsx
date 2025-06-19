import React, { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Button,
  Box,
} from '@mui/material';
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
  calculateHardSkillsPercentage
} from '../../../utils/ratingUtils';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { NoDataBox } from './styles/NoDataBox';


const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(2),
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },
  backButton: {
    position: 'fixed',
    right: theme.spacing(4),
    bottom: theme.spacing(4),
    minWidth: 60,
    minHeight: 60,
    width: 80,
    height: 80,
    borderRadius: '50%',
    padding: 0,
    zIndex: 2000,
    boxShadow: theme.shadows[6],
    color: theme.palette.common.white,
    backgroundColor: '#616161', // сірий
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: '#424242', // темніший сірий
      boxShadow: theme.shadows[8],
    },
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApi = useApi(fetchApiRef);
  const identityApi = useApi(identityApiRef);
  const { config: assessmentConfig } = useAssessmentConfig();

  // Get the best available label
  const userLabel = displayName || name || userId.split(/[:/]/).pop();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { token } = await identityApi.getCredentials();
        const res = await fetchApi.fetch(
          `http://localhost:7007/api/team-assessment/user-assessment-stat?userId=${userId}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          },
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, fetchApi, identityApi]);

  if (loading || !assessmentConfig) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load: {error}</Typography>;
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
      {/* SOFT SKILLS */}
      {data.softSkills && Object.keys(data.softSkills).length > 0 ? (
        <>
          <SoftSkillProgressBar percent={softPercent} />
          <SoftSkillSection softSkills={data.softSkills} config={assessmentConfig} />
        </>
      ) : (
        <>
          <SoftSkillSection softSkills={{}} config={assessmentConfig} />
          <NoDataBox text="No soft skill data for this user" />
        </>
      )}

      {/* HARD SKILLS */}
      {data.hardSkills && Object.keys(data.hardSkills).length > 0 ? (
        <>
          <HardSkillProgressBar percent={hardPercent} />
          <HardSkillSection hardSkills={data.hardSkills} config={assessmentConfig} />
        </>
      ) : (
        <>
          <HardSkillSection hardSkills={{}} config={assessmentConfig} />
          <NoDataBox text="No hard skill data for this user" />
        </>
      )}

    </Box>
  );


};
