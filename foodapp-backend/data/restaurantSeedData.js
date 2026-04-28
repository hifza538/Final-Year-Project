// data/restaurantSeedData.js
export const restaurantSeedData = [
  {
    name: "Tony's Street Tacos",
    cuisine: "Mexican",
    category: "Mexican Street Food",
    rating: 4.8,
    reviewsCount: 124,
    distance: "0.3 miles",
    deliveryTime: "15-25 min",
    description:
      "Authentic Mexican street food made fresh daily with traditional recipes passed down through generations.",
    phone: "+1 (555) 123-4567",
    address: "123 Food Street, New York, NY 10001",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    bannerImage:
      "https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=1470&auto=format&fit=crop",
    image:
      "https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=1470&auto=format&fit=crop",
    menu: {
      categories: ["All Items", "Tacos", "Bowls", "Sides", "Drinks"],
      items: [
        {
          name: "Fish Tacos",
          category: "Tacos",
          description:
            "Grilled fish with cabbage slaw, pico de gallo, and chipotle sauce",
          price: 12.99,
          image:
            "https://images.unsplash.com/photo-1565299585323-38174c4a6c72?q=80&w=500&auto=format&fit=crop",
        },
        {
          name: "Carnitas Bowl",
          category: "Bowls",
          description:
            "Slow-cooked pork with cilantro rice, black beans, salsa, and guacamole",
          price: 14.99,
          image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop",
        },
      ],
    },
    deals: [
      {
        title: "20% OFF on orders above $20",
        code: "TACO20",
        description: "Get 20% discount when your total order value is above $20.",
        expiry: "Valid till Sunday",
        minOrder: "$20",
      },
    ],
  },

  {
    name: "Mama's Burger",
    cuisine: "American",
    category: "Burgers",
    rating: 4.6,
    reviewsCount: 89,
    distance: "0.5 miles",
    deliveryTime: "20-30 min",
    description:
      "Juicy handcrafted burgers, crispy fries, and comfort food classics served hot and fresh.",
    phone: "+1 (555) 999-4567",
    address: "45 Burger Avenue, New York, NY 10002",
    hours: "Mon-Sun: 11:00 AM - 11:30 PM",
    bannerImage:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1470&auto=format&fit=crop",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1470&auto=format&fit=crop",
    menu: {
      categories: ["All Items", "Burgers", "Fries", "Drinks"],
      items: [
        {
          name: "Cheese Burger",
          category: "Burgers",
          description:
            "Grilled beef patty with cheese, lettuce and special sauce",
          price: 10.99,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
        },
      ],
    },
    deals: [],
  },
];

export default restaurantSeedData;