import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
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
    tertiary: {//red
      main: '#fa756b',
      light: '#fcb8b3'
    },
    action: {
      disabledBackground: '#ADD8B2',
      hover: '#ADD8B2',
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
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode >,
  document.getElementById('root')
);
