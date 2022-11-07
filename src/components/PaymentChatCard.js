import * as React from "react";
import { useEffect, useState, useContext } from "react"
import { db, timestamp } from "../firebase/firebase-config"
import { useNavigate } from "react-router-dom"

import { Card, CardContent, Divider, Grid, Icon, IconButton, List, ListItem, ListItemIcon,ListItemText, Modal, TextField, Typography,} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Flight from '@mui/icons-material/Flight';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import Receipt from '@mui/icons-material/Receipt';
import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline';
import LocalShipping from '@mui/icons-material/LocalShipping';
import { Box } from "@mui/system";
import moment from "moment";
import { styled } from "@mui/styles";
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import DoneIcon from '@mui/icons-material/Done';
import CustomButton from "./CustomButton";

import { ChatContext } from "../context/ChatContext";
import { useAuthContext } from '../hooks/useAuthContext'
import { useDocument } from '../hooks/useDocument'
import { REQUEST_PENDING_APPROVAL, REQUEST_ACCEPTED, REQUEST_REJECTED, ORDER_PAID } from "../constants";

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

export default function PaymentChatCard({orderId, showButtons = false, isLast, handleClickJoin, maxWidth = '330px', minWidth = 'auto'}) {
  const addOnCardStyle = { backgroundColor : "white", maxWidth: maxWidth, width: minWidth, borderRadius : '16px', flexDirection : 'column',marginTop:'8px', marginBottom : '8px'}

    const fields = ['price', 'shipping', 'postage', 'fee', 'total']
    const icons = {
        price : <DriveFileRenameOutline color = 'secondary'/>,
        shipping : <Flight color = 'secondary'/>,
        postage : <LocalShipping color = 'secondary'/>,
        fee : <MonetizationOnOutlinedIcon color = 'secondary'/>,
        total : <Receipt color = 'secondary'/>,
    }

    const labels = {
        price : 'Product Price:',
        shipping : 'Shipping:',
        postage : 'Local Postage:',
        fee : 'Service Fee:',
        total : 'Total:',
    }

    const { document, error } = useDocument('orders', orderId)
    const { document : gb } = useDocument('groupbuys', document ? document.groupBuyId : 'A')
    const { document : buyerChat } = useDocument('userChats', document ? document.groupBuyId : 'A')

    const { user } = useAuthContext()
    const { dispatch } = useContext(ChatContext);
    const[isLoading,setIsLoading] = useState(false)
    const history = useNavigate();

    const messagesEndRef = React.useRef(null);
    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"start" })}

    const handleJoinGroup = async () => {

        const res = await db.collection("chats").doc(document.groupBuyId).get()

        if (!res.exists) {
            const buyerChatRef = db.collection('userChats').doc(user.uid) 
            await buyerChatRef.update({
            [document.groupBuyId + ".groupBuyId"]: document.groupBuyId,
            [document.groupBuyId + ".groupBuyName"]: gb.title,
            [document.groupBuyId + ".isGroupChat"]: true,
            [document.groupBuyId + ".date"]: timestamp.fromDate(new Date()),
            });
        }
        handleClickJoin(1)
        dispatch({ type: "CHANGE_GROUP", payload: {
            groupBuyId: document.groupBuyId,
            groupBuyName: gb.title,
        } });
      };

    const handleOnPayment = async () => {
        dispatch({ type: "RESET" });
        // history(`/checkout/${gb.id}`);
        history(`/checkout`);
    }
    
    return (
        <>
        {document ? <Card sx={addOnCardStyle}>
        <CardContentNoPadding sx={{padding: 1, textAlign : 'left'}} >
        <Box>
            <Grid container sx={{justifyContent : 'center', alignItems : 'center', marginTop : 1, mb: 1}}>
                <Grid item xs={10}>
                    <Typography sx={{paddingLeft: 2}} fontWeight={600} variant='body1'>{document.productName}</Typography>
                </Grid>
                {document.status !== REQUEST_REJECTED && 
                <Grid item xs={2} sx={{display : 'flex', justifyContent: 'flex-end'}}>
                    <PriceCheckIcon color={document.status === ORDER_PAID ? 'secondary' :'disabled'}/>
                </Grid>}
            </Grid>
            <Divider orientation="horizontal"/>
            <List>
            {
                (fields.map((field, index) => (
                    <ListItem key={index} id={index}>
                        <ListItemIcon sx={{minWidth: 0, paddingRight: 2}}>{icons[field]}</ListItemIcon>
                        <ListItemText sx={{display:'flex'}}
                            primary={labels[field]}
                            primaryTypographyProps={{ fontSize: 13, color: 'secondary.main', marginRight: 1 }}
                            secondary={"SGD " + document[field]} 
                            secondaryTypographyProps={{ fontSize: 13, align: "left" }}
                            />
                    </ListItem>
                )))
            
            }   
            </List>
            { showButtons && (document.status === REQUEST_ACCEPTED) && <>
            <Box sx={{display : 'flex', justifyContent: 'center', alignItems : 'center', marginBottom: 1}}>
                <CustomButton onClick={() => handleOnPayment()} sx={{marginRight: 1}} size="small" variant="contained" color = "secondary" >Make Payment</CustomButton>
                {(!buyerChat || !buyerChat.exists) && <CustomButton onClick={() => handleJoinGroup()} size="small" variant="contained" color = "additional">Join Group</CustomButton>}
            </Box>
            </>
            }
        </Box>
        </CardContentNoPadding>
        <div ref={messagesEndRef} id="messagesEndRef-request"/>
        </Card> : null}
        </>
    )
}