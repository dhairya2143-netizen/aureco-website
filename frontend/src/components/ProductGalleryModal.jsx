import React from 'react';
import { X } from 'lucide-react';

const ProductGalleryModal = ({ product, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="modal-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="modal-info">
          <h3 className="modal-title">{product.name}</h3>
          <p className="modal-description">{product.description}</p>
          <p className="modal-text">
            Our {product.name.toLowerCase()} are crafted with precision and sustainability in mind. 
            Each piece is designed to elevate your brand and create lasting impressions with your customers.
          </p>
          <button className="modal-cta" onClick={() => {
            onClose();
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            Request a Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGalleryModal;
