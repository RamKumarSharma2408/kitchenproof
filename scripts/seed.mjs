import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting KitchenProof database seed...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedRestaurant.deleteMany();
  await prisma.consumerReport.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.scoreHistory.deleteMany();
  await prisma.safetyAssessment.deleteMany();
  await prisma.inspectionCategory.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.document.deleteMany();
  await prisma.kitchenProfile.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("KitchenProof@123", 10);

  // 1. Create Core Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@kitchenproof.in",
      name: "Rajeshwar Sengupta",
      passwordHash: defaultPasswordHash,
      role: "ADMIN",
      city: "New Delhi",
      phone: "+91 98101 23456",
    },
  });

  const inspector = await prisma.user.create({
    data: {
      email: "dr.anil.inspector@example.com",
      name: "Dr. Anil K. Sharma",
      passwordHash: defaultPasswordHash,
      role: "INSPECTOR",
      city: "New Delhi",
      phone: "+91 98112 34567",
    },
  });

  const ownerPriya = await prisma.user.create({
    data: {
      email: "priya.owner@example.com",
      name: "Priya Sundaram",
      passwordHash: defaultPasswordHash,
      role: "RESTAURANT_OWNER",
      city: "Bengaluru",
      phone: "+91 98450 12345",
    },
  });

  const consumerRahul = await prisma.user.create({
    data: {
      email: "rahul.consumer@example.com",
      name: "Rahul Verma",
      passwordHash: defaultPasswordHash,
      role: "CONSUMER",
      city: "Bengaluru",
      phone: "+91 99001 54321",
    },
  });

  console.log("✅ Created 4 baseline users (Admin, Inspector, Owner, Consumer)");

  // 2. Create Restaurants
  const r1 = await prisma.restaurant.create({
    data: {
      name: "Spice Pavilion Fine Dining",
      slug: "spice-pavilion-connaught-place",
      legalName: "Spice Pavilion Hospitality Pvt Ltd",
      fssaiNumber: "13324001000845",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2027-08-15"),
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
      lastInspectedAt: new Date("2026-10-18"),
      coverImageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      ownerId: ownerPriya.id,
      kitchenProfile: {
        create: {
          kitchenType: "DINE_IN",
          squareFootage: 1850,
          foodHandlersCount: 16,
          fostacSupervisorName: "Vikramaditya Roy",
          fostacCertNumber: "FOSTAC/DEL/2025/8842",
          waterSource: "COMMERCIAL_RO",
          pestControlAgency: "Rentokil PCI Pest Solutions",
          lastPestControlDate: new Date("2026-10-05"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
    },
  });

  const r2 = await prisma.restaurant.create({
    data: {
      name: "Dosa Heritage Kitchen",
      slug: "dosa-heritage-indiranagar",
      legalName: "South Legacy Foods LLP",
      fssaiNumber: "11223334000412",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2027-04-30"),
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
      lastInspectedAt: new Date("2026-09-24"),
      coverImageUrl: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      ownerId: ownerPriya.id,
      kitchenProfile: {
        create: {
          kitchenType: "DINE_IN",
          squareFootage: 1400,
          foodHandlersCount: 12,
          fostacSupervisorName: "Praveen Kumar S",
          fostacCertNumber: "FOSTAC/BLR/2025/1190",
          waterSource: "MUNICIPAL_TESTED",
          pestControlAgency: "Pestbusters India Pvt Ltd",
          lastPestControlDate: new Date("2026-09-12"),
          oilDisposalMethod: "BIO_DIESEL_COLLECTOR",
        },
      },
    },
  });

  const r3 = await prisma.restaurant.create({
    data: {
      name: "Biryani Cloud Box",
      slug: "biryani-cloud-box-koramangala",
      legalName: "Cloud Epicure Private Limited",
      fssaiNumber: "11224002000991",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2026-12-31"),
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
      lastInspectedAt: new Date("2026-06-14"),
      coverImageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      ownerId: ownerPriya.id,
      kitchenProfile: {
        create: {
          kitchenType: "CLOUD_KITCHEN",
          squareFootage: 950,
          foodHandlersCount: 8,
          fostacSupervisorName: "Imran Pasha",
          fostacCertNumber: "FOSTAC/BLR/2024/7321",
          waterSource: "COMMERCIAL_RO",
          pestControlAgency: "Terminix SIS India",
          lastPestControlDate: new Date("2026-05-30"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
    },
  });

  const r4 = await prisma.restaurant.create({
    data: {
      name: "Tandoor & Curry Co.",
      slug: "tandoor-curry-co-bandra",
      legalName: "Bandra Coastal Gourmet LLP",
      fssaiNumber: "11523005001287",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2027-11-20"),
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
      lastInspectedAt: new Date("2026-08-10"),
      coverImageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      kitchenProfile: {
        create: {
          kitchenType: "DINE_IN",
          squareFootage: 1600,
          foodHandlersCount: 14,
          fostacSupervisorName: "Sameer Deshmukh",
          fostacCertNumber: "FOSTAC/MUM/2025/3309",
          waterSource: "MUNICIPAL_TESTED",
          pestControlAgency: "Godrej Pest Control",
          lastPestControlDate: new Date("2026-07-28"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
    },
  });

  const r5 = await prisma.restaurant.create({
    data: {
      name: "Chai & Samosa Junction",
      slug: "chai-samosa-junction-cyber-city",
      legalName: "Quick Bite Retail Ventures",
      fssaiNumber: "10824003000554",
      fssaiType: "REGISTRATION",
      fssaiValidUntil: new Date("2026-11-30"),
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
      lastInspectedAt: new Date("2026-07-02"),
      coverImageUrl: "https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      kitchenProfile: {
        create: {
          kitchenType: "QUICK_SERVICE",
          squareFootage: 450,
          foodHandlersCount: 4,
          fostacSupervisorName: "Ramesh Chand",
          fostacCertNumber: "FOSTAC/GGN/2024/9912",
          waterSource: "COMMERCIAL_RO",
          pestControlAgency: "Local Pest Control",
          lastPestControlDate: new Date("2026-06-20"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
    },
  });

  const r6 = await prisma.restaurant.create({
    data: {
      name: "Green Leaf Pure Veg",
      slug: "green-leaf-pure-veg-jubilee-hills",
      legalName: "Satvik Culinary Creations",
      fssaiNumber: "13623001000778",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2028-02-28"),
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
      lastInspectedAt: new Date("2026-10-10"),
      coverImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      kitchenProfile: {
        create: {
          kitchenType: "DINE_IN",
          squareFootage: 2100,
          foodHandlersCount: 18,
          fostacSupervisorName: "Venkat Rao K",
          fostacCertNumber: "FOSTAC/HYD/2025/4410",
          waterSource: "COMMERCIAL_RO",
          pestControlAgency: "Rentokil PCI",
          lastPestControlDate: new Date("2026-09-30"),
          oilDisposalMethod: "BIO_DIESEL_COLLECTOR",
        },
      },
    },
  });

  const r7 = await prisma.restaurant.create({
    data: {
      name: "Old Delhi Zaika Express",
      slug: "old-delhi-zaika-express-chandni-chowk",
      legalName: "Zaika Heritage Foods",
      fssaiNumber: "13324004000192",
      fssaiType: "REGISTRATION",
      fssaiValidUntil: new Date("2027-01-15"),
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
        create: {
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
      },
    },
  });

  const r8 = await prisma.restaurant.create({
    data: {
      name: "Royal Awadh Cloud Kitchen",
      slug: "royal-awadh-cloud-kitchen-pune",
      legalName: "Nawab Flavours Kitchens Pvt Ltd",
      fssaiNumber: "11524007000881",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2026-10-01"), // Expired licence
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
      lastInspectedAt: new Date("2026-05-18"),
      coverImageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      kitchenProfile: {
        create: {
          kitchenType: "CLOUD_KITCHEN",
          squareFootage: 800,
          foodHandlersCount: 7,
          fostacSupervisorName: "Farhan Ansari",
          fostacCertNumber: "FOSTAC/PUN/2023/1102",
          waterSource: "BOREWELL_PURIFIED",
          pestControlAgency: "City Pest Control",
          lastPestControlDate: new Date("2026-04-12"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
    },
  });

  console.log("✅ Seeded 8 restaurants across Delhi, Bengaluru, Mumbai, Gurugram, Hyderabad, Pune");

  // 3. Add Verified Inspection to Spice Pavilion (r1)
  const insp1 = await prisma.inspection.create({
    data: {
      restaurantId: r1.id,
      inspectorId: inspector.id,
      inspectionType: "ROUTINE_HYGIENE",
      status: "COMPLETED",
      scheduledDate: new Date("2026-10-15"),
      completedDate: new Date("2026-10-18"),
      overallScore: 94,
      hygieneRatingSmiles: 5,
      criticalViolationsCount: 0,
      nonCriticalViolationsCount: 1,
      findingsSummary:
        "Kitchen demonstrates exemplary standards of hygiene, cross-contamination control, and temperature logging. Commercial RO water tested compliant with IS 10500. Medical records of all 16 food handlers up to date.",
      correctiveActionsRequired:
        "Ensure gasket seal on secondary under-counter freezer unit B2 is cleaned twice weekly.",
      categories: {
        create: [
          {
            categoryKey: "HYGIENE_SANITATION",
            name: "Hygiene & Sanitation",
            weightPercent: 25,
            scoreObtained: 96,
            weightedScore: 24.0,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Spotless stainless-steel prep surfaces; automated handwashing stations in active use.",
          },
          {
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling Practices",
            weightPercent: 25,
            scoreObtained: 95,
            weightedScore: 23.75,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Strict separation of vegetarian and non-vegetarian preparation tables; complete PPE worn.",
          },
          {
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Management",
            weightPercent: 15,
            scoreObtained: 92,
            weightedScore: 13.8,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Rentokil monthly report verified; insect light traps cleared and positioned correctly.",
          },
          {
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Temperature Control",
            weightPercent: 15,
            scoreObtained: 90,
            weightedScore: 13.5,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Digital dataloggers verified in walk-in chillers (3.2°C) and blast freezer (-21°C).",
          },
          {
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Documentation & Compliance",
            weightPercent: 20,
            scoreObtained: 95,
            weightedScore: 19.0,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "State License valid; purple Food Safety Display Board clearly mounted; FoSTaC supervisor present.",
          },
        ],
      },
    },
  });

  // Documents for Spice Pavilion
  await prisma.document.createMany({
    data: [
      {
        restaurantId: r1.id,
        uploaderId: ownerPriya.id,
        docType: "FSSAI_CERTIFICATE",
        title: "FSSAI State License Certificate (13324001000845)",
        fileName: "fssai_license_spice_pavilion.pdf",
        fileUrl: "/demo-docs/fssai_cert_13324001000845.pdf",
        fileSize: 420000,
        issueDate: new Date("2024-08-16"),
        expiryDate: new Date("2027-08-15"),
        verificationStatus: "VERIFIED",
        verifiedById: inspector.id,
        verifiedAt: new Date("2026-10-18"),
        notes: "Verified against FSSAI FoSCoS portal database.",
      },
      {
        restaurantId: r1.id,
        uploaderId: ownerPriya.id,
        docType: "WATER_TEST_REPORT",
        title: "Potable Water Microbiological Test (IS 10500)",
        fileName: "water_test_q3_2026.pdf",
        fileUrl: "/demo-docs/water_test_q3_2026.pdf",
        fileSize: 310000,
        issueDate: new Date("2026-09-01"),
        expiryDate: new Date("2027-03-01"),
        verificationStatus: "VERIFIED",
        verifiedById: inspector.id,
        verifiedAt: new Date("2026-10-18"),
        notes: "NABL accredited lab report. Coliforms: Absent, pH: 7.2.",
      },
      {
        restaurantId: r1.id,
        uploaderId: ownerPriya.id,
        docType: "PEST_CONTROL_LOG",
        title: "Monthly Pest Eradication Service Certificate",
        fileName: "rentokil_pci_oct_2026.pdf",
        fileUrl: "/demo-docs/rentokil_oct_2026.pdf",
        fileSize: 180000,
        issueDate: new Date("2026-10-05"),
        expiryDate: new Date("2026-11-05"),
        verificationStatus: "VERIFIED",
        verifiedById: inspector.id,
        verifiedAt: new Date("2026-10-18"),
        notes: "Cockroach gel treatment & rodent perimeter baiting verified.",
      },
      {
        restaurantId: r1.id,
        uploaderId: ownerPriya.id,
        docType: "FOSTAC_CERTIFICATE",
        title: "Food Safety Supervisor Certification (Advance Catering)",
        fileName: "fostac_cert_vroy.pdf",
        fileUrl: "/demo-docs/fostac_cert_vroy.pdf",
        fileSize: 290000,
        issueDate: new Date("2025-01-10"),
        expiryDate: new Date("2027-01-09"),
        verificationStatus: "VERIFIED",
        verifiedById: inspector.id,
        verifiedAt: new Date("2026-10-18"),
        notes: "Supervisor Vikramaditya Roy actively on-duty.",
      },
    ],
  });

  // Safety assessments for Spice Pavilion
  await prisma.safetyAssessment.createMany({
    data: [
      {
        restaurantId: r1.id,
        categoryKey: "HYGIENE_SANITATION",
        title: "Potable Water Testing (IS 10500)",
        standardRequired: "Bacteriological and chemical test every 6 months",
        currentStatus: "COMPLIANT",
        confidenceWeight: 100,
      },
      {
        restaurantId: r1.id,
        categoryKey: "FOOD_HANDLING",
        title: "Medical Fitness Form IX for Food Handlers",
        standardRequired: "Annual physical exam, deworming, typhoid vaccine",
        currentStatus: "COMPLIANT",
        confidenceWeight: 100,
      },
      {
        restaurantId: r1.id,
        categoryKey: "PEST_MANAGEMENT",
        title: "Integrated Pest Management (IPM) Log",
        standardRequired: "Continuous contract with licensed pest agency",
        currentStatus: "COMPLIANT",
        confidenceWeight: 100,
      },
      {
        restaurantId: r1.id,
        categoryKey: "TEMPERATURE_CONTROL",
        title: "Chiller and Freezer Temperature Monitoring",
        standardRequired: "Twice daily recorded digital log ≤ 4°C and ≤ -18°C",
        currentStatus: "COMPLIANT",
        confidenceWeight: 95,
      },
      {
        restaurantId: r1.id,
        categoryKey: "DOCUMENTATION_COMPLIANCE",
        title: "FSSAI License Display on Purple FSDB",
        standardRequired: "Mandatory prominent display with consumer feedback info",
        currentStatus: "COMPLIANT",
        confidenceWeight: 100,
      },
    ],
  });

  // 4. Consumer Saved Restaurant & Concern
  await prisma.savedRestaurant.create({
    data: {
      userId: consumerRahul.id,
      restaurantId: r1.id,
    },
  });

  await prisma.consumerReport.create({
    data: {
      restaurantId: r5.id, // Chai & Samosa Junction
      reporterId: consumerRahul.id,
      reporterName: "Rahul Verma",
      reporterEmail: "rahul.consumer@example.com",
      issueType: "POOR_HYGIENE",
      description:
        "Observed repetitive reuse of frying oil that appeared dark and viscous without periodic polar testing.",
      incidentDate: new Date("2026-10-22"),
      status: "UNDER_INVESTIGATION",
      resolutionNotes: "Assigned to regional verification officer for oil TPC audit.",
    },
  });

  // 5. Verification Request for Biryani Cloud Box (r3)
  await prisma.verificationRequest.create({
    data: {
      restaurantId: r3.id,
      requestedById: ownerPriya.id,
      status: "PENDING",
      requestNotes:
        "We have upgraded our ventilation ducting and renewed our quarterly water analysis. Requesting fresh inspection to improve verified safety badge.",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
