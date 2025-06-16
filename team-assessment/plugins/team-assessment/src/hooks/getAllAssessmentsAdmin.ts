import { useApi, identityApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';
import { parseEntityRef } from '@backstage/catalog-model';

interface AssessmentRecord {
  targetUser: string;
  createdBy: string;
  date: string;
}

interface UserWithAssessment {
  id: string;
  profile: {
    displayName: string;
    email?: string;
  };
}

interface Result {
  assessedUsers: AssessmentRecord[];
  allUsers: UserWithAssessment[];
  teamId: string;
}

export const getAllAssessmentsAdmin = () => {
  const catalogApi = useApi(catalogApiRef);
  const fetchApi = useApi(fetchApiRef);
  const identityApi = useApi(identityApiRef);

  return useAsync(async (): Promise<Result> => {
    const identity = await identityApi.getBackstageIdentity();
    const userEntityRef = identity.userEntityRef;
    const username = userEntityRef.split(':')[1]?.split('/')[1];

    console.log('Logged in admin username:', username);

    const entity = await catalogApi.getEntityByRef('group:default/marketing');
    if (!entity) throw new Error('Team group not found');

  const teamMembersRefs =
    entity.relations?.filter(r => r.type === 'hasMember').map(r => r.targetRef) ?? [];

  const teamMemberNames = teamMembersRefs.map(ref => {
    const parsed = parseEntityRef(ref);
    return parsed.name;
  });


    console.log('Team member names:', teamMemberNames);

    const users = await Promise.all(
      teamMemberNames.map(async (name: string) => {
        const ref = `user:default/${name}`;
        const user = await catalogApi.getEntityByRef(ref);
        if (!user) return null;
        return {
          id: name,
          profile: {
            displayName: user.metadata?.name ?? name,
            email: (user.spec as any)?.profile?.email,
          },
        };
      }),
    );

    const items = users.filter(Boolean) as UserWithAssessment[];
    console.log('Fetched users:', items);

    const url = `http://localhost:7007/api/team-assessment/getAllAssessments?teamId=${encodeURIComponent(entity.metadata.name)}`;
    console.log('Fetching assessments from:', url);

    const response = await fetchApi.fetch(url);
    console.log('Raw response status:', response.status);

    const text = await response.text();
    console.log('Raw response text:', text);

    let data: AssessmentRecord[] = [];

    try {
      data = JSON.parse(text || '[]');
      console.log('Parsed assessments:', data);
    } catch (e) {
      console.error('JSON parse error:', e);
    }

    return {
      assessedUsers: data,
      allUsers: items,
      teamId: entity.metadata.name,
    };
  });
};
