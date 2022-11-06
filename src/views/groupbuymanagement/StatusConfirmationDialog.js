import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import { db } from "../../firebase/firebase-config"
import { getDatabase, ref, child, push, update } from "firebase/database";
import { useParams } from "react-router-dom"

const groupBuyColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'createDate', headerName: 'Date', width: 200 },
    { field: 'status', headerName: 'Old Status', width: 200 },
    { field: 'newStatus', headerName: 'New Status', width: 200 },
]


function StatusConfirmationDialog({ show, setShow, status, selectedRows }) {
    const [open, setOpen] = React.useState(false);
    const [newRows, setNewRows] = React.useState(selectedRows);
    const updateStatus = () => {
        console.log("updating")
        let ref = db.collection('orders')
        const postData = {
            status: status
        };
        const updates = {};
        for (let i = 0; i < selectedRows.length; i++) {
            console.log(selectedRows[i]["orderId"])
            updates['/orders/' + selectedRows[i]["orderId"]] = postData
            const userRef = db.collection('orders').doc(selectedRows[i]["orderId"])
            const addedUser = userRef.update(
                {
                    status: status
                });
        }
        console.log(updates)
        //update(ref(db), updates);
        setShow(false);
    };
    const handleClose = () => {
        setShow(false);
    };
    useEffect(() => {
        //console.log(status)
        // console.log(selectedRows)
        // console.log(newRows)
        selectedRows.map((n) => {
            console.log(n)
            n["newStatus"] = status
            return n
        })
        //setNewRows(current => [...current, 'Carl']);
    });

    return (
        <>
            <Dialog
                open={show}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="xl"
                fullWidth={true}
            >
                <DialogTitle id="alert-dialog-title">
                    {"UPDATE STATUS"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={selectedRows}
                                columns={groupBuyColumns}
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                textColor='secondary'
                            />
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={updateStatus} autoFocus>
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
export default StatusConfirmationDialog;