import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FaPlus } from 'react-icons/fa';
import RealEstateABI from '../abis/RealEstate.json';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
const LandregisteryPage = ({ contractAddress }) => {
  const email = Cookies.get('email');
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const role = Cookies.get('role');
  const [rol, setRol] = useState('user');
  const documentTypes = ["adharcard", "passport", "driver's license"];
  const [image, setImage] = useState(null);
  const [documents, setDocuments] = useState(Array(documentTypes.length).fill(null));
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [listingType, setListingType] = useState('sale');

  useEffect(() => {
    const getAddress = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAddress(accounts[0]);
        } catch (error) {
          setMessage('Failed to connect to MetaMask');
        }
      }
    };

    getAddress();
  }, []);

  useEffect(() => {
    // Mock username fetching for demonstration. Replace with actual user fetching logic.
    const fetchUsername = async () => {
      try {
        // Mock fetching username, replace with actual API call
        const fetchedUsername = email; // Use email as username for demonstration
        setUsername(fetchedUsername);
      } catch (error) {
        setMessage('Failed to fetch username');
      }
    };

    fetchUsername();
  }, [email]);


  useEffect(() => {
    // Check if the user is authorized to view the page
    if (role !== 'user') {
      setRol(role);
    }
  }, [role]);

  if (role === 'user') {
    return <p>You are not authorised please signed as Admin</p>
  }

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleDocumentChange = (e, index) => {
    const selectedDocument = e.target.files[0];
    const updatedDocuments = [...documents];
    updatedDocuments[index] = selectedDocument;
    setDocuments(updatedDocuments);
  };

  const uploadFileToIPFS = async (formData) => {
    try {
      const response = await fetch(`${window.location.origin}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file to Pinata');
      }

      const data = await response.json();
      return data.ipfsHash;
    } catch (error) {
      throw new Error(`Error uploading file to Pinata: ${error.message}`);
    }
  };

  const mintNFT = async () => {
    if (!window.ethereum) {
      setMessage('Please install MetaMask!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('ownerName', ownerName);
      formData.append('address', propertyAddress);
      formData.append('price', price);
      formData.append('listingType', listingType);
      if (image) {
        formData.append('image', image);
      }
      documents.forEach((doc, index) => {
        if (doc) {
          formData.append(documentTypes[index], doc);
        }
      });

      const tokenURI = await uploadFileToIPFS(formData);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, RealEstateABI.abi, signer);

      const transaction = await contract.mint(tokenURI);
      await transaction.wait();
      setMessage('NFT Minted Successfully!');
    } catch (error) {
      setMessage('Error minting NFT: ' + error.message);
    }
  };

  return (
    <div className='bg-cover bg-center min-h-screen w-screen flex flex-col items-center justify-center' style={{ backgroundImage: 'url("/assets/landcover.svg")', backgroundSize: 'cover' }}>
      <div className='max-w-lg md:max-w-2xl lg:max-w-4xl px-4'>
        <h1 className="text-4xl text-black font-extrabold mb-8 text-center">Welcome to the Land Registry Page</h1>
        {username && <h2 className="text-2xl text-gray-700 mb-4 text-center">Hello, {username}!</h2>}
        <div className='w-full md:w-[540px] lg:w-[600px] h-[300px] bg-gray-200 flex items-center justify-center rounded-lg relative'>
          {image ? (
            <img src={URL.createObjectURL(image)} alt="Uploaded" className="max-w-full max-h-full" />
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="w-32 h-32 md:w-48 md:h-48 border-2 border-dashed border-gray-400 flex items-center justify-center">
                <FaPlus className="text-4xl md:text-6xl text-gray-600" />
              </div>
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
        <div className='mt-10 flex justify-between w-full'>
          {documentTypes.map((type, index) => (
            <div key={index}>
              <h2>{type}</h2>
              {documents[index] ? (
                <img src={URL.createObjectURL(documents[index])} alt="Uploaded" className="max-w-full max-h-full" />
              ) : (
                <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                  <div className="w-32 h-32 md:w-48 md:h-48 border-2 border-dashed border-gray-400 flex items-center justify-center">
                    <FaPlus className="text-4xl md:text-6xl text-gray-600" />
                  </div>
                  <input id={`file-upload-${index}`} type="file" accept="image/*" className="hidden" onChange={(e) => handleDocumentChange(e, index)} />
                </label>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="propertyAddress">
            Property Address
          </label>
          <input
            id="propertyAddress"
            type="text"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mt-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownerName">
            Owner Name
          </label>
          <input
            id="ownerName"
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mt-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mt-5">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="listingType">
            Listing Type
          </label>
          <select
            id="listingType"
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <button onClick={mintNFT} className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Mint NFT
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LandregisteryPage;
