export const subscriptionPlans = [
  {
    name: "Supporter",
    priceId: "price_1Rc9G1PthsRl3XNksFERHQkW",
    price: 900, // in cents
    description: "For individual developers and hobbyists.",
    features: [
      "Access to all core features",
      "Community support",
      "Special badge in the community",
      "Name on the supporters list",
    ],
    buttonVariant: "outline" as const,
    popular: false,
    limits: {
      projects: 1,
    },
  },
  {
    name: "Professional",
    priceId: "price_1Rc9G1PthsRl3XNkjdbbCOle",
    price: 2900,
    description: "For professional developers and small teams.",
    features: [
      "All Supporter features",
      "Priority support",
      "Early access to new features",
    ],
    buttonVariant: "default" as const,
    popular: true,
    limits: {
      projects: 5,
    },
  },
  {
    name: "Partner",
    priceId: "price_1Rc9G1PthsRl3XNkMxgFOUmF",
    price: 9900,
    description: "For businesses and enterprises.",
    features: [
      "All Professional features",
      "Direct communication channel",
      "Logo on our homepage",
      "Custom feature prioritization",
    ],
    buttonVariant: "outline" as const,
    popular: false,
    limits: {
      projects: -1, // -1 means unlimited
    },
  },
];
