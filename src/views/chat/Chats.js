import { useEffect, useState, useContext} from "react"
import { useAuthContext } from '../../hooks/useAuthContext'
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase/firebase-config"
import { useNavigate } from "react-router-dom"

import ContactCard from "../../components/ContactCard";
import ChatSection from "../../components/ChatSection";

import { Box, Button, CircularProgress, Divider, Grid, IconButton, InputAdornment, List, ListSubheader, Typography, useMediaQuery } from "@mui/material";
import { makeStyles} from "@mui/styles";
import { TextField } from "@material-ui/core";
import SearchIcon from '@mui/icons-material/Search';

import InContainerLoading from "../../components/InContainerLoading";

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display : 'flex', 
    justifyContent : 'center'
  },
  root : {
    height : '100%', 
    width : '100%', 
    backgroundColor : 'transparent'
  },
}))

export default function Chats() {
  const styles = useStyles();
  const history = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isPending, setIsPending] = useState(false)
  const[innerPending, setInnerPending] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)

  const { user } = useAuthContext()
  const { dispatch } = useContext(ChatContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    setIsPending(true)
    const getChats = () => {
      const ref = db.collection('userChats').doc(user.uid)  
      const unsub = ref.onSnapshot(doc => {
        setChats(doc.data());
        setIsPending(false)
      });

      return () => {
        unsub();
      };
    };

    user.uid && getChats();
    
  }, [user.uid]);

  useEffect(() => {
    setInnerPending(true)
    const ref = db.collection('chats').doc(data.chatId)
    const unSub = ref.onSnapshot(doc => {
      doc.exists && setMessages(doc.data().messages);
      setInnerPending(false)
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  function handleOnBack() {
    dispatch({ type: "RESET" });
    history(-1);
  }

  const handleSelectUser = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const handleSelectGroup = (gc) => {
    dispatch({ type: "CHANGE_GROUP", payload: gc });
  };

  const handleOnSearchValueChange = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
  }

  return (
    !isPending && user?.uid ? <Box className = {styles.root} id = 'chatScreenRoot'>
      {Object.entries(chats).length > 0 ?
      <Grid container columns = {14} id = 'chatScreenGridContainer' md = {{height : '100%'}}>
        <Grid item md = {4} id = 'contactsContainer'>
          <List
              subheader={
                <Box>
                <ListSubheader sx = {{display : 'flex', justifyContent : 'space-between', flexGrow : 1,fontWeight : 600, fontSize : '1.5em', color : "black", backgroundColor: 'transparent', paddingTop: '0px'}}>
                  Recent Chats
                  <IconButton onClick={() => setShowSearchBar(!showSearchBar)}>
                    <SearchIcon color={'secondary'}/>
                  </IconButton>
                </ListSubheader>
                
                </Box>
              }
            >
            {showSearchBar && <Box sx={{width : '100%', paddingRight : '16px'}}>
            <TextField placeholder="Search..."
              variant="outlined"
              fullWidth
              value = {searchValue}
              onChange = {handleOnSearchValueChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                  >
                    <SearchIcon color={'secondary'}/>
                  </IconButton>
                </InputAdornment>
              }
              size='small'
            />
            </Box>}
            <Box paddingRight={'16px'}>
            {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
                <ContactCard chat = {chat} user = {chat[1].userInfo} key ={chat[0]} handleClick={handleSelectUser} handleClickGroup={handleSelectGroup}/>
              ))}
            </Box>
          </List>
        </Grid>
        <Divider orientation="vertical" sx ={{marginRight : '-2px', height: '100%'}}/>
        <>
        {data.chatId != "null" ?
          !isPending ?
          <Grid container item md = {8.2} xs = {14} id = 'messagesContainer' direction='column' sx = {{height : '100%', overflowX: 'hidden'}} wrap={"nowrap"} style={{backgroundColor: "secondary.light"}}>
            <ChatSection innerPending = {innerPending} otherUser={data.user} handleOnBack={handleOnBack} messages={messages}/>
          </Grid> : <InContainerLoading/>
          :<>
            <Grid container item md = {8} id = 'messagesContainer' direction='column' sx = {{justifyContent : 'center', alignItems : 'center'}}>
              <Button
              variant="contained"
              disabled = {true}
              sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
              >
                Select a chat to start messaging
              </Button>
              </Grid>
            </>
          }
        </>
      </Grid> : <Box sx = {{height : '100%', display : 'flex', flexGrow : 1, justifyContent : 'center', alignItems : 'center'}}>
            <Button
              variant="contained"
              disabled = {true}
              sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
              >
                No messages
            </Button>
          </Box>}
    </Box> : <Box sx={{display : 'flex', flexGrow:1, height: '100%', justifyContent : 'center', alignItems : 'center', flexDirection:'column'}}>
      <CircularProgress color='secondary' sx={{marginBottom:2}}/>
      <Typography>Loading chats...</Typography>
      </Box>
  )
}