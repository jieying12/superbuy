
import * as React from "react";
import { useState, useEffect } from "react"
import { CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, } from "@mui/material";
import { Box } from "@mui/system";
import { styled } from "@mui/styles";
import CustomButton from "../CustomButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { FeedOutlined } from "@mui/icons-material";

const CardContentNoPadding = styled(CardContent)(`
   padding: 0;
   &:last-child {
     padding-bottom: 0;
   }
 `);

export default function GroupbuyManagementCard({show, setShow, selectedRows}) {

    //const [isModalOpen, setIsModalOpen] = useState(false)
    const [groupbuyInfo, setGroupbuyInfo] = useState({})
    const [isAccept, setIsAccept] = useState(false)
    const [price, setPrice] = useState("");
    const [shipping, setShipping] = useState("");
    const [postage, setPostage] = useState("");
    const [fee, setFee] = useState("");
    const [total, setTotal] = useState("");
    // const history = useNavigate();


    useEffect(() => {
        console.log(selectedRows)
        setGroupbuyInfo(selectedRows[0])
    })
    const handleClose = () => {
        setShow(false);
    };

    const declineModalStyle = { backgroundColor: "#FFFAF0", maxWidth: '235px', minHeight: '300px', borderRadius: '16px', flexDirection: 'column', display: 'flex', justifyContent: 'center', paddingBottom: 1, }

    return (
        <>
            <Dialog
                open={show}
                onClose={handleClose}
                aria-labelledby="alert-dialog-request-rejection"
                aria-describedby="alert-dialog-request-rejection"
                onBackdropClick={handleClose}
            >
                <Box sx={{ backgroundColor: isAccept ? 'primary.main' : 'tertiary.light', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
                        <InfoOutlinedIcon fontSize='large' />
                    </Box>
                    <Box>
                        <DialogTitle id="final-rejection" sx={{ paddingLeft: 0, paddingRight: 0 }}>
                            Update Final Amount
                        </DialogTitle>
                        <DialogContent sx={{ padding: 0 }}>
                            <DialogContentText id="alert-dialog-description">
                                Group buy Name: {groupbuyInfo != undefined ?groupbuyInfo["title"] :null}
                            </DialogContentText>
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
                                    value={FeedOutlined}
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
                            </>
                        </DialogContent>
                        <DialogActions sx={{ marginBottom: '16px' }}>
                            <CustomButton variant='contained' onClick={handleClose} sx={{ backgroundColor: '#CFD1D8' }}>Cancel</CustomButton>
                            <CustomButton variant='contained' onClick={handleClose} sx={{ backgroundColor: '#CFD1D8' }}>Update</CustomButton>
                        </DialogActions>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
                </Box>
            </Dialog>
        </>
    )
}