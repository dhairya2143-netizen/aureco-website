import React, { useEffect, useRef, useState } from 'react';
import { products } from '../mockData';
import { Tag, ShoppingBag, Sparkles, FileText, Leaf, ShoppingCart } from 'lucide-react';
import ProductGalleryModal from './ProductGalleryModal';

const iconMap = {
  Tag: Tag,
  ShoppingTag: Tag,
  ShoppingBag: ShoppingBag,
  Sparkles: Sparkles,
  FileText: FileText,
  Leaf: Leaf,
  Store: ShoppingCart
};

const Products = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="products" className="products-section" ref={sectionRef}>
      <div className="products-header">
        <h2 className={`products-title ${isVisible ? 'visible' : ''}`}>What We Make</h2>
      </div>
      
      <div className="products-carousel" ref={scrollContainerRef}>
        <div className="products-track">
          {products.map((product, index) => {
            const IconComponent = iconMap[product.icon] || Tag;
            return (
              <div
                key={product.id}
                className={`product-card ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
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
