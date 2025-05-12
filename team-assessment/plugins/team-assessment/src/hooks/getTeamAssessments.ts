import { useApi, fetchApiRef } from '@backstage/core-plugin-api';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import { GroupEntity } from '@backstage/catalog-model';
import useAsync from 'react-use/esm/useAsync';

export const getTeamAssessments = () => {
  const catalogApi = useApi(catalogApiRef);
  const fetchApi = useApi(fetchApiRef);
  const { entity } = useEntity<GroupEntity>();

  // Логування для перевірки даних entity
  console.log('Entity:', entity);

  return useAsync(async () => {
    // Логування для перевірки отримання членів команди
    console.log('Starting to fetch team assessments...');

    const members = entity.relations
      ?.filter(rel => rel.type === 'hasMember')
      .map(rel => rel.targetRef) || [];

    console.log('Members:', members);

    const { items } = await catalogApi.getEntities({
      filter: {
        kind: 'User',
        'metadata.name': members.map(ref => {
          const parts = ref.split('/');
          console.log("Parts:", parts); // Логування кожного члена
          return parts[parts.length - 1];
        }),
      },
    });

    // Логування отриманих користувачів
    console.log('Fetched users:', items);

    const assessedUsers = await fetchApi.fetch(
      `http://localhost:7007/api/team-assessment/getassessments?teamId=${encodeURIComponent(entity.metadata.name)}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    ).then(res => res.json());

    // Логування результату запиту на оцінку
    console.log('Assessed users data:', assessedUsers);

    // Перевірка на помилки в отриманні оцінок
    if (assessedUsers.error) {
      console.error('Error fetching assessed users:', assessedUsers.error);
    }

    const assessedUsersSet = new Set(assessedUsers);

    return {
      allUsers: items.map((user: any) => ({
        id: user.metadata.name,
        name: user.metadata.name,
        displayName: user.spec?.profile?.displayName,
        email: user.spec?.profile?.email,
        picture: user.spec?.profile?.picture,
        hasAssessment: assessedUsersSet.has(user.metadata.name),
      })),
      teamId: entity.metadata.name,
      assessedUsers,
      hasAssessment: (userId: string) => assessedUsers.includes(userId),
    };
  }, [entity, catalogApi]);
};
