import * as React from 'react';
import Navbar from '../../components/Navbar'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from 'react-router-dom';
import OrderListingsByGroupbuy from '../../components/groupbuymanagement/OrderListingsByGroupbuy'
import { REQUEST_PENDING_APPROVAL, REQUEST_ACCEPTED, ORDER_PENDING_PAYMENT, ORDER_PAID, COMPLETED, ORDER_DELIVERED} from "../../constants";
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StatusConfirmationDialog from './StatusConfirmationDialog';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

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
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [value, setValue] = React.useState(0);
    const [status, setStatus] = React.useState([]);
    const [show, setShow] = React.useState(false);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e) => {
        setAnchorEl(null);
        const { myValue } = e.currentTarget.dataset;
        setStatus(myValue)
        setShow(true)
    };
    return (
        <>
            <Navbar />
            <Box sx={{ width: '100%', paddingLeft: '10px', marginTop: '25px' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '25px' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" textColor='secondary' TabIndicatorProps={{ style: { background: 'purple' } }}>
                        <Tab label="Pending" />
                        <Tab label="Approved" />
                        <Button
                            id="demo-customized-button"
                            aria-controls={open ? 'demo-customized-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            variant="contained"
                            disableElevation
                            onClick={handleClick}
                            endIcon={<KeyboardArrowDownIcon />}
                            className={classes.addButton}
                        >
                            Update Status
                        </Button>
                    </Tabs>
                </Box>
                <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose} disableRipple data-my-value={REQUEST_ACCEPTED}>
                        Accepted
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem onClick={handleClose} disableRipple data-my-value={ORDER_PAID}>
                        Paid
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem onClick={handleClose} disableRipple data-my-value={ORDER_DELIVERED}>
                        Delivered
                    </MenuItem>
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem onClick={handleClose} disableRipple data-my-value={COMPLETED}>
                        Completed
                    </MenuItem>
                </StyledMenu>
                <TabPanel value={value} index={0}>
                    <OrderListingsByGroupbuy status={[REQUEST_PENDING_APPROVAL]} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <OrderListingsByGroupbuy status={[REQUEST_ACCEPTED, ORDER_PAID, ORDER_DELIVERED, COMPLETED]} setSelectedRows={setSelectedRows}/>
                </TabPanel>
            </Box>
            <StatusConfirmationDialog show={show} setShow={(bool) => setShow(bool)} status = {status} selectedRows = {selectedRows}/>
        </>
    )
}