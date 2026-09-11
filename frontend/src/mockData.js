// Mock data for Aureco website

export const heroData = {
  eyebrow: "Packaging with Purpose.",
  headline: "Custom Packaging for Fashion Brands",
  subheadline: "Aureco makes custom hang tags, woven labels, mailer bags, paper bags and wrapping paper for clothing brands, fashion designers and jewellery labels across India.",
  image: "/images/hero.webp",
  imageAlt: "Custom Aureco packaging for a clothing brand: hang tags, paper bags and wrapped garments arranged on a table."
};

export const aboutData = {
  headline: "Packaging is the first thing your customer touches.",
  body: "Aureco is a packaging company for fashion and clothing brands. We design and produce every packaging touchpoint a garment passes through, from the woven label sewn inside it to the hang tag, the wrapping paper and the mailer it ships in. Small batch friendly, sustainably sourced, and built to carry your brand story.",
  image: "https://images.unsplash.com/photo-1760022638435-aad7c1e684b6",
  imageAlt: "A folded garment wrapped in branded tissue paper with a printed hang tag attached."
};

export const products = [
  {
    id: 1,
    name: "Custom Hang Tags",
    description: "Printed hang tags for clothing brands, including plantable seed paper.",
    image: "/images/seed-tags.webp",
    alt: "Custom hang tags for a clothing brand, printed on plantable seed paper and tied with cotton string.",
    icon: "Tag"
  },
  {
    id: 2,
    name: "Thank You Cards",
    description: "Branded thank you cards that finish the unboxing moment.",
    image: "/images/thank-you-cards.webp",
    alt: "Branded thank you cards printed on textured card stock for a fashion brand order.",
    icon: "Heart"
  },
  {
    id: 3,
    name: "Wrapping Paper and Stickers",
    description: "Custom printed wrapping paper with matching branded stickers.",
    image: "/images/wrapping-papers.webp",
    alt: "Rolls of custom printed wrapping paper with matching branded stickers for garment packaging.",
    icon: "Gift"
  },
  {
    id: 4,
    name: "Cotton Tote Bags",
    description: "Reusable printed cotton tote bags for retail and events.",
    image: "/images/tote-bag.webp",
    alt: "Reusable printed cotton tote bag with a fashion brand logo.",
    icon: "ShoppingBag"
  },
  {
    id: 5,
    name: "Flap Bags",
    description: "Paper mailer bags with a branded fold-over flap.",
    image: "/images/flap-bags.webp",
    alt: "Paper flap bags with a branded fold-over closure, used as mailer bags by clothing brands.",
    icon: "Package"
  },
  {
    id: 6,
    name: "Drawstring Bags",
    description: "Cotton and jute drawstring bags for jewellery and accessories.",
    image: "/images/drawstring-bags.webp",
    alt: "Cotton drawstring bags with a woven label sewn into the seam, used for jewellery and accessories.",
    icon: "Leaf"
  },
  {
    id: 7,
    name: "Clothing Labels: Cotton, Woven, Satin",
    description: "Woven, satin and printed cotton labels. The name inside every garment.",
    image: "/images/labels-cotton-woven-satin.webp",
    alt: "Woven, satin and cotton clothing labels with a brand name, ready to be sewn into garments.",
    icon: "Tag"
  },
  {
    id: 8,
    name: "Waterproof Kraft Mailers",
    description: "Durable waterproof kraft mailer bags for shipping garments.",
    image: "/images/craft-mailers.webp",
    alt: "Waterproof kraft mailer bags used by a small clothing brand to ship online orders.",
    icon: "Mail"
  },
  {
    id: 9,
    name: "Paper Shopping Bags",
    description: "Custom printed paper bags for retail counters and pop-ups.",
    image: "/images/shopping-bags.webp",
    alt: "Custom printed paper shopping bags with rope handles for a retail clothing store.",
    icon: "ShoppingCart"
  },
  {
    id: 10,
    name: "Eco Boxes",
    description: "Recyclable rigid boxes for gifting and premium orders.",
    image: "/images/ecoboxes.webp",
    alt: "Recyclable eco friendly packaging boxes printed for a conscious fashion brand.",
    icon: "Box"
  }
];

export const industries = [
  {
    id: 1,
    title: "Fashion Designers",
    description: "Elevate your collections with packaging that matches your creative vision.",
    icon: "Scissors"
  },
  {
    id: 2,
    title: "Clothing Brands",
    description: "Build brand recognition from the first touch to the final unboxing.",
    icon: "Shirt"
  },
  {
    id: 3,
    title: "Jewelry Boutiques",
    description: "Premium jute bags and elegant packaging for your precious pieces.",
    icon: "Gem"
  },
  {
    id: 4,
    title: "Boutique Retailers",
    description: "Stand out with custom packaging that reflects your unique retail experience.",
    icon: "Store"
  }
];

// Kept in sync with the catalogue so a renamed product never drifts from the form.
export const packagingTypes = [
  ...products.map((product) => product.name),
  "Single Product Solution",
  "Multiple Products",
  "Custom Packaging Solution"
];

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Products", href: "#products" },
  { name: "Who We Serve", href: "#industries" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" }
];

export const footerData = {
  tagline: "Packaging with Purpose.",
  blurb: "Aureco is a packaging company for fashion and clothing brands in India, making custom hang tags, clothing labels, mailers and paper bags.",
  email: "aurecopackaging@gmail.com",
  phone: "+91 70414 97055",
  instagram: "https://www.instagram.com/aurecopackaging",
  copyright: `© ${new Date().getFullYear()} Aureco. All rights reserved.`
};

