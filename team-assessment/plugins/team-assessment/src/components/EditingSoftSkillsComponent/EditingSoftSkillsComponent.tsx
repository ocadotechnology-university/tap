
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { AssessmentSoftSkillsSection } from '../AssessmentSoftSkillsSection/AssessmentSoftSkillsSection';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';

type Props = {
  assessmentId: number;
  configData: Record<string, Skill[]>;
};

export type SoftSkillMerged = {
  title: string;
  description: string;
  area: string;
  areaId: number;
  competencyId: number;
  labels: string[];
};

const useStyles = makeStyles(theme => ({
  root: { 
    padding: theme.spacing(2),
    overflow: 'hidden',
    height: '100%',
    width: '100%',
    margin: 0,
  },
  header: { marginBottom: theme.spacing(3) },
  title: { fontSize: '2rem', fontWeight: 600, color: theme.palette.text.primary },
  description: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    lineHeight: 1.5,
  },
  content: { paddingTop: theme.spacing(1) },
  loader: { display: 'flex', justifyContent: 'center', marginTop: theme.spacing(4) },
}));

interface CommentDTO {
  id: number;
  commentText: string;
  areaId: number;
  competencyId: number;
  markId: number;
}

export const EditingSoftSkillsComponent: React.FC<Props> = ({
  assessmentId,
  configData,
}) => {
  const classes = useStyles();
  const fetchApi = useApi(fetchApiRef);

  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState<Record<string, SoftSkillMerged[]>>({});
  const [marksMap, setMarksMap] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<CommentDTO[]>([]);

  /* ── load dictionaries, competencies and comments ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [areasRes, marksRes, compsRes, commentsRes] = await Promise.all([
          fetchApi.fetch('http://localhost:7007/api/team-assessment/softSkillAreas'),
          fetchApi.fetch('http://localhost:7007/api/team-assessment/softSkillMarks'),
          fetchApi.fetch('http://localhost:7007/api/team-assessment/softSkillCompetencies'),
          fetchApi.fetch(
            `http://localhost:7007/api/team-assessment/softSkillComments?assessmentId=${assessmentId}`,
          ),
        ]);

        const areas: { id: number; text: string }[] = await areasRes.json();
        const marks: { id: number; text: string }[] = await marksRes.json();
        const comps: { areaId: number; competencyId: number; text: string }[] =
          await compsRes.json();
        const commentsList: CommentDTO[] = await commentsRes.json();

        const areaIdToName = new Map<number, string>();
        areas.forEach(a => areaIdToName.set(a.id, a.text));

        const mMap: Record<string, number> = {};
        marks.forEach(m => (mMap[m.text] = m.id));
        setMarksMap(mMap);

        const softRows = configData[
          Object.keys(configData).find(k => k.toLowerCase().includes('soft')) ?? ''
        ] as Skill[] | undefined;

        const titleToDesc = new Map<string, string>();
        const titleToLabels = new Map<string, string[]>();
        softRows?.forEach(r => {
          titleToDesc.set(r.title, r.description);
          if (r.labels?.length) titleToLabels.set(r.title, r.labels);
        });

        const groupedData: Record<string, SoftSkillMerged[]> = {};
        comps.forEach(db => {
          const areaName = areaIdToName.get(db.areaId) ?? 'Unknown Area';
          const merged: SoftSkillMerged = {
            title: db.text,
            description: titleToDesc.get(db.text) ?? '',
            labels: titleToLabels.get(db.text) ?? marks.map(m => m.text),
            area: areaName,
            areaId: db.areaId,
            competencyId: db.competencyId,
          };
          if (!groupedData[areaName]) groupedData[areaName] = [];
          groupedData[areaName].push(merged);
        });

        setGrouped(groupedData);
        setComments(commentsList);
      } catch (e) {
        console.error('Soft-skills load failed', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchApi, configData, assessmentId]);

  if (loading)
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );

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
        {Object.entries(grouped).map(([areaName, list]) => (
          <AssessmentSoftSkillsSection
            key={areaName}
            area={areaName}
            sections={list}
            assessmentId={assessmentId}
            marksMap={marksMap}
            comments={comments}
          />
        ))}

        {!Object.keys(grouped).length && (
          <Box mt={4}>
            <Typography align="center" color="textSecondary">
              No soft-skill data available
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};
