import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {//light green
      main: '#EDF6EE',
      light: '#FFFFFF',
      veryLight: '#FFFFFF',
    },
    secondary: {//dark green
      main: '#5EC992',
      light: '#ADD8B2',
      veryLight: '#EDF6EE'
    },
    action: {
      disabledBackground: '#ADD8B2',
      hover: '#FFE8BC',
    }
  },
  text: {
    primary: '#515151',
    secondary: '#A0A3B1',
    disabled: '#FFFFFF'
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "Poppins, Roboto, Helvetica, Arial, sans-serif",
    subtitle2: {
      color: '#A0A3B1'
    }
  }

})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode >,
  document.getElementById('root')
);
