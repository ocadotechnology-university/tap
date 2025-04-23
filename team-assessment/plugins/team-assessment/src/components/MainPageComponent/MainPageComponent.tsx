import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import yaml from 'js-yaml';
import {
  Header,
  Page,
  Content
} from '@backstage/core-components';
import { TeamAssessmentSampleCard } from '../TeamAssessmentSampleCard';
import { MyAssessmentsComponent } from '../MyAssessmentsComponent';
import { EditingAssessmentComponent } from '../EditingAssessmentComponent';


const useStyles = makeStyles({
  content: {
    padding: '0px',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  grid: {
    width: '100%',
    maxWidth: '100%',
  },
});

export const MainPageComponent = () => {
  const classes = useStyles();
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);
  const [configData, setConfigData] = useState<Record<string, { title: string, labels: string[] }[]> | null>(null);

  const startEditing = () => setIsEditingAssessment(true);
  const stopEditing = () => setIsEditingAssessment(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/assessment-config.yaml');
        const text = await response.text();
        const data = yaml.load(text) as Record<string, { title: string, labels: string[] }[]>;
        setConfigData(data);
      } catch (error) {
        console.error("Error while setting configuration:", error);
      }
    };

    fetchConfig();
  }, []);

  if (isEditingAssessment) {
    if (!configData) {
      return <div>Loading...</div>;
    }
    return (
      <EditingAssessmentComponent configData={configData} onBackToMain={stopEditing} />
    );
  }


  return (
    <Page themeId="tool">
      <Header title="Team Assessment Plugin"></Header>
      <Content className={classes.content}>
        <TeamAssessmentSampleCard onStartEditing={startEditing} />
        <MyAssessmentsComponent />
      </Content>
    </Page>
  );
};
