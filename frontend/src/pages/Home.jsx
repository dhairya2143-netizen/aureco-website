import React, { useEffect } from 'react';
import ScrollFilmHero from '../components/ScrollFilmHero';
import About from '../components/About';
import Products from '../components/Products';
import Industries from '../components/Industries';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { initPaperMotion } from '../lib/paperMotion';

const Home = () => {
  // The hero's own logo reveal is the opener now, so there is no splash loader.
  useEffect(() => initPaperMotion(), []);

  return (
    <div className="home-container">
      <Navbar />
      <ScrollFilmHero />
      <About />
      <Products />
      <Industries />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
