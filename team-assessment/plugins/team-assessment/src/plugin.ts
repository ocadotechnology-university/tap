import {
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const teamAssessmentPlugin = createPlugin({
  id: 'team-assessment',
  routes: {
    root: rootRouteRef,
  },
});

export const TeamAssessmentSampleCard = teamAssessmentPlugin.provide(
  createComponentExtension({
    component: {
      lazy: () =>
        import('./components/TeamAssessmentSampleCard').then(
          m => m.TeamAssessmentSampleCard,
        ),
    },
  }),
);

export const TeamAssessmentPage = teamAssessmentPlugin.provide(
  createRoutableExtension({
    name: 'TeamAssessmentPage',
    component: () =>
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
