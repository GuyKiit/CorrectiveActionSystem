import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { login_auth_emp_get } from '../../service/login';
import { logintType, AuthModel, auth_role_profile, auth_role_menu, auth_role_menu_func, auth_app_info } from '../../types/users';
import { fetchIpAddress } from '../../service/ip';
import { useLayout } from '../../layout/core/LayoutProvider';

interface AuthContextType {
  isAuthenticated: boolean;
  error: string;
  login: (user: string, password: string) => Promise<void>;
  logout: () => void;
  userData: auth_role_profile[] | null;
  menuData: auth_role_menu[] | null;
  menuFuncData: auth_role_menu_func[] | null;
  infoData: auth_app_info[] | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setIsLoadingScreen } = useLayout();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<auth_role_profile[] | null>(null);
  const [menuData, setMenuData] = useState<auth_role_menu[] | null>(null);
  const [menuFuncData, setMenuFuncData] = useState<auth_role_menu_func[] | null>(null);
  const [infoData, setInfoData] = useState<auth_app_info[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount and window focus
  useEffect(() => {
    checkSession();

    // Add event listeners for window focus and storage changes
    window.addEventListener('focus', checkSession);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', checkSession);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'userSession') {
      checkSession();
    }
  };

  const checkSession = () => {
    setIsLoading(true);
    try {
      // sessionStorage get item
      const session = sessionStorage.getItem('userSession');
      // localStorage get item
      const menuStorage = localStorage.getItem('menuStorage');
      const menuFuncStorage = localStorage.getItem('menuFuncStorage');
      const infoStorage = localStorage.getItem('infoStorage');

      if (!session) {
        clearSession();
        return;
      }

      const parsedSession = JSON.parse(session) as auth_role_profile[];
      const parsedMenuStorage = menuStorage ? JSON.parse(menuStorage) as auth_role_menu[] : null;
      const parsedMenuFuncStorage = menuFuncStorage ? JSON.parse(menuFuncStorage) as auth_role_menu_func[] : null;
      const parsedInfoStorage = infoStorage ? JSON.parse(infoStorage) as auth_app_info[] : null;

      // Validate session data
      if (Array.isArray(parsedSession) && parsedSession.length > 0) {
        setUserData(parsedSession);
        setIsAuthenticated(true);
      } else {
        clearSession();
      }
      if (parsedMenuStorage) {
        setMenuData(parsedMenuStorage);
      }
      if (parsedMenuFuncStorage) {
        setMenuFuncData(parsedMenuFuncStorage);
      }
      if (parsedInfoStorage) {
        setInfoData(parsedInfoStorage);
      }
    } catch (e) {
      console.error('Session validation failed:', e);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  const setSession = (authData: AuthModel) => {
    if (authData?.data?.auth_role_profile) {
      const profileData = authData.data.auth_role_profile;
      sessionStorage.setItem('userSession', JSON.stringify(profileData));
      setUserData(profileData);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid authentication data');
    }
    if (authData?.data?.auth_role_menu) {
      const roleMenu = authData.data.auth_role_menu;
      localStorage.setItem('menuStorage', JSON.stringify(roleMenu));
      setMenuData(roleMenu);
    } else {
      throw new Error('Invalid authentication data');
    }
    if (authData?.data?.auth_role_menu_func) {
      const roleMenuFunc = authData.data.auth_role_menu_func;
      localStorage.setItem('menuFuncStorage', JSON.stringify(roleMenuFunc));
      setMenuFuncData(roleMenuFunc);
    } else {
      throw new Error('Invalid authentication data');
    }
    if (authData?.data?.auth_app_info) {
      const roleInfoData = authData.data.auth_app_info;
      localStorage.setItem('infoStorage', JSON.stringify(roleInfoData));
      setInfoData(roleInfoData);
    } else {
      throw new Error('Invalid authentication data');
    }
  };

  const clearSession = () => {
    sessionStorage.removeItem('userSession');
    setUserData(null);
    setIsAuthenticated(false);
    setError("");
  };

  const login = async (user: string, password: string) => {
    setIsLoadingScreen(true)
    setIsLoading(true);
    setError("");

    const configLogin = import.meta.env.VITE_APP_TRR_API_CONFIG_LOGIN;
    const jsonString = "{" + configLogin + "}";
    const initialValues: logintType = Function("return " + jsonString)();

    try {
      initialValues.employee_username = user;
      initialValues.password = password;
      initialValues.client_ip = await fetchIpAddress();

      const response = await login_auth_emp_get(initialValues);
      const { data } = response;

      if (data?.status === 'Success' && data?.data?.auth_role_profile) {
        setIsLoadingScreen(false)
        setSession(data);
      } else {
        setIsLoadingScreen(false)
        setError(data?.error_message || 'Login failed');
      }
    } catch (error) {
      setIsLoadingScreen(false)
      setError("Login failed. Please try again.");
      clearSession();
      throw error;
    } finally {
      setIsLoadingScreen(false)
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        error,
        login,
        logout,
        userData,
        menuData,
        menuFuncData,
        infoData,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


