import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { teamAssessmentPlugin, TeamAssessmentPage } from '../src/plugin';

createDevApp()
  .registerPlugin(teamAssessmentPlugin)
  .addPage({
    element: <TeamAssessmentPage />,
    title: 'Root Page',
    path: '/team-assessment',
  })
  .render();
