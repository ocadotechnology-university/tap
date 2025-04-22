import React from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
} from '@backstage/core-components';
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
  return (
  <Page themeId="tool">
    <Header title="Team Assessment Plugin"></Header>
    <Content className={classes.content}>
      <TeamAssessmentSampleCard />
      <MyAssessmentsComponent />
    </Content>
  </Page>
  )
};
