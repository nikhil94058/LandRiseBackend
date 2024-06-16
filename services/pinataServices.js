const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const pinFileToIPFS = async (filePath, fileName) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath), { filename: fileName });

  try {
    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    return response.data.IpfsHash;
  } catch (error) {
    throw new Error('Failed to pin file to IPFS');
  }
};

module.exports = {
  pinFileToIPFS,
};
