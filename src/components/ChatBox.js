import { Box, Button, CircularProgress, Divider, Grid, IconButton, ImageList, ImageListItem, TextField, useMediaQuery } from '@mui/material';
import moment from 'moment';
import * as React from 'react'
import { useEffect, useState, useContext, useRef} from "react"
import { db, timestamp, storage } from "../firebase/firebase-config"
import { useNavigate } from "react-router-dom"

import firebase from "firebase/app"

import ChatMessage from './ChatMessage';
import { DP_URL } from '../constants';
import { useAuthContext } from '../hooks/useAuthContext'
import useComponentVisible from '../hooks/useComponentVisible';
import { ChatContext } from "../context/ChatContext";

import { v4 as uuid } from "uuid";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { makeStyles } from '@mui/styles';
import Picker from 'emoji-picker-react';
import TopicCard from './TopicCard';
// import useComponentVisible from '../../Hooks/useComponentVisible';
// import { openImageModal } from '../../Redux/actions';
// import { ERROR } from '../../Redux/actionTypes';

const useStyles = makeStyles((theme) => ({
    iconContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
}))

export default function ChatBox({ messages, otherUser, loading = true }) {
    const styles = useStyles();
    const history = useNavigate();

    const { user } = useAuthContext()
    const { data } = useContext(ChatContext);

    const [text, setText] = useState("");
    const [img, setImg] = useState(null);
    const[topics, setTopics] = useState([]);
    const[attachments, setAttachments] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [firstScroll, setFirstScroll] = useState(false)
    const messagesEndRef = useRef(null);
    const [pickerRef,isPickerVisible,setIsPickerVisible] = useComponentVisible(false);

    console.log("otherUser");
    console.log(otherUser);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"start" })}

    useEffect(() => {
        var groupBuyIds = messages.filter(msg => msg.isRequest).map(filteredObj => filteredObj.groupBuyId);

        if (groupBuyIds.length > 0) {
            let ref = db.collection('groupbuys')
            ref = ref.where(firebase.firestore.FieldPath.documentId(), "in", groupBuyIds)
        
            const unsubscribe = ref.onSnapshot(snapshot => {
            let results = []
            snapshot.docs.forEach(doc => {
                results.push({ ...doc.data(), id: doc.id })
            });
        
            setTopics(results)
            }, error => {
            console.log(error)
            })
        
            return () => unsubscribe()
        }
      }, [messages])
      
    const handleSend = async () => {
        setIsLoading(true);
        if (img) {
            const uploadTask = storage.ref(`chats/${data.chatId}/images/${img.name}`).put(img)

            uploadTask.on(
                (error) => {
                    //TODO:Handle Error
                },
                () => {
                    storage.ref(`chats/${data.chatId}/images`).getDownloadURL()
                        .then(async downloadURL => {
                            await db.collection('chats').doc(data.chatId).update({
                                messages: firebase.firestore.FieldValue.arrayUnion({
                                    id: uuid(),
                                    text,
                                    senderId: user.uid,
                                    isRequest: false,
                                    isAcceptance: false,
                                    date: timestamp.fromDate(new Date()),
                                    img: downloadURL,
                                })
                            })
                        })
                });
        } else {
            await db.collection('chats').doc(data.chatId).update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    id: uuid(),
                    text,
                    senderId: user.uid,
                    isRequest: false,
                    isAcceptance: false,
                    date: timestamp.fromDate(new Date()),
                }),
            });
        }

        await db.collection('userChats').doc(user.uid).update({
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: timestamp.fromDate(new Date()),
        });

        await db.collection('userChats').doc(data.user.uid).update({
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: timestamp.fromDate(new Date()),
        });

        setText("");
        setImg(null);
        setIsLoading(false);
    };

    function handleSendRejectionMessage() {
        // handleRefresh(selectedChat.chatAlternateId);
        //sendStompMessage(messagePayload);
    }

    React.useEffect(() => {
        if (loading === false && messages) {
            setTimeout(() => {
                console.log("scrolling to bottom init len: ", messages?.length || 0)
                document.getElementById("messagesEndRef").scrollIntoView();

            }, 100);
        }
        setFirstScroll(true);
    }, [loading, messages])

    React.useEffect(() => {
        if (messages.lastMessage && firstScroll) {
            console.log("scrolling to bottom on lastMessage");
            scrollToBottom()

        }
    }, [messages.lastMessage]);

    const handleFormChange = (e) => {
        setText(e.target.value);
    };

    const handleOnKeyDown = async(e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleSend();
        }
    }

    const handleAttachmentChange = (e) => {
        console.log('files:', e.target.files);
        setAttachments(Array.from(e.target.files));
    }

    function handlePhotoModal(images, index) {
        // dispatch(openImageModal(images,index))
    }

    const onEmojiClick = (event, emojiObject) => {
        setText(text + emojiObject.emoji);
    };

    function handleTopicCardClick(senderId) {
        if(user.uid === senderId) {
            history(`/orders/${senderId}`)
        } else {
            history(`/orders/requestDetails/${senderId}`)
        }
    }

    return (
        <>
            <Grid item xs={11} id='messages' sx={{ overflowY: 'scroll', paddingLeft: 1}}>
                <ul>
                    {messages && messages.length > 0 ? messages.map((message, idx) => (
                        <>
                        {message.isRequest &&
                        <Grid
                            key={message.id}
                            item
                            container
                            justifyContent={message.senderId !== otherUser.uid ? 'flex-end' : 'flex-start'}
                        >
                             {topics && topics.map(topic => (
                                message.groupBuyId == topic.id ?
                                <Button onClick = {handleTopicCardClick} disableRipple = {true} sx={{textTransform : "none", textAlign :'left'}}>
                                    <TopicCard image = {topic.urls[0] ? topic.urls[0] : ''} title = {topic.title} price = {topic.fee}/>
                                </Button> : null
                             ))}
                            
                        </Grid>}
                        <li key={idx}>
                            <ChatMessage
                                avatar={message.senderId == otherUser.displayName ? DP_URL : null}
                                side={message.senderId === user.uid ? 'right' : 'left'}
                                messages={[message]}
                                text={[message.text]}
                                images={message?.img ? message.img : null}
                                timestamp={moment(message.date).format("hh:mm")}
                                isRequest = {message.isRequest}
                                isAcceptance = {message.isAcceptance}
                                isLast={messages.length - 1 === idx && !loading}
                                handleSendRejectionMessage={handleSendRejectionMessage}
                            />
                        </li>
                        </>
                    )) : null
                    }
                    <div ref={messagesEndRef} id="messagesEndRef" />
                </ul>


            </Grid>
            <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
            {attachments.length > 0 && <Grid item xs = {1}>
            <Box sx = {{display : 'flex', flexDirection : 'row', overflowX : 'scroll', padding: 2}}>
                {<ImageList cols = {attachments.length}>
                    {attachments.map((img,i) => (
                    <ImageListItem key={i} style={{width:100, height: 100, overflow : 'hidden'}} >
                        <img src={URL.createObjectURL(img)} loading="lazy" onClick={() => handlePhotoModal(attachments.map(img => URL.createObjectURL(img)), i)} style={{cursor:'pointer'}}/>
                    </ImageListItem>
                    ))}
                </ImageList>}
            </Box>
            </Grid>}
            <Grid container item xs={1} spacing={2} sx={{ paddingLeft: 1, paddingRight: 1, justifyContent: 'center', alignItems: 'flex-end' }} direction='row' id='chatInputContainer'>
                <Grid item xs={1} className={styles.iconContainer}>
                    <IconButton onClick={() => setIsPickerVisible(!isPickerVisible)}>
                        <SentimentSatisfiedAltIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={10}>
                    <TextField 
                        variant='standard' fullWidth placeholder="Write a message" 
                        InputProps={{ disableUnderline: true }} value={text} 
                        onChange={handleFormChange}
                        onKeyDown={handleOnKeyDown}
                        multiline
                        maxRows={10}
                        sx={{overflowY: 'scroll'}}
                    />
                </Grid>
                {!isLoading ? <Grid item xs={1} className={styles.iconContainer}>
                    <input
                        accept="image/*"
                        hidden
                        id="attachments-button"
                        type="file"
                        multiple
                        onChange={handleAttachmentChange}
                    />
                    <label htmlFor="attachments-button">
                    <IconButton component='span'>
                        <AttachFileIcon />
                    </IconButton>
                    </label>
                </Grid> : <Grid item xs={1} className={styles.iconContainer} sx={{paddingBottom : 1}}><CircularProgress color="secondary" size = {20}/></Grid>}
            </Grid>
            {<Grid item xs={1}/>}
            <div ref={pickerRef} onKeyDown={handleOnKeyDown}>
                {isPickerVisible && <Picker
                    pickerStyle={{ width: '100%' }}
                    disableAutoFocus
                    native
                    onEmojiClick={onEmojiClick} 
                />}
            </div>
        </>
    )
}