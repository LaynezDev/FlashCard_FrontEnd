import React from 'react';
import { AuthProvider } from '@shared/context/AuthContext';
import RootNavigator from '@shared/components/RootNavigator';

function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

export default App;
