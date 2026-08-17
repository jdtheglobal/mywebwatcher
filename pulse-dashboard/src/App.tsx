import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { usePulseStore } from './store/usePulseStore';

import { Landing } from './pages/Landing';

function App() {
  const checkAuth = usePulseStore((state) => state.checkAuth);
  const { user, isAuthLoading } = usePulseStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
