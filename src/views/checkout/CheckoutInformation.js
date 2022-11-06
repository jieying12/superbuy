import React from 'react'
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { FormControlLabel } from '@mui/material';
import CustomButton from '../../components/CustomButton';

function CheckoutInformation() {
  return (
    <div className='checkout-info'>
      <div className='payment-info'>
        <h4 style={{ paddingBottom: '20px' }}>Payment Method</h4>
        <h5>Select a card: </h5>
        <RadioGroup>

          <FormControlLabel value="card1" control={<Radio color='secondary' />} label="VISA : xxxx-xxxx-xxxx-8492" />
          <FormControlLabel value="card2" control={<Radio color='secondary' />} label="MC : xxxx-xxxx-xxxx-7942" />
        </RadioGroup>
        <p style={{ paddingBottom: '20px', paddingTop: '20px' }}> OR </p>
        <h5 style={{ paddingBottom: '20px' }}>Add new Card</h5>
        <form noValidate autoComplete="off">
          <Grid container spacing={2} width={800}>
            <Grid item xs={12}>
              <TextField label="Card Number" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Expiry Date (MM/YY)" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="CVV" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Name on Card" variant="outlined" fullWidth />
            </Grid>
          </Grid>
        </form>
        <CustomButton variant='contained' color="secondary"
          type="submit"
          sx={{ mt: 3, mb: 0 }}
        >
          Add Card
        </CustomButton>
      </div>
      <div className='shipping-info'>
        <h4 style={{ paddingBottom: '20px', paddingTop: '40px' }}>Shipping Details</h4>
        <form noValidate autoComplete="off">
          <Grid container spacing={2} width={800}>
            <Grid item xs={12}>
              <TextField label="Address" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Unit Number" variant="outlined" fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Postal Code" variant="outlined" fullWidth />
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  )
}

export default CheckoutInformation