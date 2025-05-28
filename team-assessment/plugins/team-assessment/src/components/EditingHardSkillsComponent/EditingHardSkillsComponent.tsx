import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { AssessmentHardSkillsSection } from '../AssessmentHardSkillsSection/AssessmentHardSkillsSection';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';

const useStyles = makeStyles(theme => ({
  title: { fontSize: '2rem', fontWeight: 600, color: theme.palette.text.primary },
  description: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    lineHeight: 1.5,
  },
  header: {
    width: '100%',
    padding: theme.spacing(3, 2),
    '& h2': { color: theme.palette.text.primary, marginBottom: theme.spacing(1) },
    '& p': {
      color: theme.palette.text.secondary,
      fontSize: '0.95rem',
      lineHeight: 1.6,
      maxWidth: 800,
    },
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(-1),
    padding: theme.spacing(2),
    overflowX: 'hidden',
    width: 'calc(100% + 16px)',
  },
  container: { width: '100%', overflow: 'hidden' },
}));

export type SectionMap = Record<string, number>;
export type MarkMap = Record<string, number>;

interface Props {
  assessmentId: number;
  configData: Record<string, Skill[]>;
  answers: Record<string, string>;
  onAnswerChange: (title: string, answer: string) => void;
  initialMarks?: Array<{ questionId: number; markId: number }>;
  readOnly?: boolean;
}

export const EditingHardSkillsComponent: React.FC<Props> = ({
  assessmentId,
  configData,
  answers,
  onAnswerChange,
  initialMarks = [],
  readOnly = false,
}) => {
  const classes = useStyles();
  const fetchApi = useApi(fetchApiRef);

  const [sectionMap, setSectionMap] = useState<SectionMap>({});
  const [markMap, setMarkMap] = useState<MarkMap>({});
  const [loading, setLoading] = useState(true);
  const [derived, setDerived] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const [secRes, markRes] = await Promise.all([
          fetchApi.fetch('http://localhost:7007/api/team-assessment/hardSkillSections'),
          fetchApi.fetch('http://localhost:7007/api/team-assessment/hardSkillMarks'),
        ]);
        const sections: { id: number; text: string }[] = await secRes.json();
        const marks: { id: number; text: string }[] = await markRes.json();

        const sMap: SectionMap = {};
        const mMap: MarkMap = {};
        sections.forEach(s => (sMap[s.text] = s.id));
        marks.forEach(m => (mMap[m.text] = m.id));

        setSectionMap(sMap);
        setMarkMap(mMap);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchApi]);

  useEffect(() => {
    if (loading || !initialMarks.length || !Object.keys(sectionMap).length) return;

    const reverseSections = new Map<number, string>(
      Object.entries(sectionMap).map(([k, v]) => [v, k]),
    );
    const reverseMarks = new Map<number, string>(
      Object.entries(markMap).map(([k, v]) => [v, k]),
    );

    const tmp: Record<string, string> = {};
    initialMarks.forEach(({ questionId, markId }) => {
      const title = reverseSections.get(questionId);
      const label = reverseMarks.get(markId);
      if (title && label) tmp[title] = label;
    });
    setDerived(tmp);

    Object.entries(tmp).forEach(([t, l]) => onAnswerChange(t, l));
  }, [loading, sectionMap, markMap, initialMarks, onAnswerChange]);

  if (loading) return <CircularProgress />;

  const hardCategory =
    Object.keys(configData).find(k => k.toLowerCase().includes('hard')) || '';

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h1" className={classes.title}>
          Hard Skills Assessment
        </Typography>
        <Typography className={classes.description}>
          Evaluate technical proficiency across key development areas. Select ratings based on
          demonstrated expertise and practical implementation.
        </Typography>
      </div>

      <div className={classes.grid}>
        {(configData[hardCategory] || []).map(skill => (
          <AssessmentHardSkillsSection
            key={skill.title}
            assessmentId={assessmentId}
            skill={skill}
            selectedAnswer={answers[skill.title] ?? derived[skill.title] ?? ''}
            onAnswerChange={ans => onAnswerChange(skill.title, ans)}
            sectionMap={sectionMap}
            markMap={markMap}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
};
