import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import Industries from '../components/Industries';
import Contact from '../components/Contact';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingAnimation from '../components/LoadingAnimation';
import WhatsAppButton from '../components/WhatsAppButton';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="home-container">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Industries />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
