import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { Avatar, Grid, ImageList, ImageListItem, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import ChatMessageStyle from './ChatMessageStyle'
import { Box } from '@mui/system';
import RequestChatCard from './RequestChatCard';
import PaymentChatCard from './PaymentChatCard';

const ChatMessage = withStyles(ChatMessageStyle, { name: 'ChatMsg' })(props => {
  const {
    classes,
    avatar,
    messages,
    text,
    side,
    GridContainerProps,
    GridItemProps,
    AvatarProps,
    getTypographyProps,
    timestamp,
    images,
    isRequest,
    isAcceptance,
    isLast,
  } = props;
  const attachClass = index => {
    if (index === 0) {
      return classes[`${side}First`];
    }
    if (index === text.length - 1) {
      return classes[`${side}Last`];
    }
    return '';
  };

  return (
    <>
    <Grid
      container
      item
      justify={side === 'right' ? 'flex-end' : 'flex-start'}
      {...GridContainerProps}
      spacing = {1}
    >
      {side === 'left' && (
        <Grid item {...GridItemProps}>
          <Avatar
            src={avatar}
            {...AvatarProps}
            className={cx(classes.avatar, AvatarProps.className)}
          />
        </Grid>
      )}
      <Grid item xs={side === 'right' ? 14 : 12} sx ={{}}>
        {/* {images !== null && images.length > 0 &&
          <Box sx ={{display : 'flex', justifyContent : `${side === 'right' ? 'flex-end' : 'flex-start'}`}}>
          <ImageList cols = {images.length > 1 ? 2 : 1} rows = {images.length >= 3 ? 2 : 1} sx={{width: 204, height : `${images.length >= 3 ? 204 : 102}`, overflow : 'hidden'}}>
            {images.map((img,i) => (
              i < 4 && ( i < 3 ? 
              <ImageListItem key={i} style={{width:images.length > 1 ? 100 : 200, height: images.length > 1 ? 100 : 200, overflow : 'hidden'}} >
                <img src={`${img.url}`} loading="lazy" onClick={() => handlePhotoModal(images.map(({ url }) => url), i)} style={{cursor:'pointer'}}/>
              </ImageListItem> : 
              (images.length > 4 ?
              <Box sx={{backgroundImage : `url(${img.url})`, backgroundSize : 100, width: 100, height: 100, boxShadow: 'inset 0 0 0 50vw rgba(251,122,86,0.6)', cursor:'pointer', display : 'flex', justifyContent : 'center', alignItems : 'center'}}
              onClick={() => handlePhotoModal(images.map(({ url }) => url), 3)} style={{cursor:'pointer'}}
              >
                <Typography variant = 'h4' color = 'white'>
                  +{images.length - 4}
                </Typography>
              </Box>
              : <ImageListItem key={i} style={{width:100, height: 100, overflow : 'hidden'}} >
                <img src={`${img.url}`} loading="lazy" onClick={() => handlePhotoModal(images.map(({ url }) => url), i)} style={{cursor:'pointer'}}/>
              </ImageListItem>)
            )))}
          </ImageList>
          </Box>
        } */}
        {text.map((msg, i) => {
          const TypographyProps = getTypographyProps(msg, i, props);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={messages[0].id || i} className={classes[`${side}Row`]}>
              {!isRequest ?
                  !isAcceptance ?
                  <Typography
                    align={'left'}
                    {...TypographyProps}
                    className={cx(
                      classes.msg,
                      classes[side],
                      attachClass(i),
                      TypographyProps.className,
                    )}
                  >
                  {msg}
                    <span style={{display : 'flex', justifyContent : 'flex-end', fontSize : 12}}>{timestamp}</span>
                  </Typography>
                  : 
                  <Box sx ={{display : 'flex', justifyContent : `${side === 'right' ? 'flex-end' : 'flex-start'}`}}>
                  <PaymentChatCard orderId={messages[0].orderId} showButtons = {side === 'left' ? true : false} isLast={isLast}/>
                  </Box>
              : <Box sx ={{display : 'flex', justifyContent : `${side === 'right' ? 'flex-end' : 'flex-start'}`}}>
                <RequestChatCard orderId={messages[0].orderId} showButtons = {side === 'left' ? true : false} isLast={isLast}/>
                </Box>}
            </div>
          );
        })}
      </Grid>
    </Grid>
    </>
  );
});

ChatMessage.propTypes = {
  avatar: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.object),
  text: PropTypes.arrayOf(PropTypes.string),
  side: PropTypes.oneOf(['left', 'right']),
  GridContainerProps: PropTypes.shape({}),
  GridItemProps: PropTypes.shape({}),
  AvatarProps: PropTypes.shape({}),
  getTypographyProps: PropTypes.func,
  timestamp : PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.shape({})),
  isRequest : PropTypes.bool,
  isAcceptance : PropTypes.bool,
  isLast : PropTypes.bool,
};
ChatMessage.defaultProps = {
  avatar: '',
  messages: [],
  text: [],
  side: 'left',
  GridContainerProps: {},
  GridItemProps: {},
  AvatarProps: {},
  getTypographyProps: () => ({}),
  images: {},
  isRequest : false,
  isAcceptance : false,
  isLast : false,
};

export default ChatMessage;