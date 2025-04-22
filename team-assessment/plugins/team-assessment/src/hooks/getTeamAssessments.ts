import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import { GroupEntity } from '@backstage/catalog-model';
import useAsync from 'react-use/esm/useAsync';

export const getTeamAssessments = () => {
  const catalogApi = useApi(catalogApiRef);
  const fetchApi = useApi(fetchApiRef);
  const { entity } = useEntity<GroupEntity>();

  return useAsync(async () => {
    const members = entity.relations
      ?.filter(rel => rel.type === 'hasMember')
      .map(rel => rel.targetRef) || [];

    const { items } = await catalogApi.getEntities({
      filter: {
        kind: 'User',
        'metadata.name': members.map(ref => {
          const parts = ref.split('/');
          return parts[parts.length - 1];
        }),
      },
    });

    const assessedUsers = await fetchApi.fetch(
        `http://localhost:7007/api/team-assessment/getassessments?teamId=${encodeURIComponent(entity.metadata.name)}`,
        {
            headers: {
                Accept: 'application/json',
            },
        },
      ).then(res => res.json());

    const assessedUsersSet = new Set(assessedUsers);

    return {
      allUsers: items.map((user: any) => ({
        id: user.metadata.name,
        name: user.metadata.name,
        displayName: user.spec?.profile?.displayName,
        email: user.spec?.profile?.email,
        picture: user.spec?.profile?.picture,
        hasAssessment: assessedUsersSet.has(user.metadata.name)
      })),
      
      assessedUsers,
      
      hasAssessment: (userId: string) => assessedUsers.includes(userId)
    };
  }, [entity, catalogApi]);
};