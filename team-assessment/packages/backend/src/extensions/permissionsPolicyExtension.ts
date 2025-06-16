import fs from 'fs';
import yaml from 'yaml';
import path from 'path';

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  PolicyDecision,
  AuthorizeResult,
  isPermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';

import {
  teamAssessmentAccessPermission,
  teamAssessmentAdminPermission,
} from '../../../../plugins/team-assessment-backend/src/permissions/permissions';

const accessConfigPath = path.resolve(
  __dirname,
  '../../../../plugins/team-assessment-backend/access-config.yaml',
);

const accessConfig = yaml.parse(fs.readFileSync(accessConfigPath, 'utf8')) as {
  permissions: {
    teamAssessment: {
      allowedGroups: string[];
      adminUsers: string[];
    };
  };
};

class CombinedPermissionPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery, user?: PolicyQueryUser): Promise<PolicyDecision> {
    const { adminUsers, allowedGroups } = accessConfig.permissions.teamAssessment;

    if (!user) {
      return { result: AuthorizeResult.DENY };
    }

    const userRef = user.info.userEntityRef;
    const userOwnershipRefs = user.info.ownershipEntityRefs ?? [];

    if (isPermission(request.permission, teamAssessmentAdminPermission)) {
      const isAdmin = adminUsers.includes(userRef);
      return { result: isAdmin ? AuthorizeResult.ALLOW : AuthorizeResult.DENY };
    }

    if (isPermission(request.permission, teamAssessmentAccessPermission)) {
      const hasGroup = userOwnershipRefs.some(ref => allowedGroups.includes(ref));
      return { result: hasGroup ? AuthorizeResult.ALLOW : AuthorizeResult.DENY };
    }

    return { result: AuthorizeResult.ALLOW };
  }
}

export default createBackendModule({
  pluginId: 'permission',
  moduleId: 'combined-permission-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new CombinedPermissionPolicy());
      },
    });
  },
});
