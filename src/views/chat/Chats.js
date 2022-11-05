import { useEffect, useState, useContext, useCallback} from "react"
import { useAuthContext } from '../../hooks/useAuthContext'
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase/firebase-config"
import { useNavigate } from "react-router-dom"

import ContactCard from "../../components/ContactCard";
import ChatSection from "../../components/ChatSection";

import { Box, Button, CircularProgress, Divider, Grid, IconButton, InputAdornment, List, ListSubheader, Typography, useMediaQuery, Tabs, Tab } from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
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

const CustomTab = withStyles({
  root: {
    textTransform: "none"
  }
})(Tab);

export default function Chats() {
  const styles = useStyles();
  const history = useNavigate();
  
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isPending, setIsPending] = useState(false)
  const[innerPending, setInnerPending] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [tabValue, setTabValue] = useState(0)

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
      setTimeout(() => { 
        setInnerPending(false);
      }, 100 );
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  function handleOnBack() {
    dispatch({ type: "RESET" });
    history(-1);
  }

  // useEffect(() => {
  //   setTabValue(0);
  // },[data.user])

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
      <Grid container columns = {14} id = 'chatScreenGridContainer' sx = {{height : '100vh'}}>
        <Grid item xs = {14} md = {4} id = 'contactsContainer'>
          <List
              subheader={
                <Box>
                <ListSubheader sx = {{display : 'flex', justifyContent : 'space-between', flexGrow : 1,fontWeight : 600, fontSize : '1.3em', color : "black", backgroundColor: 'transparent', paddingTop: '0px'}}>
                  Recent Chats
                  <IconButton onClick={() => setShowSearchBar(!showSearchBar)}>
                    <SearchIcon color={'secondary'}/>
                  </IconButton>
                </ListSubheader>
                <Tabs id='tabs-container' value={tabValue} onChange={handleTabChange} classes = {{"indicator": {background: "none"}} } aria-label="chatTabs" variant="fullWidth" sx = {{"& button[aria-selected='true']": {borderBottom : "5px solid", borderBottomColor : 'secondary.main', color : "secondary.main"}, width : '100%'}}>
                    <CustomTab label="Direct" {...a11yProps(0)}/>
                    <CustomTab label="Group"  {...a11yProps(1)}/>
                </Tabs>
                
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
            {tabValue === 0 ? Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).filter((chat) => !chat[1].isGroupChat).map((chat) => (
                <ContactCard chat = {chat} user = {chat[1].userInfo} key ={chat[0]} handleClick={handleSelectUser} handleClickGroup={handleSelectGroup}/>
              )) : 
              Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).filter((chat) => chat[1].isGroupChat).map((chat) => (
                <ContactCard chat = {chat} user = {chat[1].userInfo} key ={chat[0]} handleClick={handleSelectUser} handleClickGroup={handleSelectGroup}/>
              ))
            }
            
            </Box>
          </List>
        </Grid>
        <Divider orientation="vertical" sx ={{marginRight : '-2px', height: '100%'}}/>
        <>
        {data.chatId != "null" ?
          !innerPending ?
          <Grid container item md = {8.2} xs = {14} id = 'messagesContainer' direction='column' sx = {{height : '100%', overflowX: 'hidden'}} wrap={"nowrap"}>
            <ChatSection innerPending = {innerPending} group={data.group} otherUser={data.user} handleOnBack={handleOnBack} messages={messages}/>
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
      </Grid> : <Box sx = {{height : '100vh', display : 'flex', flexGrow : 1, justifyContent : 'center', alignItems : 'center'}}>
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