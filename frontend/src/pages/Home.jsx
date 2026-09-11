import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Products from '../components/Products';
import WrapReveal from '../components/WrapReveal';
import Industries from '../components/Industries';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingAnimation from '../components/LoadingAnimation';
import WhatsAppButton from '../components/WhatsAppButton';
import { initPaperMotion } from '../lib/paperMotion';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dismiss = () => setLoading(false);
    const cap = setTimeout(dismiss, 600);
    window.addEventListener('load', dismiss);

    return () => {
      clearTimeout(cap);
      window.removeEventListener('load', dismiss);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    return initPaperMotion();
  }, [loading]);

  return (
    <div className="home-container">
      <LoadingAnimation dismissed={!loading} />
      <Navbar />
      <Hero />
      <About />
      <Products />
      <WrapReveal />
      <Industries />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
