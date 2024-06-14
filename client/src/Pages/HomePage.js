import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Card from '../Components/Card';
import Footer from '../Components/Footer';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = Cookies.get('email');
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const [homes, setHomes] = useState([]);
  const [forSaleHomes, setForSaleHomes] = useState([]);
  const [forRentHomes, setForRentHomes] = useState([]);
  const [home, setHome] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }

    const loadBlockchainData = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/api/nfts`);
        if (!response.data || !response.data.nfts) {
          throw new Error('Failed to fetch blockchain data');
        }
        const nfts = response.data.nfts;
        setHomes(nfts);
        setForSaleHomes(nfts.filter(nft => nft.listingType === 'sale'));
        setForRentHomes(nfts.filter(nft => nft.listingType === 'rent'));
      } catch (error) {
        setError(error.message);
        setHomes([]);
        setForSaleHomes([]);
        setForRentHomes([]);
      } finally {
        setLoading(false);
      }
    };

    loadBlockchainData();
  }, [navigate, token]);

  const togglePop = (home) => {
    setHome(home);
    setToggle(!toggle);
  };

  const renderCards = (homes) => {
    return homes.map((home) => (
      <Card key={home._id} nft={home} togglePop={togglePop} />
    ));
  };

  const Section = ({ title, homes }) => (
    <section className="my-8">
      <div className="lg:block bg-cover w-2/3 bg-center" style={{ backgroundImage: 'url("/assets/back.svg")' }}>
        <h2 className="text-center m-5 md:text-left text-black text-3xl font-bold font-['Inika'] mb-4">{title}</h2>
      </div>
      <div className="flex w-full overflow-x-auto space-x-4">
        {renderCards(homes)}
      </div>
    </section>
  );

  return (
    <main className="w-full md:ml-[0rem] md:w-auto md:space-y-2 p-4">
      <div className="ml-0 md:ml-[5rem] mt-0">
        <h1 className="text-center md:text-left md:p-4 text-black text-4xl font-bold font-['Wavefont']">
          Welcome {email} to LandSol - Your One Place Destination to BUY/SELL/RENT properties with seamless and safe blockchain based transactions
        </h1>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <>
          <Section title="FOR SALE!!" homes={forSaleHomes} />
          <Section title="FOR RENT!!" homes={forRentHomes} />
        </>
      )}

      <Footer />
    </main>
  );
};

export default HomePage;
