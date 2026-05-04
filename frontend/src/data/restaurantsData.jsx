// src/data/restaurantsData.js

export const restaurantsData = [
  {
    id: 1,
    name: "Tony's Street Tacos",
    cuisine: "Mexican",
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
    category: "Mexican Street Food",
    menu: {
      categories: ["All Items", "Tacos", "Bowls", "Sides", "Drinks"],
      items: [
        {
          id: 101,
          name: "Fish Tacos",
          category: "Tacos",
          description:
            "Grilled fish with cabbage slaw, pico de gallo, and chipotle sauce",
          price: 12.99,
          image:
            "https://images.unsplash.com/photo-1565299585323-38174c4a6c72?q=80&w=500&auto=format&fit=crop",
        },
        {
          id: 102,
          name: "Carnitas Bowl",
          category: "Bowls",
          description:
            "Slow-cooked pork with cilantro rice, black beans, salsa, and guacamole",
          price: 14.99,
          image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop",
        },
        {
          id: 103,
          name: "Street Corn",
          category: "Sides",
          description:
            "Mexican street corn with mayo, cotija cheese, chili powder, and lime",
          price: 5.99,
          image:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop",
        },
        {
          id: 104,
          name: "Horchata",
          category: "Drinks",
          description: "Traditional Mexican rice drink with cinnamon",
          price: 3.99,
          image:
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=500&auto=format&fit=crop",
        },
      ],
    },
    deals: [
      {
        id: 1,
        title: "20% OFF on orders above $20",
        code: "TACO20",
        description: "Get 20% discount when your total order value is above $20.",
        expiry: "Valid till Sunday",
        minOrder: "$20",
      },
      {
        id: 2,
        title: "Free drink with any bowl",
        code: "DRINKFREE",
        description: "Order any bowl and get a refreshing drink absolutely free.",
        expiry: "Limited time offer",
        minOrder: "$14.99",
      },
    ],
    reviews: {
      average: 4.8,
      total: 124,
      items: [
        {
          id: 1,
          name: "Sarah Ahmed",
          rating: 5,
          date: "2 days ago",
          comment:
            "Amazing tacos! The fish was so fresh and the sauce was perfect. Will definitely order again.",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        {
          id: 2,
          name: "Ali Khan",
          rating: 4,
          date: "1 week ago",
          comment:
            "Good food and fast delivery. Carnitas bowl was delicious and fresh.",
          avatar: "",
        },
      ],
    },
  },

  {
    id: 2,
    name: "Mama's Burger",
    cuisine: "American",
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
    category: "Burgers",
    menu: {
      categories: ["All Items", "Burgers", "Fries", "Drinks"],
      items: [
        {
          id: 201,
          name: "Cheese Burger",
          category: "Burgers",
          description: "Grilled beef patty with cheese, lettuce and special sauce",
          price: 10.99,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
        },
        {
          id: 202,
          name: "Loaded Fries",
          category: "Fries",
          description: "Crispy fries topped with cheese and spicy mayo",
          price: 6.99,
          image:
            "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=500&auto=format&fit=crop",
        },
      ],
    },
    deals: [
      {
        id: 1,
        title: "Free Fries with Burger",
        code: "FRIESFREE",
        description: "Get free fries with any premium burger order.",
        expiry: "Today only",
        minOrder: "$10",
      },
    ],
    reviews: {
      average: 4.6,
      total: 89,
      items: [
        {
          id: 1,
          name: "Hina",
          rating: 5,
          date: "3 days ago",
          comment: "Best burger in town. Super juicy and delicious.",
          avatar: "",
        },
      ],
    },
  },

  {
    id: 3,
    name: "Spice Garden",
    cuisine: "Pakistani",
    rating: 4.9,
    reviewsCount: 203,
    distance: "0.7 miles",
    deliveryTime: "25-35 min",
    description:
      "Traditional desi flavors with aromatic biryani, curries, and BBQ favorites.",
    phone: "+1 (555) 888-2222",
    address: "78 Spice Street, New York, NY 10003",
    hours: "Mon-Sun: 12:00 PM - 11:00 PM",
    bannerImage:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1470&auto=format&fit=crop",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1470&auto=format&fit=crop",
    category: "Desi Cuisine",
    menu: {
      categories: ["All Items", "Biryani", "BBQ", "Curries", "Drinks"],
      items: [
        {
          id: 301,
          name: "Chicken Biryani",
          category: "Biryani",
          description: "Aromatic basmati rice with spicy chicken and masala",
          price: 11.99,
          image:
            "https://images.unsplash.com/photo-1701579231349-d7459c40919d?q=80&w=500&auto=format&fit=crop",
        },
        {
          id: 302,
          name: "Malai Boti",
          category: "BBQ",
          description: "Creamy grilled chicken cubes with mild spices",
          price: 13.99,
          image:
            "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=500&auto=format&fit=crop",
        },
      ],
    },
    deals: [
      {
        id: 1,
        title: "10% OFF Family Biryani",
        code: "BIRYANI10",
        description: "Save more when ordering family size biryani.",
        expiry: "Weekend special",
        minOrder: "$25",
      },
    ],
    reviews: {
      average: 4.9,
      total: 203,
      items: [
        {
          id: 1,
          name: "Usman",
          rating: 5,
          date: "1 day ago",
          comment: "Excellent biryani taste. Very authentic and fresh.",
          avatar: "",
        },
      ],
    },
  },
];