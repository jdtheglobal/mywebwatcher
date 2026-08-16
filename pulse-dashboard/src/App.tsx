import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { usePulseStore } from './store/usePulseStore';

function App() {
  const checkAuth = usePulseStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
