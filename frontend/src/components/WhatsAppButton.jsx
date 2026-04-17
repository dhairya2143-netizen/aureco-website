import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '+15551234567'; // Replace with actual WhatsApp number
  const defaultMessage = 'Hi! I would like to inquire about your packaging solutions.';

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <button
        className="whatsapp-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="WhatsApp contact"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="whatsapp-popup">
          <div className="whatsapp-popup-header">
            <MessageCircle size={20} />
            <span>Chat with us</span>
          </div>
          <p className="whatsapp-popup-text">
            Have questions? Send us a message on WhatsApp for quick enquiries.
          </p>
          <button className="whatsapp-popup-button" onClick={handleWhatsAppClick}>
            Start Chat
          </button>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
