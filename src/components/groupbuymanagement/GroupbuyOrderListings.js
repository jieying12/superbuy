import React from "react"
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEffect, useState } from "react"
import { db } from "../../firebase/firebase-config"

import { DataGrid, GridToolbar} from '@mui/x-data-grid';

const groupBuyColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Group Buy Name', width: 200 },
  { field: 'startDate', headerName: 'Start Date', width: 200 },
  { field: 'endDate', headerName: 'End Date', width: 200 },
]
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];
const groupbuyRow = []
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
      var rowObj = {}
      for (let i = 0; i < results.length; i++) {
        rowObj["id"] = i + 1
        rowObj["title"] = results[i]["title"]
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
        />
      </div>
    </>
  )
}
