import React, { useEffect } from 'react';
import { useAuth } from '../core/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, createTheme, CssBaseline, Grid, Paper, TextField, ThemeProvider, Typography } from '@mui/material';
import { _GET_APP } from '../../service/mas';

const defaultTheme = createTheme();
  //const [errorMessage, setErrorMessage] = React.useState("");
const LoginSection: React.FC = () => {
  const { login, isAuthenticated, error } = useAuth();
    const [applicationName, setApplicationName] = React.useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/complaint');
      // navigate('/report');
      // navigate('/departmentsetting');
    }
    //setErrorMessage("")
  }, [isAuthenticated, navigate]);



  let application: any[] = [];
  React.useEffect(() => {
    App_Get()
  }, [])
  const App_Get = async () => {
 
    try {
      let response = await _GET_APP({});
      // console.log(response, "response_App_Get");
 
      if (Array.isArray(response?.data)) {
        application = response.data.filter((item: any) => item.application_code === import.meta.env.VITE_APP_APPLICATION_CODE);
        if (application) {
          setApplicationName(application[0].application_name)
 
        }
      }
    } catch (e) {
      console.log("error App_Get", e);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
      await login(username, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
<ThemeProvider theme={defaultTheme}>
  
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
          backgroundImage: `url(${import.meta.env.VITE_APP_TRR_URL_WALLPAPER})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "end",
          alignItems: "center",         
        }}
      >
        <CssBaseline />
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            width: "100%",
            //height: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            //bgcolor: "transparent",
            borderRadius: 4,
            mx: 30
          }}
        >
          <img
            alt="Logo"
            src={`${import.meta.env.VITE_APP_TRR_URL_LOGO}`}
            style={{ height: 80, marginBottom: 16 }}
          />
          <Typography component="h1" variant="h5">
            {applicationName}
          </Typography>
          {/* <Typography component="h1" variant="h5">
            Sign In
          </Typography> */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="User name"
              name="username"
              autoComplete="username"
              autoFocus
              error={false}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={false}
            />
            <Typography color="error" variant="body2">
              {error}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "#502d1e", '&:hover': { bgcolor: "#660000" } }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Grid>
    </ThemeProvider>
  );
};

export default LoginSection;
