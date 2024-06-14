import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Land = () => {
  const location = useLocation();
  const { nft } = location.state || {};
  console.log('Location state:', location.state);

  useEffect(() => {
    // Set the document title based on the property title or a default value
    document.title = nft && nft.ownerName ? `${nft.ownerName}'s Property` : 'Property Details';
  }, [nft]);

  if (!nft) {
    return <p>No property data available</p>;
  }

  const imageUrl = nft.image
    ? `https://gateway.pinata.cloud/ipfs/${nft.image}`
    : 'https://via.placeholder.com/461x382';

  const reviews = [
    {
      reviewer: 'Alice Smith',
      date: '2024-01-01',
      comment: 'Great property with a fantastic view!'
    },
    {
      reviewer: 'Bob Johnson',
      date: '2024-02-15',
      comment: 'Very comfortable and well-maintained.'
    }
  ];

  return (
    <div className="mt-20 px-4">
      <center>
        <div className="text-4xl font-normal font-['Times New Roman'] text-black mb-8">
          {nft.ownerName ? `${nft.ownerName}'s Property` : 'Property Title'}
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:space-x-5 space-y-5 lg:space-y-0">
          <img className="w-full lg:w-1/2 h-auto rounded" src={imageUrl} alt="Property" />
          <div className="w-full lg:w-1/2 bg-lime-200 rounded-2xl p-6 text-black text-2xl font-normal font-['Inter'] flex flex-col space-y-2">
            <div>
              <strong>ESTIMATED COST: </strong>{nft.price ? `Rs. ${nft.price}` : 'Price not available'}
            </div>
            <div>
              <strong>LOCATION: </strong>{nft.address || 'Location not available'}
            </div>
            <div>
              <strong>VERIFIED SCENE: </strong>{nft.verified ? 'This property is verified' : 'Verification Done'}
            </div>
            <div>
              <strong>STATUS: </strong>{nft.listingType === 'rent' ? 'For Rent' : 'For Sale'}
            </div>
          </div>
        </div>
        <div className="mt-8 w-full lg:w-1/3 bg-lime-200 rounded-full py-4 text-black text-2xl font-normal font-['Inter'] text-center cursor-pointer">
          Confirm Deal
        </div>
        <div className="mt-12 w-full bg-gradient-to-b from-lime-200 to-lime-200 p-8 rounded-xl">
          <div className="mb-8 text-slate-900 text-4xl font-extrabold font-['Inter'] leading-tight">
            Reviews About This Property
          </div>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="bg-white p-4 rounded shadow">
                  <div className="font-bold">{review.reviewer}</div>
                  <div className="text-gray-600">{review.date}</div>
                  <div className="mt-2">{review.comment}</div>
                </div>
              ))
            ) : (
              <p>No reviews available</p>
            )}
          </div>
        </div>
        <div className="mt-12 w-full bg-gradient-to-b from-lime-200 to-lime-200 p-8 rounded-xl">
          <div className="mb-8 text-slate-900 text-4xl font-extrabold font-['Inter'] leading-tight">
            Links and Contact Details
          </div>
          <div className="text-black text-xl font-normal font-['Inter'] space-y-4">
            <div>
              <a href={nft.tokenURI || '#'} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
                More Details
              </a>
            </div>
            <div>
              <strong>Contact:</strong> {nft.contact || 'Contact details not available'}
            </div>
          </div>
        </div>
      </center>
    </div>
  );
};

export default Land;
