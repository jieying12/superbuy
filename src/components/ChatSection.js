import React from "react";
import { Avatar, Box, Grid, IconButton, Typography, Divider, Tabs, Tab } from "@mui/material";
import { makeStyles, withStyles} from "@mui/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom"
import ChatBox from "./ChatBox";
import { useAuthContext } from '../hooks/useAuthContext'

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



export default function ChatSection({messages, otherUser, handleOnBack, innerLoading = false}) {
    const styles = useStyles();
    const { user } = useAuthContext()

    const[expandTopBar, setExpandTopBar] = React.useState(false);

    React.useEffect(() => {
        console.log("SELECTEDCHAT: " + JSON.stringify(messages));
    },[messages])

    const tabsRef = React.useCallback(node => {
        if (node !== null) {
            setExpandTopBar(true)
        } else {
            setExpandTopBar(false)
        }
    }, []);
      
    const approveDenyRef = React.useCallback(node => {
        if (node !== null) {
            setExpandTopBar(true)
        } else {
            setExpandTopBar(false)
        }
    }, []);

    React.useEffect(() => {
        if(tabsRef) {
            console.log('tabs exist')
        } else if(approveDenyRef) {
            console.log('approve-deny exists')
        }
    },[tabsRef,approveDenyRef])

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    console.log("other user", otherUser);


    const history = useNavigate();


    return (
        <>
            <Grid item container xs={expandTopBar? 1 : 1.8} id='messagesTopBar' sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '10px', marginBottom: '10px'}} direction='row'>
                <Grid item xs={1} className={styles.iconContainer}>
                    <IconButton onClick={handleOnBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={11}>
                    <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx= {{cursor : 'pointer', display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onClick={() => history('/profile/' + otherUser.displayName)}>
                            <Avatar alt={otherUser.displayName} />
                            <Typography sx={{ paddingLeft: 1 }} fontWeight={600}>{otherUser.displayName}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            {messages.orders?.length > 0 ? <Grid item xs={0.5}> {/*request has been accepted*/}
            </Grid> : /* request has not been accepted*/
                null
            }
            <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
            <ChatBox loading = {innerLoading} messages={messages} otherUser={otherUser}/> : 
        </>
    )
}

