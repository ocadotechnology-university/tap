import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import yaml from 'js-yaml';
import { Page, Content } from '@backstage/core-components';
import { usePermission } from '@backstage/plugin-permission-react';

import { teamAssessmentAdminPermission } from '../../../../../packages/app/src/permissions/permissions'; // шлях з MainPageComponent до packages/app/src/permissions/permissions.ts

import { EditAssessmentComponent } from '../EditAssessmentComponent/EditAssessmentComponent';
import { ReviewAssessmentComponent } from '../ReviewAssessmentComponent/ReviewAssessmentComponent';
import { Skill } from '../EditingAssessmentComponent/EditingAssessmentComponent';
import { MainMenuComponent } from '../MainMenuComponent/MainMenuComponent';
import { AdminMainMenuComponent } from '../AdminComponents/AdminMainMenuComponent/AdminMainMenuComponent';

const useStyles = makeStyles({
  content: {
    padding: 0,
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
});

export const MainPageComponent = () => {
  const classes = useStyles();
  const [configData, setConfigData] = useState<Record<string, Skill[]> | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [mode, setMode] = useState<'main' | 'edit' | 'review'>('main');

  const { allowed: isAdmin, loading: adminLoading } = usePermission({
    permission: teamAssessmentAdminPermission,
  });

  useEffect(() => {
    (async () => {
      const resp = await fetch('/assessment-config.yaml');
      const text = await resp.text();
      setConfigData(yaml.load(text) as Record<string, Skill[]>);
    })();
  }, []);

  const backToMain = () => {
    setActiveId(null);
    setMode('main');
  };

  const startEditing = (id: number) => {
    setActiveId(id);
    setMode('edit');
  };

  const startReviewing = (id: number) => {
    setActiveId(id);
    setMode('review');
  };

  if (adminLoading) {
    return (
      <Page themeId="tool">
        <Content className={classes.content}>Loading permissions...</Content>
      </Page>
    );
  }

  return (
    <Page themeId="tool">
      <Content className={classes.content} >
        {mode === 'edit' && activeId != null && configData ? (
          <EditAssessmentComponent
            assessmentId={activeId}
            configData={configData}
            onBackToMain={backToMain}
          />
        ) : mode === 'review' && activeId != null && configData ? (
          <ReviewAssessmentComponent
            assessmentId={activeId}
            configData={configData}
            onBackToMain={backToMain}
          />
        ) : isAdmin ? (
          <AdminMainMenuComponent/>
        ) : (
          <MainMenuComponent
            onStartEditing={startEditing}
            onStartReviewing={startReviewing}
          />
        )}
      </Content>
    </Page>
  );
};
