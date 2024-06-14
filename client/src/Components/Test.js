import React, { useState, useEffect } from 'react';

export const Test = () => {
  const [navbarTop, setNavbarTop] = useState('4.4rem');
  const [height, setHeight] = useState('full');

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setNavbarTop(scrollTop > 100 ? '0' : '4.4rem');
    setHeight(scrollTop > 100 ? '2/3' : 'full');
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="hidden md:block lg:block"> {/* Show only on md and lg screens */}
      <div className="w-[77px] h-full">
        <div className="fixed top-0 left-0" style={{ top: navbarTop, transition: 'top 0.3s ease-in-out' }}>
          <div className="w-[77px] bg-yellow-400" style={{ height: height, display: 'block' }}>
            <h1 className="text-red font-extrabold">
              <nav className="flex flex-col h-screen space-between space-y-3">
                <a className="flex items-center justify-center hover:bg-blue-700 hover:text-white p-2 m-1 p-1" href="/"><img src="/assets/Home.svg" alt="home" /></a>
                <a href="/trends" className="flex items-center justify-center hover:bg-blue-700 hover:text-white p-2 m-1 p-1"><img src="/assets/vector.png" alt="message4" /></a>
                <a href="/notifications" className="flex items-center justify-center hover:bg-blue-700 hover:text-white p-2 m-1 p-1"><img src="/assets/Notification.svg" alt="notification" /></a>
                <a href="/message" className="flex items-center justify-center hover:bg-blue-700 hover:text-white p-2 m-1 p-1"><img src="/assets/Message.svg" alt="message1" /></a>
                <a href="/fav" className="flex items-center justify-center hover:bg-blue-700 hover:text-white p-2 m-1 p-1"><img src="/assets/Bookmark.svg" alt="message2" /></a>
                <a href="/more" className="flex items-center justify-center hover:bg-blue-700 hover:text-white p-2 m-1 p-1"><img src="/assets/More.svg" alt="message3" /></a>
              </nav>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
