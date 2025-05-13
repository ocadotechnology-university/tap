/**
 * EditingSoftSkillsComponent
 * ==========================
 * Hybrid data flow — authoritative sources
 * ---------------------------------------
 *   • Database (backend API):
 *       - area   → /softSkillAreas           (id ⇒ text)
 *       - title  → /softSkillCompetencies    (text)
 *       - labels → /softSkillMarks           (array of label texts)
 *
 *   • YAML config (assessment-config.yaml):
 *       - description keyed by title
 *
 * Behaviour
 * ---------
 *   1) Load dictionaries & competencies from the backend.
 *   2) Build a map:  title → description  from YAML.
 *   3) For every competency coming from DB, enrich it with the description
 *      found in YAML (fall back to an empty string if the title is missing in
 *      YAML, so UI never crashes).
 *   4) Group final records by **area name** (also coming from DB).
 *
 *   If a competency exists in the DB but has no description in YAML,
 *   it will still be displayed — just with an empty description.
 */

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

type Props = { configData: Record<string, Skill[]> };

export type SoftSkillMerged = {
  title: string;
  description: string;
  area: string;
  labels: string[];
};

const useStyles = makeStyles(theme => ({
  root: { padding: theme.spacing(2) },
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

export const EditingSoftSkillsComponent: React.FC<Props> = ({ configData }) => {
  const classes = useStyles();
  const fetchApi = useApi(fetchApiRef);

  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState<Record<string, SoftSkillMerged[]>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [areasRes, marksRes, compsRes] = await Promise.all([
          fetchApi.fetch('http://localhost:7007/api/team-assessment/softSkillAreas'),
          fetchApi.fetch('http://localhost:7007/api/team-assessment/softSkillMarks'),
          fetchApi.fetch('http://localhost:7007/api/team-assessment/softSkillCompetencies'),
        ]);

        const areas: { id: number; text: string }[] = await areasRes.json();
        const marks: { id: number; text: string }[] = await marksRes.json();
        const comps: { areaId: number; text: string }[] = await compsRes.json();

        const areaIdToName = new Map<number, string>();
        areas.forEach(a => areaIdToName.set(a.id, a.text));

        const genericLabels = marks.map(m => m.text);

        /* 2. YAML lookup maps: description + per‑skill labels */
        const softKey = Object.keys(configData).find(k =>
          k.toLowerCase().includes('soft'),
        );
        const yamlRows: Skill[] = softKey ? configData[softKey] : [];

        const titleToDesc = new Map<string, string>();
        const titleToLabels = new Map<string, string[]>();
        yamlRows.forEach(r => {
          titleToDesc.set(r.title, r.description);
          if (Array.isArray(r.labels) && r.labels.length) {
            titleToLabels.set(r.title, r.labels);
          }
        });

        /* 3. merge & group */
        const groupedData: Record<string, SoftSkillMerged[]> = {};

        comps.forEach(db => {
          const areaName = areaIdToName.get(db.areaId) ?? 'Unknown Area';

          const merged: SoftSkillMerged = {
            title: db.text,
            description: titleToDesc.get(db.text) ?? '',
            labels: titleToLabels.get(db.text) ?? genericLabels,
            area: areaName,
          };

          if (!groupedData[areaName]) groupedData[areaName] = [];
          groupedData[areaName].push(merged);
        });

        setGrouped(groupedData);
      } catch (e) {
        console.error('Soft‑skills load failed', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchApi, configData]);

  /* -------- render -------- */
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
        {Object.entries(grouped).map(([area, list]) => (
          <AssessmentSoftSkillsSection key={area} area={area} sections={list} />
        ))}

        {Object.keys(grouped).length === 0 && (
          <Box mt={4}>
            <Typography align="center" color="textSecondary">
              No soft‑skill data available
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};