// These questions are mirrored one for one in the FAQPage JSON-LD in
// public/index.html. Edit both together or the schema stops matching the page.
export const faqs = [
  {
    id: 1,
    question: "What is Aureco?",
    answer: "Aureco is a packaging company for fashion and clothing brands. We make custom hang tags, woven and satin clothing labels, mailer bags, paper bags, drawstring bags, wrapping paper, stickers and thank you cards. We work with fashion designers, clothing labels, jewellery boutiques and boutique retailers across India."
  },
  {
    id: 2,
    question: "What is the minimum order quantity for custom packaging?",
    answer: "Minimum order quantity depends on the item and the printing method. Woven labels and printed hang tags usually start lower than custom printed bags and boxes, because bags need a tooling and print setup. We work with small batches for new labels. Send us the product and quantity you have in mind and we confirm the exact minimum for that item."
  },
  {
    id: 3,
    question: "What packaging do you make for clothing brands?",
    answer: "We make ten core products: custom hang tags, thank you cards, wrapping paper with matching stickers, cotton tote bags, flap bags, drawstring bags, cotton and woven and satin clothing labels, waterproof kraft mailers, paper shopping bags and eco boxes. Most brands order three or four of these as one matched set rather than buying them separately."
  },
  {
    id: 4,
    question: "Can I get packaging printed with my own logo and artwork?",
    answer: "Yes. Every product we make is custom printed with your logo, artwork, colours and copy. Send print ready artwork if you have it. If you do not, send us your logo and a reference or two and we set the artwork up for the product, then share a proof for approval before anything goes to print."
  },
  {
    id: 5,
    question: "How long does a custom packaging order take?",
    answer: "Lead time runs from artwork approval, not from first enquiry, and varies by product. Printed paper items are the quickest. Woven labels, custom size bags and rigid boxes take longer because they need tooling or a dedicated setup. Tell us your launch date in the first message and we confirm a realistic timeline before you commit."
  },
  {
    id: 6,
    question: "What materials do you use?",
    answer: "We work in kraft and recycled paper, plantable seed paper, textured and uncoated card stock, cotton, jute and canvas for bags, and woven, satin and printed cotton for labels. Finishes include deboss, foil and spot printing. We will recommend a material for the product once we know how it ships and what it needs to protect."
  },
  {
    id: 7,
    question: "Is Aureco packaging eco friendly?",
    answer: "Sustainability is the default, not an upgrade. We source recyclable kraft and paper stock, plantable seed paper for hang tags, and natural cotton and jute for bags, so most of what we make can be recycled, reused or planted. If you need a specific certification or a plastic free supply chain, tell us and we will scope it."
  },
  {
    id: 8,
    question: "How much does custom packaging cost for a small clothing brand?",
    answer: "Price depends on product, material, size, print method and quantity, and per unit cost drops sharply as quantity rises. The cheapest way to get a real number is to tell us the product, the rough quantity and your deadline. We quote against that instead of publishing a rate card that would not match your job."
  },
  {
    id: 9,
    question: "Do you ship packaging across India?",
    answer: "Yes. Aureco is based in India and ships custom packaging to brands across the country. Share your delivery city when you enquire and we include freight and timeline in the quote."
  },
  {
    id: 10,
    question: "How do I get a quote from Aureco?",
    answer: "Use the enquiry form on this page, email aurecopackaging@gmail.com, or message us on WhatsApp at +91 70414 97055. Include the packaging type, rough quantity, and your deadline. We typically respond within 24 hours with a quote or with the two or three questions we need answered first."
  }
];

export const revealItems = [
  { id: 1, image: '/images/reveal/drawstring-detail.webp', w: 900, h: 900,
    name: 'Drawstring bags',
    alt: 'Close up of a cotton drawstring bag with an Aureco woven label sewn into the seam.',
    note: 'Cotton, with a woven label sewn into the seam.' },
  { id: 2, image: '/images/reveal/brand-card.webp', w: 900, h: 900,
    name: 'Business cards',
    alt: 'Debossed business card on textured stock with a raised leaf mark.',
    note: 'Textured stock, deboss, and a raised leaf mark.' },
  { id: 3, image: '/images/reveal/woven-label.webp', w: 537, h: 720,
    name: 'Woven labels',
    alt: 'Woven clothing label with a brand name, the kind sewn inside a garment.',
    note: 'The name inside every garment.' },
  { id: 4, image: '/images/reveal/card-stack.webp', w: 506, h: 900,
    name: 'Seed paper cards',
    alt: 'Stack of printed seed paper cards on plantable stock, tied and ready to ship.',
    note: 'Printed on plantable stock, ready to ship.' },
  { id: 5, image: '/images/reveal/wrapping-rolls.webp', w: 900, h: 491,
    name: 'Wrapping paper and stickers',
    alt: 'Rolls of custom wrapping paper beside matching branded stickers, made as one set.',
    note: 'Made as a matched set, never as separate buys.' },
  { id: 6, image: '/images/reveal/tote-detail.webp', w: 900, h: 491,
    name: 'Tote bags',
    alt: 'Printed cotton tote bags folded, tied and tagged before dispatch.',
    note: 'Folded, tied, and tagged before they reach you.' },
];
