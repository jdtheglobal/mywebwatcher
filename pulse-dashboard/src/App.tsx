import { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { usePulseStore } from './store/usePulseStore';

function App() {
  const fetchUser = usePulseStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}

export default App;
