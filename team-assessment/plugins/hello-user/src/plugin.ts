import React from 'react';
import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { HelloUserComponent } from './components/HelloUserComponent';

export const helloUserPlugin = createPlugin({
  id: 'hello-user',
  routes: {
    root: rootRouteRef,
  },
});

export const HelloUserPage = helloUserPlugin.provide(
  createRoutableExtension({
    name: 'HelloUserPage',
    component: () =>
      Promise.resolve(HelloUserComponent), 
    mountPoint: rootRouteRef,
  }),
);
