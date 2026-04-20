import React, { useEffect, useRef, useState } from 'react';
import { products } from '../mockData';
import { Tag, ShoppingBag, Sparkles, FileText, Leaf, ShoppingCart, Package, Mail, Box, Gift, Heart } from 'lucide-react';
import ProductGalleryModal from './ProductGalleryModal';

const iconMap = {
  Tag: Tag,
  ShoppingTag: Tag,
  ShoppingBag: ShoppingBag,
  Sparkles: Sparkles,
  FileText: FileText,
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
  const [cardTransforms, setCardTransforms] = useState({});
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const carouselRef = useRef(null);

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

    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateCardTransforms = () => {
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;
      const newTransforms = {};

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        
        // Calculate distance from carousel center
        const distanceFromCenter = Math.abs(cardCenter - carouselCenter);
        const maxDistance = carouselRect.width / 2;
        
        // Normalize distance (0 = center, 1 = edge)
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
        
        // Calculate transforms based on position
        const translateY = normalizedDistance * 40; // Move down when away from center
        const scale = 1 - (normalizedDistance * 0.1); // Slightly smaller when away
        const opacity = 1 - (normalizedDistance * 0.3); // Fade when away
        
        // Check if card is in view
        const isInView = cardRect.right > carouselRect.left && cardRect.left < carouselRect.right;
        
        newTransforms[index] = {
          translateY: isInView ? translateY : 60,
          scale: isInView ? scale : 0.9,
          opacity: isInView ? opacity : 0.4
        };
      });

      setCardTransforms(newTransforms);
    };

    // Initial calculation
    updateCardTransforms();

    // Update on scroll
    carousel.addEventListener('scroll', updateCardTransforms);
    window.addEventListener('resize', updateCardTransforms);

    return () => {
      carousel.removeEventListener('scroll', updateCardTransforms);
      window.removeEventListener('resize', updateCardTransforms);
    };
  }, [isVisible]);

  return (
    <section id="products" className="products-section" ref={sectionRef}>
      <div className="products-header">
        <h2 className={`products-title ${isVisible ? 'visible' : ''}`}>What We Make</h2>
      </div>
      
      <div className="products-carousel" ref={carouselRef}>
        <div className="products-track">
          {products.map((product, index) => {
            const IconComponent = iconMap[product.icon] || Tag;
            const transform = cardTransforms[index] || { translateY: 60, scale: 0.9, opacity: 0 };
            
            return (
              <div
                key={product.id}
                ref={(el) => (cardsRef.current[index] = el)}
                data-card-id={product.id}
                className="product-card"
                style={{
                  transform: `translateY(${transform.translateY}px) scale(${transform.scale})`,
                  opacity: transform.opacity,
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease'
                }}
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
