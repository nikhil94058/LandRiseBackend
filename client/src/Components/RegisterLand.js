// src/components/RegisterLand.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const RegisterLand = ({ registerLand }) => {
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    registerLand(price);
    setPrice('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 3 }}>
      <TextField
        label="Land Price (ETH)"
        variant="outlined"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" type="submit" fullWidth>
        Register Land
      </Button>
    </Box>
  );
};

export default RegisterLand;
