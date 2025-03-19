import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { helloUserPlugin, HelloUserPage } from '../src/plugin';

createDevApp()
  .registerPlugin(helloUserPlugin)
  .addPage({
    element: <HelloUserPage />,
    title: 'Root Page',
    path: '/hello-user',
  })
  .render();
