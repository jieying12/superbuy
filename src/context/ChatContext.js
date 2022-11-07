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
      group: '',
      isGroupChat: false
    };
  
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
          return {
            group: '',
            user: action.payload,
            chatId:
            user.uid > action.payload.uid
                ? user.uid + action.payload.uid
                : action.payload.uid + user.uid,
            isGroupChat: false
          };
        case "CHANGE_GROUP":
          return {
            user: {},
            group: action.payload.groupBuyName,
            chatId: action.payload.groupBuyId,
            isGroupChat: true
          };
        case "RESET":
          return { 
            user: {},
            group: '',
            chatId: "null",
            isGroupChat: false
          };
  
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