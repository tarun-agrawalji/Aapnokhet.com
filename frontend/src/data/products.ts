export interface PriceSlab {
  min_qty: number;
  max_qty: number;
  slab_price: number;
}

export interface Variant {
  id: string;
  sku: string;
  pack_size: string;
  unit: string;
  base_price: number;
  moq: number;
  available_stock: number;
  in_stock: boolean;
  slabs: PriceSlab[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  name_hindi?: string;
  slug: string;
  brand: string;
  category_slug: string;
  category_name: string;
  hsn_code: string;
  gst_rate: number;
  origin: string;
  grade: string;
  description: string;
  full_description: string;
  shelf_life_days: number;
  is_perishable: boolean;
  image_url: string;
  gallery: string[];
  specs: ProductSpec[];
  culinary_uses: string[];
  certifications: string[];
  variants: Variant[];
}

export const PRODUCTS: Product[] = [
  {
    id: "prod-01",
    name: "Sharbati Whole Wheat Atta (Chakki Fresh)",
    name_hindi: "शरबती शुद्ध चक्की आटा",
    slug: "sharbati-whole-wheat-atta",
    brand: "AapnoKhet Pure",
    category_slug: "flour",
    category_name: "Wheat & Flours",
    hsn_code: "1101",
    gst_rate: 0.0,
    origin: "Sehore, Madhya Pradesh & Rajasthan Mandi",
    grade: "Grade A+ Golden Grain",
    description: "Stone ground chakki atta from hand-sorted golden Sharbati wheat grains. Rotis puff high and remain soft for over 8 hours in commercial kitchen warmers.",
    full_description: "Our Chakki Fresh Sharbati Atta is procured directly from certified grain farmers across the fertile black soil belts of Sehore and Rajasthan. Milled using slow-speed, natural stone chakki grinders in our central Jaipur facility to avoid frictional heat damage, ensuring the wheat germ, natural endosperm oils, and essential bran fibers remain 100% intact. Ideal for high-output commercial tandoors, hotel banquet catering, and restaurant service counters.",
    shelf_life_days: 90,
    is_perishable: false,
    image_url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&auto=format&fit=crop"
    ],
    specs: [
      { label: "Grain Type", value: "100% MP Golden Sharbati Wheat" },
      { label: "Milling Method", value: "Cold Stone Chakki (Slow-Speed)" },
      { label: "Moisture Content", value: "< 11.2% (Lab Verified)" },
      { label: "Gluten Index", value: "92% Wet Gluten Retention" },
      { label: "Bran Retention", value: "100% Unbleached Natural Bran" },
      { label: "Packaging Type", value: "Food-Grade Multi-Wall Laminated HDPE Bag" },
      { label: "FSSAI License", value: "122269990000845 (Central Category)" },
      { label: "Dispatch Protocol", value: "Milled < 48 Hours Before Commercial Dispatch" }
    ],
    culinary_uses: [
      "Tandoori Rotis, Phulkas & Chapattis",
      "Hotel Buffet & Commercial Warmer Trays (8+ hrs soft retention)",
      "Roomali Roti blends & Poori prep",
      "Cloud kitchen bulk catering lunch boxes"
    ],
    certifications: [
      "100% Pure Chakki Milled",
      "Zero Maida / Starch Filler Added",
      "Heavy Metal & Pesticide Residue Tested",
      "GST Invoiced with Sequential E-Way Bill"
    ],
    variants: [
      {
        id: "var-01",
        sku: "AK-ATTA-SHAR-50KG",
        pack_size: "50 kg Commercial Bag",
        unit: "Bag",
        base_price: 1850,
        moq: 1,
        available_stock: 230,
        in_stock: true,
        slabs: [
          { min_qty: 1, max_qty: 4, slab_price: 1850 },
          { min_qty: 5, max_qty: 19, slab_price: 1780 },
          { min_qty: 20, max_qty: 100, slab_price: 1720 }
        ]
      },
      {
        id: "var-02",
        sku: "AK-ATTA-SHAR-25KG",
        pack_size: "25 kg Bag",
        unit: "Bag",
        base_price: 950,
        moq: 2,
        available_stock: 120,
        in_stock: true,
        slabs: [
          { min_qty: 2, max_qty: 9, slab_price: 950 },
          { min_qty: 10, max_qty: 50, slab_price: 910 }
        ]
      }
    ]
  },
  {
    id: "prod-02",
    name: "1121 Royal Steam Basmati Rice (2-Year Aged)",
    name_hindi: "1121 रॉयल बासमती चावल (२ वर्ष पुराना)",
    slug: "1121-royal-steam-basmati-rice",
    brand: "AapnoKhet Pure",
    category_slug: "rice",
    category_name: "Rice & Grains",
    hsn_code: "1006",
    gst_rate: 5.0,
    origin: "Taraori Mandi, Haryana",
    grade: "Extra Long Grain (8.35mm raw / 22mm cooked)",
    description: "Naturally aged 2-year royal steam basmati with exceptional aroma. Elongates 2.5x without clumping. Ideal for dum biryanis and pulao.",
    full_description: "Sourced directly from the certified paddy mandis of Taraori and Karnal in Haryana. Naturally silo-matured for a minimum of 24 months to reduce moisture and crystallize the starch content. When cooked under commercial dum or steam steamers, each grain separates cleanly with zero breakage and stretches up to 22mm, maximizing plate volume and aroma for fine-dining restaurants.",
    shelf_life_days: 720,
    is_perishable: false,
    image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1200&auto=format&fit=crop"
    ],
    specs: [
      { label: "Paddy Variety", value: "Authentic Pusa 1121 Steam Basmati" },
      { label: "Aging Period", value: "24 Months Natural Warehouse Silo Aging" },
      { label: "Average Grain Length", value: "8.35 mm (Pre-cooking raw)" },
      { label: "Cooked Elongation", value: "2.5x (21mm - 22mm)" },
      { label: "Moisture Content", value: "< 12.0%" },
      { label: "Grain Broken Percentage", value: "< 0.5% (Commercial Grade A)" },
      { label: "FSSAI License", value: "122269990000845" },
      { label: "Packaging Format", value: "Heavy-Duty 25kg Non-Woven Woven Sack" }
    ],
    culinary_uses: [
      "Dum Hyderabadi & Lucknowi Biryanis",
      "Fine-Dining Jeera Rice, Pulao & Ghee Rice",
      "Banquet & Wedding Live Buffet Stations",
      "Authentic North Indian Thali Service"
    ],
    certifications: [
      "100% Genuine 1121 Steam (Zero Hybrid Blends)",
      "Certified 2-Year Natural Aged Moisture Level",
      "High-Yield Plate Volume Multiplier",
      "GST Invoiced with HSN 1006 Breakdown"
    ],
    variants: [
      {
        id: "var-03",
        sku: "AK-RICE-BAS1121-25KG",
        pack_size: "25 kg Sack",
        unit: "Sack",
        base_price: 2450,
        moq: 1,
        available_stock: 200,
        in_stock: true,
        slabs: [
          { min_qty: 1, max_qty: 3, slab_price: 2450 },
          { min_qty: 4, max_qty: 15, slab_price: 2350 },
          { min_qty: 16, max_qty: 100, slab_price: 2250 }
        ]
      }
    ]
  },
  {
    id: "prod-03",
    name: "Fresh Commercial Malai Paneer (Cold Chain)",
    name_hindi: "ताज़ा मलाई पनीर (कोल्ड चेन डिलीवरी)",
    slug: "fresh-commercial-malai-paneer",
    brand: "AapnoKhet Dairy Pure",
    category_slug: "dairy",
    category_name: "Pure Dairy & Ghee",
    hsn_code: "0406",
    gst_rate: 5.0,
    origin: "Jaipur Dairy Farm, Rajasthan",
    grade: "Full Cream Malai (50%+ Milk Fat)",
    description: "Freshly curdled buffalo milk paneer with ultra-soft texture. Delivered in temperature controlled refrigerated vans at 3.5°C before 9 AM.",
    full_description: "Manufactured every morning at 3:00 AM from pure, unadulterated high-fat buffalo milk at our Jaipur dairy facility. Free of artificial vegetable fat, synthetic emulsifiers, or starch curdling agents. Slices cleanly without crumbling in tandoor skewers or curry gravies, holding gravy flavors beautifully without turning rubbery.",
    shelf_life_days: 10,
    is_perishable: true,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1200&auto=format&fit=crop"
    ],
    specs: [
      { label: "Milk Source", value: "100% Pure Buffalo Full Cream Milk" },
      { label: "Milk Fat (DM Basis)", value: "> 50% Natural Butterfat" },
      { label: "Moisture Content", value: "54% Maximum" },
      { label: "Additives / Preservatives", value: "0% (Zero Vegetable Fat / Zero Starch)" },
      { label: "Fleet Storage Temp", value: "Refrigerated Van @ 3.5°C Direct To Dock" },
      { label: "Texture Consistency", value: "Velvety Soft & Non-Crumbling on Skewers" },
      { label: "FSSAI License", value: "122269990000845" }
    ],
    culinary_uses: [
      "Tandoori Paneer Tikka (Holds skewer without falling)",
      "Paneer Butter Masala, Shahi Paneer & Kadhai dishes",
      "Pizza & Sandwich toppings for continental cafés",
      "Catering bulk gravies & buffet chafer dishes"
    ],
    certifications: [
      "Daily Morning Batch Fresh",
      "100% Cold-Chain Monitored Transit",
      "Zero Added Analogue Fat or Palm Oil",
      "FSSAI Certified Commercial Grade"
    ],
    variants: [
      {
        id: "var-04",
        sku: "AK-PANEER-MALAI-5KG",
        pack_size: "5 kg Vacuum Block",
        unit: "Block",
        base_price: 1650,
        moq: 1,
        available_stock: 50,
        in_stock: true,
        slabs: [
          { min_qty: 1, max_qty: 4, slab_price: 1650 },
          { min_qty: 5, max_qty: 20, slab_price: 1580 }
        ]
      }
    ]
  },
  {
    id: "prod-04",
    name: "Unpolished Desi Toor Dal (Arhar Dal)",
    name_hindi: "देसी अनपॉलिश्ड तुअर / अरहर दाल",
    slug: "unpolished-desi-toor-dal",
    brand: "AapnoKhet Pure",
    category_slug: "pulses",
    category_name: "Pulses & Dals",
    hsn_code: "0713",
    gst_rate: 0.0,
    origin: "Gulbarga Mandi, Karnataka",
    grade: "Grade A Unpolished Desi Seed",
    description: "Zero oil, water, or color polishing. High natural protein with authentic rich taste and fast boiling time in commercial pressure steamers.",
    full_description: "Direct procurement from Gulbarga, Karnataka's renowned GI pulse hub. Unlike regular market dals polished with mineral oil, water, and synthetic dyes to give superficial shine, our unpolished Toor Dal retains the outer mineral-rich layer. Cooks uniformly and quickly in commercial kitchen pressure boilers with rich, natural aroma and maximum protein yield.",
    shelf_life_days: 180,
    is_perishable: false,
    image_url: "https://images.unsplash.com/photo-1612869538502-b5baa439abd7?w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1612869538502-b5baa439abd7?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1702041357314-db5826c96f04?w=1200&auto=format&fit=crop"
    ],
    specs: [
      { label: "Variety", value: "Desi Gulbarga Toor Dal (Pigeon Pea)" },
      { label: "Polishing Method", value: "100% Unpolished (Zero Oil, Zero Chemical)" },
      { label: "Protein Content", value: "22.5g per 100g (High Nutritional Density)" },
      { label: "Foreign Matter", value: "< 0.05% Machine Laser Sorted" },
      { label: "Boiling Time", value: "15-18 mins in standard pressure cooker" },
      { label: "FSSAI License", value: "122269990000845" }
    ],
    culinary_uses: [
      "Authentic Dal Tadka & Dal Fry for Dhabas & Restaurants",
      "Sambar & Rasam for South Indian Quick Service Restaurants",
      "Gujarati & Rajasthani sweet-sour dal preparations",
      "Bulk canteen & hostel catering lines"
    ],
    certifications: [
      "100% Zero Chemical Polishing",
      "Laser Sortex Triple Cleaned",
      "Zero Added Color or Mineral Oil",
      "GST Invoiced with 0% Tax Exemption Verified"
    ],
    variants: [
      {
        id: "var-05",
        sku: "AK-DAL-TOOR-30KG",
        pack_size: "30 kg Bag",
        unit: "Bag",
        base_price: 4350,
        moq: 1,
        available_stock: 120,
        in_stock: true,
        slabs: [
          { min_qty: 1, max_qty: 3, slab_price: 4350 },
          { min_qty: 4, max_qty: 10, slab_price: 4200 },
          { min_qty: 11, max_qty: 50, slab_price: 4050 }
        ]
      }
    ]
  },
  {
    id: "prod-05",
    name: "Danedar Pure Cow Ghee (Bilona Method)",
    name_hindi: "दानेदार शुद्ध गाय का देसी घी",
    slug: "danedar-pure-cow-ghee-15kg",
    brand: "AapnoKhet Pure",
    category_slug: "dairy",
    category_name: "Pure Dairy & Ghee",
    hsn_code: "0405",
    gst_rate: 12.0,
    origin: "Tharparkar Indigenous Cattle, Rajasthan",
    grade: "Pure Bilona Danedar Grade A+",
    description: "Prepared from curd using traditional wooden churn bilona process. Granular golden texture with rich earthy aroma and zero synthetic adulteration.",
    full_description: "Handcrafted using the ancestral Vedic bilona method from curdled indigenous cow milk across Rajasthan farms. The butter is clarified over slow wood-fire heat to yield rich, fragrant granular (danedar) golden ghee. Perfect for specialty royal gravies, traditional sweets, dal tadkas, and aromatic restaurant breads.",
    shelf_life_days: 365,
    is_perishable: false,
    image_url: "https://images.unsplash.com/photo-1601232265936-6da280cff563?w=1200&h=1500&auto=format&fit=crop&crop=bottom,left",
    gallery: [
      "https://images.unsplash.com/photo-1601232265936-6da280cff563?w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1702480249957-d28c32b06678?w=1200&auto=format&fit=crop"
    ],
    specs: [
      { label: "Extraction Process", value: "Traditional Makkhan Bilona Churning" },
      { label: "Texture & Consistency", value: "Naturally Granular (Danedar Golden)" },
      { label: "Milk Fat Purity", value: "99.7% Pure Cow Milk Fat" },
      { label: "Free Fatty Acids", value: "< 0.4% (Standard Benchmark)" },
      { label: "Baudouin / RM Value", value: "Compliant with FSSAI Pure Desi Ghee Test" },
      { label: "Packaging Format", value: "15 kg Commercial Sealed Metal Tin" },
      { label: "FSSAI License", value: "122269990000845" }
    ],
    culinary_uses: [
      "Signature Dal Tadka finishing & Naan glazing",
      "Dum Biryani layering & aromatic rich gravies",
      "Mithai & Halwa confectionary kitchen preparation",
      "Authentic Rajasthani Dal Baati Churma"
    ],
    certifications: [
      "100% Pure Desi Cow Ghee (Zero Dalda / Palm Fat)",
      "Lab Certified RM Value & Zero Adulteration",
      "Tamper-Evident Metal Tin Seal",
      "GST Invoiced with 12% Breakdown"
    ],
    variants: [
      {
        id: "var-06",
        sku: "AK-GHEE-COW-15TIN",
        pack_size: "15 kg Sealed Tin",
        unit: "Tin",
        base_price: 9750,
        moq: 1,
        available_stock: 40,
        in_stock: true,
        slabs: [
          { min_qty: 1, max_qty: 2, slab_price: 9750 },
          { min_qty: 3, max_qty: 10, slab_price: 9450 }
        ]
      }
    ]
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getRelatedProducts(currentId: string, limit: number = 3): Product[] {
  return PRODUCTS.filter((p) => p.id !== currentId).slice(0, limit);
}
