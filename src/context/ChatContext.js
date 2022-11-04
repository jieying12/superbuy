import {
    createContext,
    useReducer,
  } from "react";
  import { useAuthContext } from '../hooks/useAuthContext'
  
  export const ChatContext = createContext();
  
  export const ChatContextProvider = ({ children }) => {
    const { user } = useAuthContext()
    const INITIAL_STATE = {
      chatId: "null",
      user: {},
    };
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
          return {
            user: action.payload,
            chatId:
            user.uid > action.payload.uid
                ? user.uid + action.payload.uid
                : action.payload.uid + user.uid,
          };
        case "CHANGE_GROUP":
          return {
            user: {},
            chatId: action.payload
          };
        case 'RESET':
          return { 
            user: {},
            chatId: "null"
          }
  
        default:
          return state;
      }
    };
  
    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  
    console.log('current ChatContext state:', state)

    return (
      <ChatContext.Provider value={{ data:state, dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };