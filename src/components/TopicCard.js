import * as React from 'react';
import { Card, CardContent, CardMedia, ListItemText } from '@mui/material';
import imagePlaceholder from '../assets/emptyImage.jpeg';
import PropTypes from 'prop-types';

export default function TopicCard({title, price, image}) {
    return (
        <Card sx={{height : 256, width : 198, background : 'transparent'}}>
            <CardContent>
                <CardMedia
                    component="img"
                    alt={title}
                    src={image ? image : imagePlaceholder}
                    sx={{borderRadius : '16px', height : 155, marginBottom : 2}}
                />
                <ListItemText 
                    primary = {title} 
                    secondary = {"SGD " + price} 
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
                            color : 'black',
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

