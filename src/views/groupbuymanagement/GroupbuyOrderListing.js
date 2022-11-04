import * as React from 'react';
import Navbar from '../../components/Navbar'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from 'react-router-dom';
import OrderListingsByGroupbuy from '../../components/groupbuymanagement/OrderListingsByGroupbuy'


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const ButtonInTabs = ({ className, onClick, children }) => {
    return <Button className={className} onClick={onClick} children={children} />;
  };
const useStyles = makeStyles(theme => ({
    addButton: {
        color: "#white",
        marginLeft: "auto",
        background: "#5EC992",
        border: "2px solid #5EC992",
        marginRight: "10%",
      }
  }));
export default function GroupbuyOrderListing() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const navigate = useNavigate();

    const onLinkClick = (e) => {
        //navigate('/createGroupbuy/');
    };
    return (
        <>
            <Navbar />
            order in groupbuy management
            <Box sx={{ width: '100%', paddingLeft: '10px', marginTop: '25px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '25px' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor='secondary' TabIndicatorProps={{ style: { background: 'purple' } }}>
                        <Tab label="Pending" />
                        <Tab label="Approved" />
                        <ButtonInTabs
                            onClick={() => onLinkClick()}
                            className={classes.addButton}
                        >
                            <AddIcon color="inherit" />
                            Update Status
                        </ButtonInTabs>
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <OrderListingsByGroupbuy status = "PENDING_APPROVAL"/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <OrderListingsByGroupbuy status = "APPROVED"/>
                </TabPanel>
            </Box>
        </>
    )
}