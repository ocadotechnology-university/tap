import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { useApi } from '@backstage/core-plugin-api';
import { fetchApiRef, identityApiRef } from '@backstage/core-plugin-api';

type SoftSkillCommentEntry = {
  user: string;
  comment: string;
  mark: string;
};

type AssessmentStat = {
  softSkills: Record<
    string,
    {
      _areaName: string;
      [competencyId: string]: {
        _competencyName: string;
        entries: SoftSkillCommentEntry[];
      } | string;
    }
  >;
  hardSkills: Record<
    string,
    {
      user: string;
      mark: string;
      _questionText?: string;
    }[]
  >;
};

export const AdminUserAssessmentStatComponent = ({
  userId,
  onBack,
}: {
  userId: string;
  onBack: () => void;
}) => {
  const [data, setData] = useState<AssessmentStat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApi = useApi(fetchApiRef);
  const identityApi = useApi(identityApiRef);

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
          }
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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Failed to load: {error}</Typography>;
  if (!data) return <Typography>No data available.</Typography>;

  return (
    <Card>
      <CardContent>
        <Button onClick={onBack} variant="outlined" color="secondary" sx={{ mb: 2 }}>
          Back
        </Button>

        <Typography variant="h5">Soft Skill Comments</Typography>
        <Divider sx={{ my: 2 }} />

        {Object.entries(data.softSkills).map(([areaId, competencies]) => {
          const areaName = competencies._areaName || areaId;
          return (
            <Paper key={areaId} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Area: {areaName}</Typography>

              {Object.entries(competencies)
                .filter(([key]) => key !== '_areaName')
                .map(([competencyId, block]) => {
                  const comp = block as {
                    _competencyName: string;
                    entries: SoftSkillCommentEntry[];
                  };
                  return (
                    <div key={competencyId} style={{ marginBottom: 12 }}>
                      <Typography variant="subtitle1">
                        Competency: {comp._competencyName}
                      </Typography>
                      {comp.entries.map((entry, idx) => (
                        <Typography key={idx} variant="body2">
                          • {entry.user}: "{entry.comment}" (Mark: {entry.mark})
                        </Typography>
                      ))}
                    </div>
                  );
                })}
            </Paper>
          );
        })}

        <Typography variant="h5" sx={{ mt: 4 }}>
          Hard Skill Marks
        </Typography>
        <Divider sx={{ my: 2 }} />

        {Object.entries(data.hardSkills).map(([questionId, marks]) => {
          const questionText = marks[0]?._questionText || questionId;
          return (
            <Paper key={questionId} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Question: {questionText}</Typography>
              {marks.map((mark, idx) => (
                <Typography key={idx} variant="body2">
                  • {mark.user}: Mark {mark.mark}
                </Typography>
              ))}
            </Paper>
          );
        })}
      </CardContent>
    </Card>
  );
};
