import React, { useEffect, useState } from 'react';
import { useApi, identityApiRef } from '@backstage/core-plugin-api';

export const HelloUserComponent = () => {
  const identityApi = useApi(identityApiRef);
  const [userName, setUserName] = useState<string>('Guest');

  useEffect(() => {
    identityApi.getProfileInfo()
      .then(profile => {
        setUserName(profile.displayName || profile.email || 'Guest');
      })
      .catch(error => {
        console.error('Error: ', error);
      });
  }, [identityApi]);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Hello, {userName}!</h1>
    </div>
  );
};
