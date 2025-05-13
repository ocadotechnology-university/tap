import React, { useState, useEffect } from 'react';
import { Progress, HorizontalScrollGrid } from '@backstage/core-components';
import { Typography, Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { AssessmentHardSkillsSection } from '../AssessmentHardSkillsSection/AssessmentHardSkillsSection';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';

const useStyles = makeStyles(theme => ({
  header: {
    width: '100%',
    padding: theme.spacing(3, 2),
    '& h2': {
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1),
      fontSize: '1.5rem',
      fontWeight: 600,
    },
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
  },
}));

export type SectionMap = Record<string, number>;
export type MarkMap = Record<string, number>;

type Props = {
  assessmentId: number;
  configData: Record<string, Skill[]>;
  answers: Record<string, string>;
  onAnswerChange: (skillTitle: string, answer: string) => void;
};

export const EditingHardSkillsComponent: React.FC<Props> = ({
  assessmentId,
  configData,
  answers,
  onAnswerChange,
}) => {
  const classes = useStyles();
  const fetchApi = useApi(fetchApiRef);

  const [sectionMap, setSectionMap] = useState<SectionMap>({});
  const [markMap, setMarkMap] = useState<MarkMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sRes, mRes] = await Promise.all([
          fetchApi.fetch('http://localhost:7007/api/team-assessment/hardSkillSections'),
          fetchApi.fetch('http://localhost:7007/api/team-assessment/hardSkillMarks'),
        ]);
        const sections: { id: number; text: string }[] = await sRes.json();
        const marks: { id: number; text: string }[] = await mRes.json();

        const sMap: SectionMap = {};
        sections.forEach(s => (sMap[s.text] = s.id));
        const mMap: MarkMap = {};
        marks.forEach(m => (mMap[m.text] = m.id));

        setSectionMap(sMap);
        setMarkMap(mMap);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [fetchApi]);

  if (loading) {
    return <CircularProgress />;
  }

  const hardKey = Object.keys(configData).find(k =>
    k.toLowerCase().includes('hard'),
  );
  const hardArray: Skill[] = hardKey ? configData[hardKey] : [];

  return (
    <>
      <div className={classes.header}>
        <h2>Hard Skills Assessment</h2>
        <p>
          Evaluate technical proficiency across key development areas. Select
          ratings based on demonstrated expertise and practical implementation.
        </p>
      </div>
      <div className={classes.grid}>
        {hardArray.map(skill => (
          <AssessmentHardSkillsSection
            key={skill.title}
            assessmentId={assessmentId}
            skill={skill}
            selectedAnswer={answers[skill.title] || ''}
            onAnswerChange={answer => onAnswerChange(skill.title, answer)}
            sectionMap={sectionMap}
            markMap={markMap}
          />
        ))}
      </div>
    </>
  );
};
