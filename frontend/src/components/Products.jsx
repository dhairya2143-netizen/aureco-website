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

    let animationFrameId = null;
    let isScrolling = false;

    const updateCardTransforms = () => {
      const carouselRect = carousel.getBoundingClientRect();
      const carouselCenter = carouselRect.left + carouselRect.width / 2;

      cardsRef.current.forEach((card) => {
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        
        // Calculate distance from carousel center
        const distanceFromCenter = Math.abs(cardCenter - carouselCenter);
        const maxDistance = carouselRect.width / 2 + 200;
        
        // Normalize distance (0 = center, 1 = far)
        const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1);
        
        // Smooth easing function
        const eased = normalizedDistance * normalizedDistance;
        
        // Calculate transforms
        const translateY = eased * 30;
        const scale = 1 - (eased * 0.08);
        const opacity = 1 - (eased * 0.25);
        
        // Check if card is in viewport
        const isInView = cardRect.right > carouselRect.left - 100 && cardRect.left < carouselRect.right + 100;
        
        // Apply transforms directly to DOM for better performance
        if (isInView) {
          card.style.transform = `translateY(${translateY}px) scale(${scale})`;
          card.style.opacity = opacity;
        } else {
          card.style.transform = 'translateY(50px) scale(0.92)';
          card.style.opacity = '0.3';
        }
      });

      isScrolling = false;
    };

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(updateCardTransforms);
      }
    };

    // Initial render
    updateCardTransforms();

    // Smooth scroll handling
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCardTransforms);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      carousel.removeEventListener('scroll', handleScroll);
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
            
            return (
              <div
                key={product.id}
                ref={(el) => (cardsRef.current[index] = el)}
                data-card-id={product.id}
                className="product-card"
                style={{
                  transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease'
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
