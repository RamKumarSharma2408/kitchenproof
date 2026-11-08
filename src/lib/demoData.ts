export interface DemoPremises {
  id: string;
  premisesCode: string;
  facilityName: string;
  streetAddress: string;
  locality: string;
  city: string;
  facilityType: string;
  totalPreparationArea: number;
  waterSupplyType: string;
  pestControlAgency: string;
  siblingBrands: { name: string; slug: string; cuisine: string }[];
}

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
  correctiveActionsRequired?: string;
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
  fileSize?: number;
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
  dataConfidenceScore: number; // Represents evidence completeness percentage
  verificationStatus: "VERIFIED" | "PENDING_REVIEW" | "ACTION_REQUIRED" | "UNVERIFIED" | "EXPIRED" | "SELF_REPORTED";
  lastInspectedAt: string | null;
  coverImageUrl: string;
  isDemoData: boolean;
  activeAlert?: string;
  premises?: DemoPremises;
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

export const SHARED_PREMISES_BLR: DemoPremises = {
  id: "prm-blr-004",
  premisesCode: "PRM-BLR-004",
  facilityName: "Curry & Roll Central Commissary Hub",
  streetAddress: "Plot 44, 4th Cross, 5th Block",
  locality: "Koramangala",
  city: "Bengaluru",
  facilityType: "CLOUD_KITCHEN_COMMISSARY",
  totalPreparationArea: 2800,
  waterSupplyType: "Commercial RO + UV Multi-Stage Filtration",
  pestControlAgency: "Terminix SIS Commercial Solutions",
  siblingBrands: [
    { name: "Biryani Cloud Box", slug: "biryani-cloud-box-koramangala", cuisine: "Hyderabadi Biryani & Kebabs" },
    { name: "Curry Express Cloud Kitchen", slug: "curry-express-koramangala", cuisine: "North Indian Curries" },
    { name: "The Roll Factory", slug: "the-roll-factory-koramangala", cuisine: "Kolkata Kathi Rolls" },
  ],
};

