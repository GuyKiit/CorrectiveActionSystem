import './App.css'
import { Outlet } from 'react-router-dom'
import { _GET, _GET_APP } from './service/mas';
import { SplashScreenProvider } from './auth/core/SplashScreen'
import { useLayout } from './layout/core/LayoutProvider';
import LoadingScreen from './components/MUI/LoadingScreen';

function App() {
  const { isLoadingScreen } = useLayout();

  return (
    <>
      <LoadingScreen loading={isLoadingScreen} />
      <SplashScreenProvider>
        <Outlet />
      </SplashScreenProvider>
    </>
  )
}

export default App
