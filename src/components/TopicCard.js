import * as React from 'react';
import { Card, CardContent, CardMedia, ListItemText } from '@mui/material';
import imagePlaceholder from '../assets/emptyImage.jpeg';
import PropTypes from 'prop-types';

export default function TopicCard({side, title, description, image}) {
    return (
        <Card sx={{height : 270, width : 220, background : side === 'left' ? '#ADD8B2' : '#00ac4f', marginLeft : side === 'left' && '30px'}}>
            <CardContent>
                <CardMedia
                    component="img"
                    alt={title}
                    src={image ? image : imagePlaceholder}
                    sx={{borderRadius : '16px', height : 170, marginBottom : 2}}
                />
                <ListItemText 
                    primary = {title} 
                    secondary = {description} 
                    primaryTypographyProps={{ 
                        style: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }
                    }}
                    secondaryTypographyProps={{ 
                        variant: 'subtitle2', 
                        style: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }
                    }}
                />
            </CardContent>
        </Card>
    )
}

TopicCard.propTypes = {
    title : PropTypes.string,
    image : PropTypes.string,
    price : PropTypes.string
};
TopicCard.defaultProps = {
    title : '',
    image : '',
    price : 0,
};