export const DEMO_RESTAURANTS: DemoRestaurant[] = [
  // 1. Exemplary Verified Dine-In Kitchen
  {
    id: "rest-exemplary-1",
    name: "The Grand Horizon Kitchen",
    slug: "the-grand-horizon-aerocity",
    legalName: "Grand Horizon Hospitality Limited",
    fssaiNumber: "KP-DEMO-133240010099",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2028-05-15T00:00:00.000Z",
    cuisine: "Continental, North Indian, Pan-Asian",
    streetAddress: "Asset Area 4, Hospitality District, Aerocity",
    locality: "Aerocity",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110037",
    phone: "+91 11 4987 6543",
    email: "compliance@grandhorizon.in",
    foodRating: 4.8,
    totalReviews: 2840,
    safetyScore: 92,
    dataConfidenceScore: 98,
    verificationStatus: "VERIFIED",
    lastInspectedAt: "2026-10-22T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "DINE_IN",
      squareFootage: 2600,
      foodHandlersCount: 22,
      fostacSupervisorName: "Chef Rajeshwar Sengupta",
      fostacCertNumber: "FOSTAC/DEL/2025/1199",
      waterSource: "COMMERCIAL_RO",
      pestControlAgency: "Rentokil PCI Pest Solutions",
      lastPestControlDate: "2026-10-12T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [
      {
        id: "insp-gh-1",
        inspectionType: "SCHEDULED_COMPREHENSIVE",
        status: "COMPLETED",
        scheduledDate: "2026-10-20T00:00:00.000Z",
        completedDate: "2026-10-22T00:00:00.000Z",
        totalScore: 92,
        maxPossibleScore: 100,
        confidenceScore: 98,
        hygieneRating: 5,
        criticalViolationsCount: 0,
        nonCriticalViolationsCount: 0,
        findingsSummary: "Exemplary sanitary and documentation standards. NABL water lab tests confirmed potable. Color-coded prep stations and cold-chain logging verified fully compliant.",
        certificateNumber: "KP-AUD-2026-10-0112",
        inspector: { name: "Dr. Anil K. Sharma" },
        categories: [
          {
            id: "cat-gh-1",
            categoryKey: "HYGIENE_SANITATION",
            name: "Hygiene & Sanitation",
            weightPercent: 25,
            scoreObtained: 94,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Hands-free sensor washbasins, continuous grease trap cleaning, stainless steel prep tables sanitised with food-grade disinfectants.",
          },
          {
            id: "cat-gh-2",
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling Practices",
            weightPercent: 25,
            scoreObtained: 92,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Clear color segregation for raw meats and ready-to-eat produce. Medical fitness certificates (Form IX) verified for all 22 kitchen staff.",
          },
          {
            id: "cat-gh-3",
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Management",
            weightPercent: 15,
            scoreObtained: 90,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Monthly commercial contract with Rentokil PCI. Electronic insect killer units operational away from food prep.",
          },
          {
            id: "cat-gh-4",
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Temperature Control & Cold Chain",
            weightPercent: 15,
            scoreObtained: 92,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Walk-in chillers logged at 2.8°C; deep freezers at -20.4°C with digital telemetric alerts.",
          },
          {
            id: "cat-gh-5",
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Documentation & Regulatory Compliance",
            weightPercent: 20,
            scoreObtained: 92,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Active FSSAI State License valid to 2028. FoSTaC Food Safety Supervisor certificate verified.",
          },
        ],
      },
    ],
    documents: [
      {
        id: "doc-gh-1",
        docType: "WATER_TEST_REPORT",
        title: "IS 10500 Potable Water Bacteriological Test (NABL)",
        fileName: "water_test_gh_oct2026.pdf",
        fileUrl: "/docs/water_test_sample.pdf",
        fileSize: 428000,
        verificationStatus: "VERIFIED",
        issueDate: "2026-10-01T00:00:00.000Z",
        expiryDate: "2027-04-01T00:00:00.000Z",
        notes: "NABL Laboratory Ref: DL-WT-2026-9042",
        auditorComments: "All microbiological and heavy metal parameters compliant with IS 10500.",
        verifiedAt: "2026-10-22T00:00:00.000Z",
        createdAt: "2026-10-15T00:00:00.000Z",
      },
      {
        id: "doc-gh-2",
        docType: "PEST_CONTROL_CONTRACT",
        title: "Commercial Pest Management Service Record",
        fileName: "rentokil_oct_service_gh.pdf",
        fileUrl: "/docs/pest_control_sample.pdf",
        fileSize: 285400,
        verificationStatus: "VERIFIED",
        issueDate: "2026-10-12T00:00:00.000Z",
        expiryDate: "2026-12-12T00:00:00.000Z",
        notes: "Quarterly commercial insect & rodent monitoring log",
        auditorComments: "Service log signed by certified licensed applicator.",
        verifiedAt: "2026-10-22T00:00:00.000Z",
        createdAt: "2026-10-15T00:00:00.000Z",
      },
    ],
    consumerReports: [],
  },

  // 2. Good Kitchen with Expired Documentation (Spice Pavilion) - Flagship Audit Remediation
  {
    id: "rest-1",
    name: "Spice Pavilion Fine Dining",
    slug: "spice-pavilion-connaught-place",
    legalName: "Spice Pavilion Hospitality Pvt Ltd",
    fssaiNumber: "KP-DEMO-133240010084",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2027-08-15T00:00:00.000Z",
    cuisine: "North Indian, Mughlai, Awadhi",
    streetAddress: "M-42, Outer Circle",
    locality: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110001",
    phone: "+91 11 4152 7890",
    email: "contact@spicepavilion.in",
    foodRating: 4.6,
    totalReviews: 1240,
    safetyScore: 78,
    dataConfidenceScore: 82,
    verificationStatus: "EXPIRED",
    activeAlert: "Pest Management Documentation Expired on 5 Nov 2026: Overall score reflects automatic expiry penalty. Rectification renewal log submitted and pending auditor review.",
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
        totalScore: 78,
        maxPossibleScore: 100,
        confidenceScore: 82,
        hygieneRating: 4,
        criticalViolationsCount: 0,
        nonCriticalViolationsCount: 1,
        findingsSummary: "Kitchen maintains solid sanitary standards and valid potable water testing. However, the commercial pest management service certificate expired on 5 November 2026. Lapsed service record requires renewal.",
        correctiveActionsRequired: "Submit updated monthly pest control service log with certified applicator signature.",
        certificateNumber: "KP-AUD-2026-10-0081",
        inspector: { name: "Dr. Anil K. Sharma" },
        categories: [
          {
            id: "cat-1",
            categoryKey: "HYGIENE_SANITATION",
            name: "Hygiene & Sanitation",
            weightPercent: 25,
            scoreObtained: 94,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Foot-operated wash basins, automated soap dispensers, clean uniforms, and hair nets in full compliance.",
          },
          {
            id: "cat-2",
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling Practices",
            weightPercent: 25,
            scoreObtained: 92,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Color-coded cutting boards (green veg, red raw meat, yellow poultry). FIFO stock rotation actively labeled.",
          },
          {
            id: "cat-3",
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Management",
            weightPercent: 15,
            scoreObtained: 25,
            maxScore: 100,
            verificationStatus: "EXPIRED_EVIDENCE",
            observations: "Pest control certificate expired on 5 November 2026. Score heavily capped at 25 points under KitchenProof Methodology v2.0.",
          },
          {
            id: "cat-4",
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Temperature Control & Cold Chain",
            weightPercent: 15,
            scoreObtained: 90,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Walk-in chillers logged at 3.2°C; hot-holding tables maintained above 68°C continuously.",
          },
          {
            id: "cat-5",
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Documentation & Regulatory Compliance",
            weightPercent: 20,
            scoreObtained: 90,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "FSSAI State License active and valid to August 2027. FoSTaC supervisor certificate verified.",
          },
        ],
      },
    ],
    documents: [
      {
        id: "doc-1",
        docType: "WATER_TEST_REPORT",
        title: "IS 10500 Potable Water Bacteriological Test",
        fileName: "water_test_sept2026_nabl.pdf",
        fileUrl: "/docs/water_test_sample.pdf",
        fileSize: 342100,
        verificationStatus: "VERIFIED",
        issueDate: "2026-09-15T00:00:00.000Z",
        expiryDate: "2027-03-15T00:00:00.000Z",
        notes: "NABL Accredited Lab Ref: ND-WT-4412",
        auditorComments: "Parameters compliant with BIS standards for food preparation. Valid until March 2027.",
        verifiedAt: "2026-10-18T00:00:00.000Z",
        createdAt: "2026-10-10T00:00:00.000Z",
      },
      {
        id: "doc-2",
        docType: "PEST_CONTROL_CONTRACT",
        title: "Commercial Pest Management Service Record",
        fileName: "rentokil_oct_service.pdf",
        fileUrl: "/docs/pest_control_sample.pdf",
        fileSize: 198400,
        verificationStatus: "EXPIRED",
        issueDate: "2026-10-05T00:00:00.000Z",
        expiryDate: "2026-11-05T00:00:00.000Z",
        notes: "Monthly rodent and insect treatment log",
        auditorComments: "Lapsed certificate. Validity ended 5 November 2026. Re-certification required.",
        verifiedAt: "2026-10-18T00:00:00.000Z",
        createdAt: "2026-10-10T00:00:00.000Z",
      },
      {
        id: "doc-3",
        docType: "FOSTAC_CERTIFICATE",
        title: "FoSTaC Food Safety Supervisor Certification",
        fileName: "fostac_supervisor_cert_2025.pdf",
        fileUrl: "/docs/fostac_sample.pdf",
        fileSize: 512000,
        verificationStatus: "VERIFIED",
        issueDate: "2025-01-15T00:00:00.000Z",
        expiryDate: "2028-01-15T00:00:00.000Z",
        notes: "Certificate ID: FOSTAC/DEL/2025/8842",
        auditorComments: "Advance Catering Level 2 verified.",
        verifiedAt: "2026-10-18T00:00:00.000Z",
        createdAt: "2026-10-10T00:00:00.000Z",
      },
    ],
    consumerReports: [],
  },

  // 3. Shared Cloud Kitchen Commissary Brand 1: Biryani Cloud Box
  {
    id: "rest-3a",
    name: "Biryani Cloud Box",
    slug: "biryani-cloud-box-koramangala",
    legalName: "Cloud Epicure Private Limited",
    fssaiNumber: "KP-DEMO-112240020099",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2027-12-31T00:00:00.000Z",
    cuisine: "Hyderabadi Biryani, Kebabs, Rolls",
    streetAddress: "Plot 44, 4th Cross, 5th Block",
    locality: "Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560095",
    phone: "+91 80 4120 4455",
    email: "kitchen@biryanicloudbox.in",
    foodRating: 4.4,
    totalReviews: 890,
    safetyScore: 84,
    dataConfidenceScore: 88,
    verificationStatus: "VERIFIED",
    lastInspectedAt: "2026-09-14T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    premises: SHARED_PREMISES_BLR,
    kitchenProfile: {
      kitchenType: "CLOUD_KITCHEN",
      squareFootage: 2800,
      foodHandlersCount: 14,
      fostacSupervisorName: "Imran Pasha",
      fostacCertNumber: "FOSTAC/BLR/2024/7321",
      waterSource: "COMMERCIAL_RO",
      pestControlAgency: "Terminix SIS India",
      lastPestControlDate: "2026-09-02T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [
      {
        id: "insp-3a-1",
        inspectionType: "PREMISES_SHARED_AUDIT",
        status: "COMPLETED",
        scheduledDate: "2026-09-12T00:00:00.000Z",
        completedDate: "2026-09-14T00:00:00.000Z",
        totalScore: 84,
        maxPossibleScore: 100,
        confidenceScore: 88,
        hygieneRating: 4,
        criticalViolationsCount: 0,
        nonCriticalViolationsCount: 1,
        findingsSummary: "Shared commercial cloud kitchen facility (Curry & Roll Central Hub, PRM-BLR-004). Central RO water treatment and professional pest management verified. Thermal blast chilling protocols observed compliant.",
        certificateNumber: "KP-AUD-2026-09-0419",
        inspector: { name: "P. R. Murthy" },
        categories: [
          {
            id: "cat-3a-1",
            categoryKey: "HYGIENE_SANITATION",
            name: "Hygiene & Sanitation",
            weightPercent: 25,
            scoreObtained: 86,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Central grease traps cleared weekly. Adequate stainless steel stations for high-volume prep.",
          },
          {
            id: "cat-3a-2",
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling Practices",
            weightPercent: 25,
            scoreObtained: 84,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Proper meat marination holding at 3.5°C in walk-in chiller. Batch labels documented.",
          },
          {
            id: "cat-3a-3",
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Management",
            weightPercent: 15,
            scoreObtained: 82,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Shared facility pest management executed under comprehensive contract by Terminix SIS.",
          },
          {
            id: "cat-3a-4",
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Temperature Control & Cold Chain",
            weightPercent: 15,
            scoreObtained: 85,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Refrigeration backup powered by dedicated 125 kVA generator.",
          },
          {
            id: "cat-3a-5",
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Documentation & Regulatory Compliance",
            weightPercent: 20,
            scoreObtained: 84,
            maxScore: 100,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Active FSSAI License with sub-brand listing endorsed.",
          },
        ],
      },
    ],
    documents: [
      {
        id: "doc-3a-1",
        docType: "WATER_TEST_REPORT",
        title: "Shared Facility Potable Water Test (IS 10500)",
        fileName: "water_test_prm_blr004.pdf",
        fileUrl: "/docs/water_test_sample.pdf",
        fileSize: 310500,
        verificationStatus: "VERIFIED",
        issueDate: "2026-08-10T00:00:00.000Z",
        expiryDate: "2027-02-10T00:00:00.000Z",
        notes: "Shared Premises Central Water Testing",
        auditorComments: "Safe for food preparation across all 3 hosted delivery brands.",
        verifiedAt: "2026-09-14T00:00:00.000Z",
        createdAt: "2026-09-01T00:00:00.000Z",
      },
    ],
    consumerReports: [],
  },

  // 3B. Shared Cloud Kitchen Commissary Brand 2: Curry Express
  {
    id: "rest-3b",
    name: "Curry Express Cloud Kitchen",
    slug: "curry-express-koramangala",
    legalName: "Cloud Epicure Private Limited",
    fssaiNumber: "KP-DEMO-112240020102",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2027-12-31T00:00:00.000Z",
    cuisine: "North Indian Curries, Dal Makhani, Naan",
    streetAddress: "Plot 44, 4th Cross, 5th Block",
    locality: "Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560095",
    phone: "+91 80 4120 4456",
    email: "curryexpress@cloudepicure.in",
    foodRating: 4.3,
    totalReviews: 610,
    safetyScore: 82,
    dataConfidenceScore: 85,
    verificationStatus: "VERIFIED",
    lastInspectedAt: "2026-09-14T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    premises: SHARED_PREMISES_BLR,
    kitchenProfile: {
      kitchenType: "CLOUD_KITCHEN",
      squareFootage: 2800,
      foodHandlersCount: 14,
      fostacSupervisorName: "Imran Pasha",
      fostacCertNumber: "FOSTAC/BLR/2024/7321",
      waterSource: "COMMERCIAL_RO",
      pestControlAgency: "Terminix SIS India",
      lastPestControlDate: "2026-09-02T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [],
    documents: [],
    consumerReports: [],
  },

  // 4. Flagged Kitchen with Active Critical Violation (Street Bites & Tandoor)
  {
    id: "rest-4",
    name: "Street Bites & Tandoor",
    slug: "street-bites-tandoor-mumbai",
    legalName: "Coastal Street Ventures LLP",
    fssaiNumber: "KP-DEMO-115230050012",
    fssaiType: "STATE_LICENSE",
    fssaiValidUntil: "2027-03-30T00:00:00.000Z",
    cuisine: "Street Food, Tandoori, Kebabs",
    streetAddress: "Shop 8, Hill Road, Bandra West",
    locality: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400050",
    phone: "+91 22 2640 9876",
    email: "manager@streetbites.co",
    foodRating: 4.1,
    totalReviews: 940,
    safetyScore: 42,
    dataConfidenceScore: 65,
    verificationStatus: "ACTION_REQUIRED",
    activeAlert: "CRITICAL SAFETY VIOLATION DETECTED: Walk-in chiller temperature logged at 11.8°C (limit ≤ 4°C). Evidence of pest containment breach. 14-day statutory improvement notice issued.",
    lastInspectedAt: "2026-10-30T00:00:00.000Z",
    coverImageUrl: "https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "QUICK_SERVICE",
      squareFootage: 650,
      foodHandlersCount: 6,
      fostacSupervisorName: "Sunil G. Kamble",
      fostacCertNumber: "FOSTAC/MUM/2024/2209",
      waterSource: "MUNICIPAL_TESTED",
      pestControlAgency: "Local Commercial Pest Care",
      lastPestControlDate: "2026-08-15T00:00:00.000Z",
      oilDisposalMethod: "AUTHORIZED_RECYCLER",
    },
    inspections: [
      {
        id: "insp-4-1",
        inspectionType: "UNANNOUNCED_RISK_AUDIT",
        status: "COMPLETED",
        scheduledDate: "2026-10-30T00:00:00.000Z",
        completedDate: "2026-10-30T00:00:00.000Z",
        totalScore: 42,
        maxPossibleScore: 100,
        confidenceScore: 65,
        hygieneRating: 1,
        criticalViolationsCount: 2,
        nonCriticalViolationsCount: 3,
        findingsSummary: "CRITICAL NON-COMPLIANCE: Walk-in refrigerator running at 11.8°C. Marinated raw poultry held in danger zone. Insect light unit non-functional with insect activity observed near dry store.",
        correctiveActionsRequired: "Repair compressor unit immediately, discard affected meat inventory, conduct deep fumigation within 72 hours.",
        certificateNumber: "KP-AUD-2026-10-0994",
        inspector: { name: "S. V. Kadam" },
        categories: [
          {
            id: "cat-4-1",
            categoryKey: "HYGIENE_SANITATION",
            name: "Hygiene & Sanitation",
            weightPercent: 25,
            scoreObtained: 52,
            maxScore: 100,
            verificationStatus: "MINOR_NON_COMPLIANCE",
            observations: "Floor drain traps clogged; handwash sink blocked by inventory crates.",
          },
          {
            id: "cat-4-2",
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling Practices",
            weightPercent: 25,
            scoreObtained: 45,
            maxScore: 100,
            verificationStatus: "MINOR_NON_COMPLIANCE",
            observations: "Raw chicken handled without gloves; shared cutting boards observed.",
          },
          {
            id: "cat-4-3",
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Management",
            weightPercent: 15,
            scoreObtained: 20,
            maxScore: 100,
            verificationStatus: "CRITICAL_NON_COMPLIANCE",
            observations: "Insect ingress detected. Broken door weather seal. Fly killer inactive.",
          },
          {
            id: "cat-4-4",
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Temperature Control & Cold Chain",
            weightPercent: 15,
            scoreObtained: 20,
            maxScore: 100,
            verificationStatus: "CRITICAL_NON_COMPLIANCE",
            observations: "CRITICAL: Refrigerator core temperature 11.8°C. Meat held in bacterial multiplication danger zone.",
          },
          {
            id: "cat-4-5",
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Documentation & Regulatory Compliance",
            weightPercent: 20,
            scoreObtained: 65,
            maxScore: 100,
            verificationStatus: "MINOR_NON_COMPLIANCE",
            observations: "License active but twice-daily temperature logs not maintained since 12 October.",
          },
        ],
      },
    ],
    documents: [],
    consumerReports: [],
  },

  // 5. Unverified Self-Reported Kitchen (Golden Wok Express)
  {
    id: "rest-5",
    name: "Golden Wok Express",
    slug: "golden-wok-express-gurugram",
    legalName: "Quick Wok Retailers LLP",
    fssaiNumber: "KP-DEMO-108240030005",
    fssaiType: "REGISTRATION",
    fssaiValidUntil: "2027-01-20T00:00:00.000Z",
    cuisine: "Pan-Asian, Noodles, Momos",
    streetAddress: "Kiosk 12, Food Court, DLF Cyber City",
    locality: "DLF Cyber City",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122002",
    phone: "+91 124 405 9988",
    email: "hello@goldenwokexpress.com",
    foodRating: 4.2,
    totalReviews: 620,
    safetyScore: 48,
    dataConfidenceScore: 28,
    verificationStatus: "SELF_REPORTED",
    activeAlert: "SELF-REPORTED CLAIMS ONLY: No independent food safety audit or accredited lab test report has been validated by KitchenProof. Displayed safety metrics are operator-declared estimates.",
    lastInspectedAt: null,
    coverImageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    isDemoData: true,
    kitchenProfile: {
      kitchenType: "QUICK_SERVICE",
      squareFootage: 450,
      foodHandlersCount: 4,
      fostacSupervisorName: null,
      fostacCertNumber: null,
      waterSource: "COMMERCIAL_RO",
      pestControlAgency: "Self-Managed",
      lastPestControlDate: null,
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
  totalRestaurants: 5,
  verifiedRestaurants: 2,
  pendingRequests: 1,
  reportedConcerns: 2,
  totalUsers: 48,
  totalInspections: 8,
  expiredLicenses: 1,
};
