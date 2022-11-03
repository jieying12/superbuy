import React from "react"
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from "react"
import { db } from "../../firebase/firebase-config"
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

const groupBuyColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Group Buy Name', width: 200 },
  { field: 'startDate', headerName: 'Start Date', width: 200 },
  { field: 'endDate', headerName: 'End Date', width: 200 },
  { field: 'status', headerName: 'Status', width: 200 },
]

export default function GroupbuyOrderListings() {
  const { user } = useAuthContext()
  const [groupbuys, setGroupbuys] = useState(null)
  const [rowTest, setRowTest] = React.useState(() => [
  ]);
  const [error, setError] = useState(null)

  useEffect(() => {

    let ref = db.collection('groupbuys')
    ref = ref.where("createdBy.id", "==", user.uid)

    const unsubscribe = ref.onSnapshot(snapshot => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id })
      });
      console.log(results)
      var groupbuyRow = []
      var rowObj = {}
      for (let i = 0; i < results.length; i++) {
        rowObj["id"] = i + 1
        rowObj["firebaseId"] = results[i]["id"]
        rowObj["title"] = results[i]["title"]
        rowObj["status"] = "Ongoing"
        rowObj["startDate"] = new Date(results[i]["createdAt"]["seconds"] * 1000)
        rowObj["endDate"] = new Date(results[i]["deadline"]["seconds"] * 1000)
        groupbuyRow.push(rowObj)
        rowObj = {}
      }
      console.log(groupbuyRow)
      setRowTest(groupbuyRow)
      setGroupbuys(results)
      setError(null)
    }, error => {
      console.log(error)
      setError('groupbuys failed to be fetched')
    })

    return () => unsubscribe()

  }, [])

  const navigate = useNavigate();
  const handleRowClick = (params) => {
    console.log(`Selected : "${params.row.firebaseId}"`);
    navigate(`/order/${params.row.firebaseId}`);
  };


  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rowTest}
          columns={groupBuyColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          components={{ Toolbar: GridToolbar }} 
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: 'secondary',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
          }}
          onRowClick={handleRowClick}
        />
      </div>
    </>
  )
}
