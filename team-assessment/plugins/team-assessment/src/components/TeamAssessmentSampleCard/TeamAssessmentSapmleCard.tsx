import React from 'react';
import { Progress, HorizontalScrollGrid } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity, catalogApiRef } from '@backstage/plugin-catalog-react';
import { GroupEntity } from '@backstage/catalog-model';
import useAsync from 'react-use/esm/useAsync';
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { UserCard } from '../AssessmentCard';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0',
    background: theme.palette.background.paper,
    padding: '1rem',
    gap: '1rem',
    width: '100%',
    maxWidth: '100%',
  },
  counter: {
    fontSize: '1rem',
    marginBottom: 0,
  },
}));

export const TeamAssessmentSampleCard = () => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const { entity } = useEntity<GroupEntity>();

  const state = useAsync(async () => {
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

    return items.map((user: any) => ({
      id: user.metadata.name,
      name: user.metadata.name,
      displayName: user.spec?.profile?.displayName,
      email: user.spec?.profile?.email,
      picture: user.spec?.profile?.picture,
    }));
  }, [entity, catalogApi]);

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.counter}>
        Team Members ({state.value?.length || 0}):
      </Typography>

      {state.loading ? (
        <Progress />
      ) : state.error ? (
        <div>Error: {state.error.message}</div>
      ) : state.value?.length ? (
        <div style={{ padding: '8px'}}>
          <HorizontalScrollGrid>
            {state.value.map(user => (
              <Box key={user.id} sx={{ minWidth: 240, pr: 2 }}>
                <UserCard user={user} />
              </Box>
            ))}
          </HorizontalScrollGrid>
        </div>
      ) : (
        <div>No members found</div>
      )}
    </div>
  );
};
