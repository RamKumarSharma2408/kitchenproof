export interface DemoCategory {
  id: string;
  categoryKey: string;
  name: string;
  weightPercent: number;
  scoreObtained: number;
  maxScore: number;
  verificationStatus: string;
  observations: string;
}

export interface DemoInspection {
  id: string;
  inspectionType: string;
  status: string;
  scheduledDate: string;
  completedDate: string;
  totalScore: number;
  maxPossibleScore: number;
  confidenceScore: number;
  hygieneRating: number;
  criticalViolationsCount: number;
  nonCriticalViolationsCount: number;
  findingsSummary: string;
  certificateNumber: string;
  inspector: { name: string; email?: string };
  categories: DemoCategory[];
}

export interface DemoDocument {
  id: string;
  docType: string;
  title: string;
  fileName: string;
  fileUrl: string;
  verificationStatus: string;
  issueDate: string;
  expiryDate?: string;
  notes?: string;
  auditorComments?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface DemoRestaurant {
  id: string;
  name: string;
  slug: string;
  legalName: string;
  fssaiNumber: string;
  fssaiType: string;
  fssaiValidUntil: string;
  cuisine: string;
  streetAddress: string;
  locality: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  foodRating: number;
  totalReviews: number;
  safetyScore: number;
  dataConfidenceScore: number;
  verificationStatus: "VERIFIED" | "PENDING_REVIEW" | "ACTION_REQUIRED" | "UNVERIFIED" | "EXPIRED";
  lastInspectedAt: string | null;
  coverImageUrl: string;
  isDemoData: boolean;
  kitchenProfile: {
    kitchenType: string;
    squareFootage: number;
    foodHandlersCount: number;
    fostacSupervisorName: string | null;
    fostacCertNumber: string | null;
    waterSource: string;
    pestControlAgency: string | null;
    lastPestControlDate: string | null;
    oilDisposalMethod: string | null;
  };
  inspections: DemoInspection[];
  documents: DemoDocument[];
  consumerReports: any[];
}

export const DEMO_RESTAURANTS: DemoRestaurant[] = [
  {
    id: "rest-1",
    name: "Spice Pavilion Fine Dining",
    slug: "spice-pavilion-connaught-place",
    legalName: "Spice Pavilion Hospitality Pvt Ltd",
    fssaiNumber: "13324001000845",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2027-08-15T00:00:00.000Z",
    cuisine: "North Indian, Mughlai, Awadhi",
    streetAddress: "M-42, Outer Circle, Connaught Place",
    locality: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110001",
    phone: "+91 11 4152 7890",
    email: "contact@spicepavilion.in",
    foodRating: 4.6,
    totalReviews: 1240,
    safetyScore: 94,
    dataConfidenceScore: 98,
    verificationStatus: "VERIFIED",
    lastInspectedAt: "2026-10-18T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "DINE_IN",
      squareFootage: 1850,
      foodHandlersCount: 16,
      fostacSupervisorName: "Vikramaditya Roy",
      fostacCertNumber: "FOSTAC/DEL/2025/8842",
      waterSource: "COMMERCIAL_RO",
      pestControlAgency: "Rentokil PCI Pest Solutions",
      lastPestControlDate: "2026-10-05T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [
      {
        id: "insp-1",
        inspectionType: "SCHEDULED_COMPREHENSIVE",
        status: "COMPLETED",
        scheduledDate: "2026-10-17T00:00:00.000Z",
        completedDate: "2026-10-18T00:00:00.000Z",
        totalScore: 94,
        maxPossibleScore: 100,
        confidenceScore: 98,
        hygieneRating: 5,
        criticalViolationsCount: 0,
        nonCriticalViolationsCount: 1,
        findingsSummary: "Exemplary adherence to FSSAI Schedule 4 sanitary norms. Potable water test to IS 10500 standards confirmed negative for coliforms. Staff medical certificates current.",
        certificateNumber: "KP-AUD-2026-10-0081",
        inspector: { name: "Dr. Anil K. Sharma" },
        categories: [
          {
            id: "cat-1",
            categoryKey: "HYGIENE_SANITATION",
            name: "Personal Hygiene & Facility Sanitation",
            weightPercent: 25,
            scoreObtained: 96,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Foot-operated wash basins, automated soap dispensers, clean uniforms, and hair nets in full compliance.",
          },
          {
            id: "cat-2",
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling & Raw Material Segregation",
            weightPercent: 25,
            scoreObtained: 94,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Color-coded cutting boards (green veg, red raw meat, yellow poultry). FIFO stock rotation actively labeled.",
          },
          {
            id: "cat-3",
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Control & Infestation Prevention",
            weightPercent: 15,
            scoreObtained: 95,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Monthly commercial contract with Rentokil PCI. Electronic insect killers operational away from food prep.",
          },
          {
            id: "cat-4",
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Cold Chain & Thermal Holding Integrity",
            weightPercent: 15,
            scoreObtained: 92,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Walk-in chillers logged at 3.2°C; hot-holding tables maintained above 68°C continuously.",
          },
          {
            id: "cat-5",
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Statutory Documentation & Potable Water",
            weightPercent: 20,
            scoreObtained: 93,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "NABL-accredited water laboratory testing report dated Sept 2026. FoSTaC Supervisor certificate verified.",
          },
        ],
      },
    ],
    documents: [
      {
        id: "doc-1",
        docType: "WATER_TEST_REPORT",
        title: "IS 10500 Potable Water Bacteriological Test",
        fileName: "water_test_oct2026_nabl.pdf",
        fileUrl: "/docs/water_test_sample.pdf",
        verificationStatus: "VERIFIED",
        issueDate: "2026-09-15T00:00:00.000Z",
        expiryDate: "2027-03-15T00:00:00.000Z",
        notes: "NABL Accredited Lab Ref: ND-WT-4412",
        auditorComments: "Parameters compliant with BIS standards for food preparation.",
        verifiedAt: "2026-10-18T00:00:00.000Z",
        createdAt: "2026-10-10T00:00:00.000Z",
      },
      {
        id: "doc-2",
        docType: "PEST_CONTROL_CONTRACT",
        title: "Commercial Pest Management Service Record",
        fileName: "rentokil_oct_service.pdf",
        fileUrl: "/docs/pest_control_sample.pdf",
        verificationStatus: "VERIFIED",
        issueDate: "2026-10-05T00:00:00.000Z",
        expiryDate: "2026-11-05T00:00:00.000Z",
        notes: "Monthly rodent and insect treatment log",
        auditorComments: "Service log signed by certified applicator.",
        verifiedAt: "2026-10-18T00:00:00.000Z",
        createdAt: "2026-10-10T00:00:00.000Z",
      },
    ],
    consumerReports: [],
  },
  {
    id: "rest-2",
    name: "Dosa Heritage Kitchen",
    slug: "dosa-heritage-indiranagar",
    legalName: "South Legacy Foods LLP",
    fssaiNumber: "11223334000412",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2027-04-30T00:00:00.000Z",
    cuisine: "South Indian, Karnataka, Kerala",
    streetAddress: "742, 12th Main Road, HAL 2nd Stage, Indiranagar",
    locality: "Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560038",
    phone: "+91 80 2521 9900",
    email: "support@dosaheritage.com",
    foodRating: 4.8,
    totalReviews: 2450,
    safetyScore: 88,
    dataConfidenceScore: 92,
    verificationStatus: "VERIFIED",
    lastInspectedAt: "2026-09-24T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "DINE_IN",
      squareFootage: 1400,
      foodHandlersCount: 12,
      fostacSupervisorName: "Praveen Kumar S",
      fostacCertNumber: "FOSTAC/BLR/2025/1190",
      waterSource: "MUNICIPAL_TESTED",
      pestControlAgency: "Pestbusters India Pvt Ltd",
      lastPestControlDate: "2026-09-12T00:00:00.000Z",
      oilDisposalMethod: "BIO_DIESEL_COLLECTOR",
    },
    inspections: [],
    documents: [],
    consumerReports: [],
  },
  {
    id: "rest-3",
    name: "Biryani Cloud Box",
    slug: "biryani-cloud-box-koramangala",
    legalName: "Cloud Epicure Private Limited",
    fssaiNumber: "11224002000991",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2026-12-31T00:00:00.000Z",
    cuisine: "Hyderabadi Biryani, Kebabs, Rolls",
    streetAddress: "Plot 44, 4th Cross, 5th Block, Koramangala",
    locality: "Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560095",
    phone: "+91 80 4120 4455",
    email: "kitchen@biryanicloudbox.in",
    foodRating: 4.4,
    totalReviews: 890,
    safetyScore: 76,
    dataConfidenceScore: 78,
    verificationStatus: "PENDING_REVIEW",
    lastInspectedAt: "2026-06-14T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "CLOUD_KITCHEN",
      squareFootage: 950,
      foodHandlersCount: 8,
      fostacSupervisorName: "Imran Pasha",
      fostacCertNumber: "FOSTAC/BLR/2024/7321",
      waterSource: "COMMERCIAL_RO",
      pestControlAgency: "Terminix SIS India",
      lastPestControlDate: "2026-05-30T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [],
    documents: [],
    consumerReports: [],
  },
  {
    id: "rest-4",
    name: "Tandoor & Curry Co.",
    slug: "tandoor-curry-co-bandra",
    legalName: "Bandra Coastal Gourmet LLP",
    fssaiNumber: "11523005001287",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2027-11-20T00:00:00.000Z",
    cuisine: "North Indian, Seafood, Mughlai",
    streetAddress: "32, Hill Road, Opposite St. Peter's Church, Bandra West",
    locality: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400050",
    phone: "+91 22 2640 1122",
    email: "manager@tandoorcurry.co",
    foodRating: 4.5,
    totalReviews: 1820,
    safetyScore: 82,
    dataConfidenceScore: 88,
    verificationStatus: "VERIFIED",
    lastInspectedAt: "2026-08-10T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "DINE_IN",
      squareFootage: 1600,
      foodHandlersCount: 14,
      fostacSupervisorName: "Sameer Deshmukh",
      fostacCertNumber: "FOSTAC/MUM/2025/3309",
      waterSource: "MUNICIPAL_TESTED",
      pestControlAgency: "Godrej Pest Control",
      lastPestControlDate: "2026-07-28T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [],
    documents: [],
    consumerReports: [],
  },
  {
    id: "rest-5",
    name: "Chai & Samosa Junction",
    slug: "chai-samosa-junction-cyber-city",
    legalName: "Quick Bite Retail Ventures",
    fssaiNumber: "10824003000554",
    fssaiType: "REGISTRATION",
    fssaiValidUntil: "2026-11-30T00:00:00.000Z",
    cuisine: "Street Food, Chai, Snacks",
    streetAddress: "Kiosk 12, Food Court, DLF Cyber City",
    locality: "DLF Cyber City",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122002",
    phone: "+91 124 405 9988",
    email: "hello@chaisamosajunction.com",
    foodRating: 4.2,
    totalReviews: 620,
    safetyScore: 64,
    dataConfidenceScore: 70,
    verificationStatus: "ACTION_REQUIRED",
    lastInspectedAt: "2026-07-02T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "QUICK_SERVICE",
      squareFootage: 450,
      foodHandlersCount: 4,
      fostacSupervisorName: "Ramesh Chand",
      fostacCertNumber: "FOSTAC/GGN/2024/9912",
      waterSource: "COMMERCIAL_RO",
      pestControlAgency: "Local Pest Control",
      lastPestControlDate: "2026-06-20T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [],
    documents: [],
    consumerReports: [],
  },
  {
    id: "rest-6",
    name: "Green Leaf Pure Veg",
    slug: "green-leaf-pure-veg-jubilee-hills",
    legalName: "Satvik Culinary Creations",
    fssaiNumber: "13623001000778",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2028-02-28T00:00:00.000Z",
    cuisine: "Pure Vegetarian, Gujarati, Thali",
    streetAddress: "Road No. 36, CBI Colony, Jubilee Hills",
    locality: "Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    postalCode: "500033",
    phone: "+91 40 2355 7788",
    email: "namaste@greenleafveg.in",
    foodRating: 4.7,
    totalReviews: 3100,
    safetyScore: 91,
    dataConfidenceScore: 95,
    verificationStatus: "VERIFIED",
    lastInspectedAt: "2026-10-10T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "DINE_IN",
      squareFootage: 2100,
      foodHandlersCount: 18,
      fostacSupervisorName: "Venkat Rao K",
      fostacCertNumber: "FOSTAC/HYD/2025/4410",
      waterSource: "COMMERCIAL_RO",
      pestControlAgency: "Rentokil PCI",
      lastPestControlDate: "2026-09-30T00:00:00.000Z",
      oilDisposalMethod: "BIO_DIESEL_COLLECTOR",
    },
    inspections: [],
    documents: [],
    consumerReports: [],
  },
  {
    id: "rest-7",
    name: "Old Delhi Zaika Express",
    slug: "old-delhi-zaika-express-chandni-chowk",
    legalName: "Zaika Heritage Foods",
    fssaiNumber: "13324004000192",
    fssaiType: "REGISTRATION",
    fssaiValidUntil: "2027-01-15T00:00:00.000Z",
    cuisine: "Mughlai, Kebabs, Parathas",
    streetAddress: "Shop 14, Gali Paranthe Wali, Chandni Chowk",
    locality: "Chandni Chowk",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110006",
    phone: "+91 11 2326 5544",
    email: "info@olddelhizaika.com",
    foodRating: 4.3,
    totalReviews: 1540,
    safetyScore: 0,
    dataConfidenceScore: 25,
    verificationStatus: "UNVERIFIED",
    lastInspectedAt: null,
    coverImageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "QUICK_SERVICE",
      squareFootage: 520,
      foodHandlersCount: 6,
      fostacSupervisorName: null,
      fostacCertNumber: null,
      waterSource: "MUNICIPAL_TESTED",
      pestControlAgency: null,
      lastPestControlDate: null,
      oilDisposalMethod: null,
    },
    inspections: [],
    documents: [],
    consumerReports: [],
  },
  {
    id: "rest-8",
    name: "Royal Awadh Cloud Kitchen",
    slug: "royal-awadh-cloud-kitchen-pune",
    legalName: "Nawab Flavours Kitchens Pvt Ltd",
    fssaiNumber: "11524007000881",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2026-10-01T00:00:00.000Z",
    cuisine: "Biryani, Rolls, North Indian",
    streetAddress: "Industrial Estate, Unit 4, Kothrud",
    locality: "Kothrud",
    city: "Pune",
    state: "Maharashtra",
    postalCode: "411038",
    phone: "+91 20 2544 3322",
    email: "ops@royalawadhcloud.com",
    foodRating: 3.9,
    totalReviews: 480,
    safetyScore: 48,
    dataConfidenceScore: 85,
    verificationStatus: "EXPIRED",
    lastInspectedAt: "2026-05-18T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "CLOUD_KITCHEN",
      squareFootage: 800,
      foodHandlersCount: 7,
      fostacSupervisorName: "Farhan Ansari",
      fostacCertNumber: "FOSTAC/PUN/2023/1102",
      waterSource: "BOREWELL_PURIFIED",
      pestControlAgency: "City Pest Control",
      lastPestControlDate: "2026-04-12T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [],
    documents: [],
    consumerReports: [],
  },
];

export const DEMO_USERS = {
  admin: {
    userId: "user-admin-1",
    name: "Rajeshwar Sengupta",
    email: "admin@kitchenproof.in",
    role: "ADMIN" as const,
    city: "New Delhi",
  },
  inspector: {
    userId: "user-insp-1",
    name: "Dr. Anil K. Sharma",
    email: "dr.anil.inspector@example.com",
    role: "INSPECTOR" as const,
    city: "New Delhi",
  },
  owner: {
    userId: "user-owner-1",
    name: "Priya Sundaram",
    email: "priya.owner@example.com",
    role: "RESTAURANT_OWNER" as const,
    city: "Bengaluru",
  },
  consumer: {
    userId: "user-cons-1",
    name: "Rahul Verma",
    email: "rahul.consumer@example.com",
    role: "CONSUMER" as const,
    city: "Bengaluru",
  },
};

export const DEMO_METRICS = {
  totalRestaurants: 8,
  verifiedRestaurants: 4,
  pendingRequests: 3,
  reportedConcerns: 2,
  totalUsers: 48,
  totalInspections: 12,
  expiredLicenses: 1,
};

