import * as React from "react";
import { useState, useEffect } from "react"
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Icon, IconButton, List, ListItem, ListItemIcon,ListItemText, Modal, TextField, Typography,} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from '@mui/icons-material/Link';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DriveFileRenameOutline from '@mui/icons-material/DriveFileRenameOutline';
import { Box } from "@mui/system";
import moment from "moment";
import { styled } from "@mui/styles";
import DoneIcon from '@mui/icons-material/Done';
import CustomButton from "./CustomButton";
import ClearIcon from '@mui/icons-material/Clear';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useDocument } from '../hooks/useDocument'
import { db, timestamp } from "../firebase/firebase-config"
import firebase from "firebase/app"
import { v4 as uuid } from "uuid";
import { REQUEST_PENDING_APPROVAL, REQUEST_ACCEPTED, REQUEST_REJECTED } from "../constants";
import { FeedOutlined } from "@mui/icons-material";

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

export default function RequestChatCard({orderId, showButtons = false, isLast, maxWidth = '330px', minWidth = 'auto'}) {
  const addOnCardStyle = { backgroundColor : "white", maxWidth: maxWidth, width: minWidth, borderRadius : '16px', flexDirection : 'column',marginTop:'8px', marginBottom : '8px'}

    const fields = ['productName', 'productUrl', 'requestDetails']
    const icons = {
        productName : <DriveFileRenameOutline color = 'secondary'/>,
        productUrl : <Link color = 'secondary'/>,
        requestDetails : <AddCircleOutlineOutlinedIcon color = 'secondary'/>,
    }

    const { document, error } = useDocument('orders', orderId)
    const { document : gb } = useDocument('groupbuys', document ? document.groupBuyId : 'A')

    const[isModalOpen, setIsModalOpen] = useState(false)
    const[isAccept, setIsAccept] = useState(false)
    const[price, setPrice] = useState("");
    const[shipping, setShipping] = useState("");
    const[postage, setPostage] = useState("");
    const[fee, setFee] = useState("");
    const[total, setTotal] = useState("");
    const[rejectionReason, setRejectionReason] = useState("");
    const[isLoading,setIsLoading] = useState(false)
    // const history = useNavigate();

    const messagesEndRef = React.useRef(null);
    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"start" })}

    const handleChangeRejection = (e) => {
        setRejectionReason(e.target.value);
    }

    const handleChangeAccept = (e) => {
        setPrice(e.target.value);
    }

    const handleAcceptModalOpen = (e) => {
        setIsModalOpen(true)
        setIsAccept(true)
    }

    const handleRejectModalOpen = (e) => {
        setIsModalOpen(true)
        setIsAccept(false)
    }

    const handleOnAccept = async () => {
        setIsLoading(true)
        const orderRef = db.collection('orders').doc(orderId)
        await orderRef.update({
            price,
            shipping,
            postage,
            fee,
            total,
            status: REQUEST_ACCEPTED
        })

        await db.collection('chats').doc(document.chatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                id: uuid(),
                text: 'The host has accepted your request for ' + gb.title + ' group buy.',
                senderId: document.hostId,
                isRequest: false,
                isAcceptance: true,
                orderId: orderId,
                groupBuyId: document.groupBuyId,
                date: timestamp.fromDate(new Date()),
            }),
        });

        const buyerChatRef = db.collection('userChats').doc(document.buyerId)
        await buyerChatRef.update({
          [document.chatId + ".lastMessage"]: {
            text: 'The host has accepted your request for ' + gb.title + ' group buy.',
          },
          [document.chatId + ".date"]: timestamp.fromDate(new Date()),
        });

        const hostChatRef = db.collection('userChats').doc(document.hostId)
        await hostChatRef.update({
          [document.chatId + ".lastMessage"]: {
            text: 'The host has accepted your request for ' + gb.title + ' group buy.',
          },
          [document.chatId + ".date"]: timestamp.fromDate(new Date()),
        });

        setPrice("");
        setIsModalOpen(false);
        setIsLoading(false)
    }

    const handleDecline = async () => {
        setIsLoading(true)
        const orderRef = db.collection('orders').doc(orderId)
        const res = await orderRef.update({
            status: REQUEST_REJECTED,
            remarks: rejectionReason
        })

        await db.collection('chats').doc(document.chatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
                id: uuid(),
                text: 'The host has rejected your request for ' + gb.title + ' group buy: ' + rejectionReason,
                senderId: document.hostId,
                isRequest: false,
                isAcceptance: false,
                orderId: orderId,
                groupBuyId: document.groupBuyId,
                date: timestamp.fromDate(new Date()),
            }),
        });
       
        const buyerChatRef = db.collection('userChats').doc(document.buyerId)
        await buyerChatRef.update({
          [document.chatId + ".lastMessage"]: {
            text: 'The host has rejected your request for ' + gb.title + ' group buy: ' + rejectionReason,
          },
          [document.chatId + ".date"]: timestamp.fromDate(new Date()),
        });

        const hostChatRef = db.collection('userChats').doc(document.hostId)
        await hostChatRef.update({
          [document.chatId + ".lastMessage"]: {
            text: 'The host has rejected your request for ' + gb.title + ' group buy: ' + rejectionReason,
          },
          [document.chatId + ".date"]: timestamp.fromDate(new Date()),
        });

        setRejectionReason("");
        setIsModalOpen(false);
        setIsLoading(false)
    }

    const handleOnKeyDown = async(e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            isAccept ? handleOnAccept() : handleDecline()
        }

    }

    useEffect(() => {
        if(document && isLast) {
            console.log("REQ LAST, SCROLL TO BOTTOM AFTER LOAD")
            scrollToBottom();
        }
    },[document])

    const declineModalStyle = { backgroundColor : "#FFFAF0", maxWidth: '235px', minHeight: '300px', borderRadius : '16px', flexDirection : 'column', display :'flex', justifyContent : 'center',paddingBottom : 1,}

    return (
        <>
        {document ? <Card sx={addOnCardStyle}>
        <CardContentNoPadding sx={{padding: 1, textAlign : 'left'}} >
        <Box>
            <Grid container sx={{justifyContent : 'center', alignItems : 'center', marginTop : 1, mb: 1}}>
                <Grid item xs={10}>
                    <Typography fontWeight={600} variant='body1'>{document.productName}</Typography>
                </Grid>
            </Grid>
            <Divider orientation="horizontal"/>
            <List>
            {
                (fields.map((field, index) => (
                    <ListItem key={index} id={index} component={index === 1 && 'a'} href={index === 1 ? document[field] : undefined}>
                        <ListItemIcon sx={{minWidth: 0, paddingRight: 2}}>{icons[field]}</ListItemIcon>
                        {index === 1 ? 
                            <ListItemText sx={{wordWrap:'break-word'}} primaryTypographyProps={{fontSize:12}}>{document[field]}</ListItemText> 
                        : 
                        <ListItemText sx={{wordWrap:'break-word'}} primaryTypographyProps={{fontSize:12}}>{document[field]}</ListItemText>
                        }
                    </ListItem>
                )))
            
            }   
            </List>
            { showButtons && (document.status === REQUEST_PENDING_APPROVAL) && <>
            <Box sx={{display : 'flex', justifyContent: 'center', alignItems : 'center', marginBottom: 1}}>
                <CustomButton onClick={() => handleAcceptModalOpen()} sx={{marginRight: 1}} size="small" variant="contained" color = "secondary" startIcon={<DoneIcon/>}>Accept</CustomButton>
                <CustomButton onClick={() => handleRejectModalOpen()} size="small" variant="contained" color = "tertiary" startIcon={<ClearIcon/>}>Decline</CustomButton>
            </Box>
            </>
            }
        </Box>
        </CardContentNoPadding>
        <div ref={messagesEndRef} id="messagesEndRef-request"/>
        </Card> : null}
        {document ? <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="alert-dialog-request-rejection"
            aria-describedby="alert-dialog-request-rejection"
            onBackdropClick = {() => setIsModalOpen(false)}
        >
            <Box sx={{backgroundColor : isAccept ? 'primary.main' : 'tertiary.light', display:'flex', flexDirection:'row', maxWidth: '450px'}}>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                  <InfoOutlinedIcon fontSize='large'/>
                </Box>
                <Box>
                  <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                      {isAccept ? 'Input price' : 'Confirm Rejection?'}
                  </DialogTitle>
                  <DialogContent sx={{padding: 0}}>
                  <DialogContentText id="alert-dialog-description">
                  {isAccept ? 'Please provide an upper limit of the overall estimated price (inclusive of shipping)' 
                  : `You are about to reject the request entitled: ${document.productName}. Please provide a reason.`}
                  </DialogContentText>
                  {isAccept ?
                  <>
                    <TextField
                        margin="normal"
                        fullWidth
                        id='price'
                        label="Product Price"
                        name='price'
                        color="secondary"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        type='number'
                    >
                    </TextField>
                    <TextField
                        margin="normal"
                        fullWidth
                        id='shipping'
                        label="Shipping fee"
                        name='shipping'
                        color="secondary"
                        onChange={(e) => setShipping(e.target.value)}
                        value={shipping}
                        type='number'
                    >
                    </TextField>
                    <TextField
                        margin="normal"
                        fullWidth
                        id='postage'
                        label="Postage"
                        name='postage'
                        color="secondary"
                        onChange={(e) => setPostage(e.target.value)}
                        value={postage}
                        type='number'
                    >
                    </TextField>
                    <TextField
                        margin="normal"
                        fullWidth
                        id='fee'
                        label="Service Fee"
                        name='fee'
                        color="secondary"
                        onChange={(e) => setFee(e.target.value)}
                        value={fee}
                        type='number'
                    >
                    </TextField>
                    <TextField
                        margin="normal"
                        fullWidth
                        id='total'
                        label="Total"
                        name='total'
                        color="secondary"
                        onChange={(e) => setTotal(e.target.value)}
                        value={total}
                        type='number'
                    >
                    </TextField>
                    </> :
                  <TextField 
                        variant='standard'
                        InputProps={{ disableUnderline: true }} value={isAccept ? price : rejectionReason} 
                        onChange={isAccept ? handleChangeAccept : handleChangeRejection}
                        onKeyDown={handleOnKeyDown}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{overflowY: 'scroll', backgroundColor : 'white', marginTop: '16px', padding: 1, borderRadius : '4px'}}
                    />}
                  </DialogContent>
                  <DialogActions sx={{marginBottom:'16px'}}>
                      <CustomButton variant='contained' onClick={() => setIsModalOpen(false)} sx={{backgroundColor:'#CFD1D8'}}>Cancel</CustomButton>
                      <CustomButton variant='contained' color={isAccept ? "secondary" : "tertiary"} onClick={isAccept ? handleOnAccept : handleDecline} autoFocus>
                      {isAccept ? 'Accept' : 'Decline'}
                      </CustomButton>
                  </DialogActions>
                </Box>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
            </Box>
        </Dialog> : null}
        </>
    )
}