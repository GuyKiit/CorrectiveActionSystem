import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routing/AppRoutes.tsx'
import { AuthProvider } from './auth/core/AuthContext.tsx'
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { LayoutProvider } from './layout/core/LayoutProvider.tsx'
import { DataProvider } from './auth/core/DataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LayoutProvider>
        <AuthProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </AuthProvider>
      </LayoutProvider>
    </ThemeProvider>
  </StrictMode>
)
