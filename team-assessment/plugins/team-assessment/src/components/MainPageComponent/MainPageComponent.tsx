import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import yaml from 'js-yaml';
import { Header, Page, Content } from '@backstage/core-components';

import { TeamAssessmentSampleCard } from '../TeamAssessmentSampleCard';
import { MyAssessmentsComponent } from '../MyAssessmentsComponent';
import type { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';
import { EditingAssessmentComponent } from '../EditingAssessmentComponent/EditingAssessmentComponent';


/**
 * ---------- Styles ----------
 */
const useStyles = makeStyles({
  content: {
    padding: 0,
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  grid: {
    width: '100%',
    maxWidth: '100%',
  },
});

/**
 * Main landing page.
 *  – shows the sample card + assessments list;
 *  – switches to EditingAssessmentComponent when user starts editing.
 */
export const MainPageComponent = () => {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [configData, setConfigData] = useState<Record<string, Skill[]> | null>(
    null,
  );

  /* ---------- Handlers ---------- */
  const startEditing = (id: number) => {
    setEditingId(id);
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const resp = await fetch('/assessment-config.yaml');
        const text = await resp.text();

        /**
         * The YAML schema is
         *   {
         *     'Soft Skills': [ { area, title, description, labels[] } ],
         *     'Hard Skills': [ { title, description, labels[] } ]
         *   }
         *
         * Casting to Record<string, Skill[]> is safe as every element has
         * at least title/description/labels (area is optional for hard skills).
         */
        const data = yaml.load(text) as Record<string, Skill[]>;
        setConfigData(data);
      } catch (err) {
        console.error('Error loading YAML config', err);
      }
    };

    fetchConfig();
  }, []);

  return (
    <Page themeId="tool">
      <Content className={classes.content}>
        {isEditing && editingId !== null ? (
          configData ? (
            <EditingAssessmentComponent
              assessmentId={editingId}
              configData={configData}
              onBackToMain={stopEditing}
            />
          ) : (
            <div>Loading...</div>
          )
        ) : (
          <>
            <TeamAssessmentSampleCard onStartEditing={startEditing} />
            <MyAssessmentsComponent />
          </>
        )}
      </Content>
    </Page>
  );
};
