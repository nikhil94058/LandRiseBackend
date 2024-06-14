// src/components/LandCard.js
import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const LandCard = ({ land, buyLand }) => {
  if (!land) {
    return <Typography variant="h6" color="error">No property data available</Typography>;
  }

  return (
    <Card style={{ margin: '1rem', padding: '1rem' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Land ID: {land.id}</Typography>
        <Typography variant="body1">Owner: {land.owner}</Typography>
        <Typography variant="body1">Price: {land.price} ETH</Typography>
        {land.forSale && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => buyLand(land.id, land.price)}
            style={{ marginTop: '1rem' }}
          >
            Buy Land
          </Button>
        )}
        <Link to={`/property/${land.id}`} state={{ nft: land }}>
          <Button variant="outlined" color="secondary" style={{ marginTop: '1rem' }}>
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default LandCard;
