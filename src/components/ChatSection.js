import React from "react";
import { Avatar, Box, Grid, IconButton, Typography, Divider, Tab } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom"
import ChatBox from "./ChatBox";

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



export default function ChatSection({messages, group, otherUser, handleOnBack, innerPending = false}) {
    const styles = useStyles();
    const history = useNavigate();
    console.log(group)

    React.useEffect(() => {
        console.log("SELECTEDCHAT: " + JSON.stringify(messages));
    },[messages])

    console.log("other user", otherUser);

    return (
        <>
            <Grid item container xs={1.8} id='messagesTopBar' sx={{ justifyContent: 'center', alignItems: 'center'}} direction='row'>
                <Grid item xs={1} className={styles.iconContainer}>
                    <IconButton onClick={handleOnBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={11}>
                    <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx= {{cursor : 'pointer', display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onClick={() => history('/profile/' + otherUser.displayName)}>
                            <Avatar alt={group ? group : otherUser.displayName} />
                            <Typography sx={{ paddingLeft: 1 }} fontWeight={600}>{group ? group : otherUser.displayName}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            {messages.orders?.length > 0 ? <Grid item xs={0.5}> {/*request has been accepted*/}
            </Grid> : /* request has not been accepted*/
                null
            }
            <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
            <ChatBox loading = {innerPending} messages={messages} otherUser={otherUser}/>
        </>
    )
}

