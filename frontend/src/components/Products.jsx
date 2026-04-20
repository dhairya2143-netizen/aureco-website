import React, { useEffect, useRef, useState } from 'react';
import { products } from '../mockData';
import { Tag, ShoppingBag, Leaf, ShoppingCart, Package, Mail, Box, Gift, Heart } from 'lucide-react';
import ProductGalleryModal from './ProductGalleryModal';

const iconMap = {
  Tag: Tag,
  ShoppingTag: Tag,
  ShoppingBag: ShoppingBag,
  Leaf: Leaf,
  Store: ShoppingCart,
  ShoppingCart: ShoppingCart,
  Package: Package,
  Mail: Mail,
  Box: Box,
  Gift: Gift,
  Heart: Heart
};

const Products = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const currentSection = sectionRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const currentCards = [...cardsRef.current];
    const carousel = document.querySelector('.products-carousel');
    
    // Immediately show first 2 cards
    setVisibleCards([products[0]?.id.toString(), products[1]?.id.toString()].filter(Boolean));

    // Create intersection observer for horizontal scroll
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.getAttribute('data-card-id');
            if (cardId) {
              setVisibleCards((prev) => [...new Set([...prev, cardId])]);
            }
          }
        });
      },
      {
        root: carousel,
        threshold: 0.3,
        rootMargin: '0px 50px 0px 0px'
      }
    );

    // Observe all card elements
    currentCards.forEach((card) => {
      if (card) cardObserver.observe(card);
    });

    // Also observe on scroll
    const handleScroll = () => {
      currentCards.forEach((card, index) => {
        if (card) {
          const rect = card.getBoundingClientRect();
          const isInView = rect.left < window.innerWidth && rect.right > 0;
          if (isInView) {
            setVisibleCards((prev) => [...new Set([...prev, products[index]?.id.toString()])]);
          }
        }
      });
    };

    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
    }

    return () => {
      currentCards.forEach((card) => {
        if (card) cardObserver.unobserve(card);
      });
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isVisible, products]);

  return (
    <section id="products" className="products-section" ref={sectionRef}>
      <div className="products-header">
        <h2 className={`products-title ${isVisible ? 'visible' : ''}`}>What We Make</h2>
      </div>
      
      <div className="products-carousel">
        <div className="products-track">
          {products.map((product, index) => {
            const IconComponent = iconMap[product.icon] || Tag;
            const isCardVisible = visibleCards.includes(product.id.toString());
            return (
              <div
                key={product.id}
                ref={(el) => (cardsRef.current[index] = el)}
                data-card-id={product.id}
                className={`product-card ${isCardVisible ? 'card-visible' : ''}`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-image" style={{ backgroundImage: `url(${product.image})` }}>
                  <div className="product-overlay" />
                </div>
                <div className="product-content">
                  <div className="product-icon">
                    <IconComponent size={28} />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedProduct && (
        <ProductGalleryModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default Products;
