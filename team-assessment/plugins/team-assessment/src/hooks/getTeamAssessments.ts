import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import { GroupEntity } from '@backstage/catalog-model';
import useAsync from 'react-use/esm/useAsync';

export interface UserWithAssessment {
  id: string;
  name: string;
  displayName?: string;
  email?: string;
  picture?: string;
  hasAssessment: boolean;
  assessmentId?: number;
}

export const getTeamAssessments = () => {
  const catalogApi = useApi(catalogApiRef);
  const fetchApi = useApi(fetchApiRef);
  const { entity } = useEntity<GroupEntity>();

  return useAsync(async () => {
    const members = entity.relations
      ?.filter(r => r.type === 'hasMember')
      .map(r => r.targetRef) || [];
    const names = members.map(ref => ref.split('/').pop()!);

    const { items } = await catalogApi.getEntities({
      filter: { kind: 'User', 'metadata.name': names },
    });

    const assessed: Array<{ targetUser: string; id: number }> = await fetchApi
      .fetch(
        `http://localhost:7007/api/team-assessment/getAssessments?teamId=${encodeURIComponent(
          entity.metadata.name,
        )}`,
      )
      .then(r => r.json());

    const assessedNames = new Set(assessed.map(a => a.targetUser));

    const allUsers: UserWithAssessment[] = (items as any[]).map(u => {
      const name = u.metadata.name as string;
      const rec = assessed.find(a => a.targetUser === name);
      return {
        id: name,
        name,
        displayName: u.spec?.profile?.displayName,
        email: u.spec?.profile?.email,
        picture: u.spec?.profile?.picture,
        hasAssessment: assessedNames.has(name),
        assessmentId: rec?.id,
      };
    });

    return {
      allUsers,
      teamId: entity.metadata.name,
      assessedUsers: assessed,
      hasAssessment: (userId: string) => assessedNames.has(userId),
    };
  }, [entity, catalogApi]);
};
