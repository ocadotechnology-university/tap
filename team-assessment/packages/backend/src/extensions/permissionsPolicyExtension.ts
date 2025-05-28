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
import { teamAssessmentAccessPermission } from '../../../../plugins/team-assessment-backend/src/permissions/permissions';
import { getAccessConfig } from '../../../../plugins/team-assessment-backend/src/utils/accessConfigLoader';

type AccessConfig = {
  permissions: {
    teamAssessment: {
      allowedGroups: string[];
      adminUsers: string[];
    };
  };
};

// === Завантаження YAML-конфігурації під час створення політики ===
const accessConfigPath = path.resolve(
  __dirname,
  '../../../../plugins/team-assessment-backend/access-config.yaml',
);

const accessConfig: AccessConfig = yaml.parse(
  fs.readFileSync(accessConfigPath, 'utf8'),
);
class CustomPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (!isPermission(request.permission, teamAssessmentAccessPermission)) {
      return { result: AuthorizeResult.ALLOW };
    }

    if (!user) {
      return { result: AuthorizeResult.DENY };
    }

    const userRef = user.info.userEntityRef;
    const userOwnershipRefs = user.info.ownershipEntityRefs ?? [];

    const { adminUsers, allowedGroups } = getAccessConfig().permissions.teamAssessment;


    if (adminUsers.includes(userRef)) {
      return { result: AuthorizeResult.ALLOW };
    }

    const hasAllowedGroup = userOwnershipRefs.some(ref => allowedGroups.includes(ref));

    if (hasAllowedGroup) {
      return { result: AuthorizeResult.ALLOW };
    }

    return { result: AuthorizeResult.DENY };
  }
}


export default createBackendModule({
  pluginId: 'permission',
  moduleId: 'permission-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new CustomPermissionPolicy());
      },
    });
  },
});


// import { createBackendModule } from '@backstage/backend-plugin-api';
// import {
//   PolicyDecision,
//   AuthorizeResult,
//   isPermission,
// } from '@backstage/plugin-permission-common';
// import {
//   PermissionPolicy,
//   PolicyQuery,
//   PolicyQueryUser,
// } from '@backstage/plugin-permission-node';
// import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';
// import { teamAssessmentAccessPermission } from '../../../../plugins/team-assessment-backend/src/permissions/permissions';

// class CustomPermissionPolicy implements PermissionPolicy {
//   async handle(
//     request: PolicyQuery,
//     user?: PolicyQueryUser,
//   ): Promise<PolicyDecision> {
//     // Якщо це запит на teamAssessmentAccessPermission
//     if (isPermission(request.permission, teamAssessmentAccessPermission)) {
//       // Перевіряємо, чи користувач є гостем
//       // Наприклад, у user.identity.provider === 'guest'
//       // Або в user.groups міститься 'guest' — залежить від конфігурації авторизації

//       if (user?.identity?.userEntityRef === 'user:development/guest') {
//         return { result: AuthorizeResult.DENY };
//       } else {
//         return { result: AuthorizeResult.ALLOW };
//       }
//     }

//     // Для інших дозволів даємо дозвіл за замовчуванням
//     return { result: AuthorizeResult.ALLOW };
//   }
// }


// export default createBackendModule({
//   pluginId: 'permission',
//   moduleId: 'permission-policy',
//   register(reg) {
//     reg.registerInit({
//       deps: { policy: policyExtensionPoint },
//       async init({ policy }) {
//         policy.setPolicy(new CustomPermissionPolicy());
//       },
//     });
//   },
// });