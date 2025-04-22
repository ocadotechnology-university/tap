import React, { useEffect, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import yaml from 'js-yaml';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
import { AssessmentSoftSkillsSection } from '../AssessmentSoftSkillsSection';
import { TeamAssessmentSampleCard } from '../TeamAssessmentSampleCard';
import { MyAssessmentsComponent } from '../MyAssessmentsComponent';

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

export const ExampleComponent = () => {
  const classes = useStyles();
  const [configData, setConfigData] = useState<Record<string, { title: string, labels: string[] }[]> | null>(null);

  // yaml from public
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/assessment-config.yaml');
        const text = await response.text();
        const data = yaml.load(text) as Record<string, { title: string, labels: string[] }[]>;
        setConfigData(data);
      } catch (error) {
        console.error("Error while seting configuration:", error);
      }
    };

    fetchConfig();
  }, []);

  if (!configData) {
    return <div>Loading...</div>;
  }
  return (
  <Page themeId="tool">
    <Header title="Team Assessment Plugin"></Header>
    <Content className={classes.content}>
      <TeamAssessmentSampleCard />
      <MyAssessmentsComponent />
      {Object.entries(configData).map(([category, sections]) => (
          <React.Fragment key={category}>
            {sections.map(section => (
              <AssessmentSoftSkillsSection
                key={section.title}
                title={section.title}
                labels={section.labels}
              />
            ))}
          </React.Fragment>
        ))}
    </Content>
  </Page>
  )
};
