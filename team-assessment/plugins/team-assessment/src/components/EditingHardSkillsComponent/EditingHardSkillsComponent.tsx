import React, { useState, useEffect } from 'react';
import { Progress, HorizontalScrollGrid } from '@backstage/core-components';
import { Typography, Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { AssessmentHardSkillsSection } from '../AssessmentHardSkillsSection/AssessmentHardSkillsSection';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';
import { TeamAssessmentSampleCardProps } from '../TeamAssessmentSampleCard/TeamAssessmentSapmleCard'


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
    overflowX: 'hidden',
    width: 'calc(100% + 16px)',
  },
  container: {
    width: '100%',
    overflow: 'hidden',
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
    const loadMappings = async () => {
      try {
        const [sectionsRes, marksRes] = await Promise.all([
          fetchApi.fetch('http://localhost:7007/api/team-assessment/hardSkillSections'),
          fetchApi.fetch('http://localhost:7007/api/team-assessment/hardSkillMarks'),
        ]);

        const sections: { id: number; text: string }[] = await sectionsRes.json();
        const marks: { id: number; text: string }[] = await marksRes.json();

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
    loadMappings();
  }, [fetchApi]);

  if (loading) {
    return <CircularProgress />;
  }

  const hardSkillsCategory = Object.keys(configData).find(
    key => key.toLowerCase().includes('hard')
  );

  if (loading) return <CircularProgress />;

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h1" className={classes.title}>
          Hard Skills Assessment
        </Typography>
        <Typography className={classes.description}>
          Evaluate technical proficiency across key development areas. Select
          ratings based on demonstrated expertise and practical implementation.
        </Typography>
      </div>

      <div className={classes.grid}>
        {(configData[hardSkillsCategory || ''] || []).map(skill => (
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
    </div>
  );
};
