/* eslint-disable import/extensions */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

import { useAuth } from '../hooks/auth';

export function Routes() {
  const { user } = useAuth();
  console.log('Usuário:', user);
  return (
    <NavigationContainer>
      { user?.id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
