import React, { useEffect, useRef, useState } from 'react';
import { packagingTypes } from '../mockData';
import { toast } from 'sonner';
import { supabase } from '../supabaseClient';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    packagingType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            company: formData.company,
            email: formData.email,
            packaging_type: formData.packagingType,
            message: formData.message,
            submitted_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Call Edge Function to send email
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          company: formData.company,
          email: formData.email,
          packagingType: formData.packagingType,
          message: formData.message
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Still show success even if email fails (data is saved)
      }

      toast.success('Thank you! We will respond within 24 hours.');
      setFormData({
        name: '',
        company: '',
        email: '',
        packagingType: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to send enquiry. Please try again or email us directly at aurecopackaging@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="contact-container">
        <div className={`contact-header ${isVisible ? 'visible' : ''}`}>
          <h2 className="contact-title">Let's Build Something Beautiful.</h2>
        </div>

        <form onSubmit={handleSubmit} className={`contact-form ${isVisible ? 'visible' : ''}`}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="company">Brand / Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="Your brand or company"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="packagingType">Type of Packaging Needed</label>
            <select
              id="packagingType"
              name="packagingType"
              value={formData.packagingType}
              onChange={handleChange}
              required
            >
              <option value="">Select packaging type</option>
              {packagingTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Tell us about your project..."
            />
          </div>

          <button type="submit" className="form-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Enquiry'}
          </button>
        </form>

        <div className={`contact-info ${isVisible ? 'visible' : ''}`}>
          <p>We typically respond within 24 hours.</p>
          <a href="mailto:aurecopackaging@gmail.com">aurecopackaging@gmail.com</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
