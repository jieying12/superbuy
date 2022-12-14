import React from "react"
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from "react"
import { db, doc, getDoc} from "../../firebase/firebase-config"
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom"
import { useDocument } from '../../hooks/useDocument'

const groupBuyColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'createDate', headerName: 'Date', width: 285 },
  { field: 'productName', headerName: 'Product', width: 200 },
  { field: 'productLink', headerName: 'Link', width: 325 },
  { field: 'requestDetails', headerName: 'Description', width: 200 },
  { field: 'quantity', headerName: 'Quantity', width: 100 },
  { field: 'price', headerName: 'Price', width: 75 },
  { field: 'total', headerName: 'Total', width: 75 },
  { field: 'status', headerName: 'Status', width: 150 },
]
export default function GroupbuyOrderListings({status, setSelectedRows}) {
    const { id } = useParams()
    const [ row, setRowTest] = React.useState(() => [
    ]);
    const [errorMsg, setError] = useState(null)

  useEffect(() => {

    let ref = db.collection('orders')
    ref = ref.where("groupBuyId", "==", id)

    const unsubscribe = ref.onSnapshot(snapshot => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id })
      });
      var groupbuyRow = []
      var rowObj = {}
      for (let i = 0; i < results.length; i++) {
        for (let j = 0; j < status.length;j++) {
          if (results[i]["status"] == status[j]) {
            rowObj["orderId"] = results[i]["id"]
            rowObj["id"] = i + 1
            rowObj["buyerId"] = results[i]["buyerId"]
            rowObj["name"] = results[i]["buyerDisplayName"]
            rowObj["status"] = results[i]["status"]
            rowObj["quantity"] = results[i]["quantity"]
            rowObj["price"] = results[i]["price"]
            rowObj["productLink"] = results[i]["productUrl"]
            rowObj["productName"] = results[i]["productName"]
            rowObj["requestDetails"] = results[i]["requestDetails"]
            rowObj["total"] = results[i]["total"]
            rowObj["createDate"] = new Date(results[i]["createdAt"]["seconds"] * 1000)
            groupbuyRow.push(rowObj)
            rowObj = {}
            break
          }
        }
          
      }
      setRowTest(groupbuyRow)
      setError(null)
    }, error => {
      console.log(error)
      setError('groupbuys failed to be fetched')
    })

    return () => unsubscribe()

  }, [])

  const navigate = useNavigate();
  const handleRowClick = (params) => {
    console.log(`Selected buyerId: "${params.row.buyerId}"`);
  };

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={row}
          columns={groupBuyColumns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          textColor='secondary'
          components={{ Toolbar: GridToolbar}} 
          sx={{
            boxShadow: 2,
            border: 2,
            '& .MuiDataGrid-cell:hover': {
              color: 'secondary.main',
            },
          }}
          onRowClick={handleRowClick}
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = row.filter((row) =>
              selectedIDs.has(row.id),
            );
            setSelectedRows(selectedRows);
          }}
        />
      </div>
    </>
  )
}
