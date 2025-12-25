import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RewardsHub } from './pages/RewardsHub';
import { AuthPage } from './pages/AuthPage';
import { FullPageLoader } from './components/ui';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  return user ? <RewardsHub /> : <AuthPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
