import React from 'react';
import { Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import { TeamAssessmentSampleCard } from '../TeamAssessmentSampleCard';
import { ButtonComponent } from '../ButtonComponent'
import { AssessmentList } from '../AssessmentList';

export const ExampleComponent = () => (
  <Page themeId="tool">
    <Header title="Team Assessment Plugin"></Header>
    <Content>
      <ContentHeader title="Sample Text Fetching">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <TeamAssessmentSampleCard />
        </Grid>
        <Grid item>
          <ButtonComponent />
        </Grid>
        <Grid item>
          <AssessmentList />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
