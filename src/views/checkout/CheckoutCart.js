import React from 'react'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { FormControlLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Paper, Typography, Box, Collapse, IconButton, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CustomButton from '../../components/CustomButton';

function CheckoutCart() {
  return (
    <div className='checkout-cart'>
      <div className='payment-info'>
        <h4 style={{ paddingBottom: '20px' }}>Checkout Cart</h4>
        <TableContainer sx={{ width: '480px' }} component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Group Buy</TableCell>
                <TableCell>Price ($) </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.name} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <CustomButton variant='contained' color="secondary"
        type="submit"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
      >
        Pay Now
      </CustomButton>
    </div >

  )
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.price}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell align="center">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell align="center">{historyRow.customerId}</TableCell>
                      <TableCell align="center">{historyRow.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData('ASOS Group Buy', '$128')
];

function createData(name, price) {
  return {
    name,
    price,
    history: [
      {
        date: 'Vero Moda wrap front knitted mini dress in black',
        customerId: '1',
        amount: '$75',
      },
      {
        date: 'ASOS DESIGN Petite slouchy mom short in washed stone',
        customerId: '1',
        amount: '$53',
      },
    ],
  };
}

export default CheckoutCart