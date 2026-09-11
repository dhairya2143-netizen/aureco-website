import React from 'react';
import { X } from 'lucide-react';

const ProductGalleryModal = ({ product, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Close product details" onClick={onClose}>
          <X size={24} aria-hidden="true" />
        </button>
        <div className="modal-image">
          <img src={product.image} alt={product.alt || product.name} />
        </div>
        <div className="modal-info">
          <h3 className="modal-title" id="modal-title">{product.name}</h3>
          <p className="modal-description">{product.description}</p>
          <p className="modal-text">
            Every piece is custom made for your brand: your artwork, your colours, your sizes,
            on recyclable or natural materials wherever the product allows. Send us the quantity
            and deadline and we will quote it.
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
