import { createPermission } from '@backstage/plugin-permission-common';

export const teamAssessmentAccessPermission = createPermission({
  name: 'plugin.team-assessment.access',
  attributes: { action: 'read' },
});
