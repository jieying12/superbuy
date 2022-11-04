import { Avatar, Badge, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material"
import { Box } from "@mui/system"
import moment from "moment"
import React from "react"

export default function ContactCard({chat,user,handleClick,handleClickGroup}) {
    
    function toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      }

    return(
        <ListItemButton onClick={()=> {chat.isGroup ? handleClickGroup(chat.groupBuyId + "GROUP"): handleClick(user)}}>
            <ListItemAvatar>
                <Avatar alt={user.displayName}/>
            </ListItemAvatar>
            <Box sx = {{display : "flex", flexDirection : "row", justifyContent : "space-between", width : "100%", minWidth : 0}}>
            <ListItemText 
                primary = {chat.isGroup ? chat.groupBuyName : toTitleCase(user.displayName)} 
                secondary = {chat[1].lastMessage ? chat[1].lastMessage.text : ''} 
                primaryTypographyProps={{ 
                    style: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight : 600,
                    }
                }}
                secondaryTypographyProps={{ 
                    variant: 'subtitle2', 
                    style: {
                        color : '#A0A3B1',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }
                }}
            />
            {chat && <Typography variant = 'subtitle2' sx ={{paddingTop : '7px'}}>
                {moment(chat.date).isSame(moment(new Date()).subtract(1,'days'), 'day') 
                ? "Yesterday" 
                : (moment(chat.date).isSame(new Date(), 'day') 
                ? moment(chat.date).format("hh:mm")
                : (moment(chat.date).isSame(new Date(), 'week') 
                    ? moment(chat.date).format("ddd") 
                    : moment(chat.date).format("DD/MM/YY")
                    ))
                }
            </Typography>
            }
            </Box>
            {/* <Badge color="secondary" badgeContent={chat.user1.username !== user.username ? chat.user1UnreadCount : chat.user2UnreadCount} max={99} sx={{marginTop: 3.5, marginRight: 2 }}/>  */}
        </ListItemButton>
    )
}