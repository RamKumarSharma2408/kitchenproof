import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting KitchenProof database seed (Methodology v2.0)...");

  // Clean existing data in reverse relation order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedRestaurant.deleteMany();
  await prisma.consumerReport.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.scoreHistory.deleteMany();
  await prisma.safetyAssessment.deleteMany();
  await prisma.inspectionCategory.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.document.deleteMany();
  await prisma.kitchenProfile.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.physicalPremises.deleteMany();
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

  // 2. Create Shared Physical Premises
  const sharedPremisesBLR = await prisma.physicalPremises.create({
    data: {
      premisesCode: "PRM-BLR-004",
      facilityName: "Curry & Roll Central Commissary Hub",
      streetAddress: "Plot 44, 4th Cross, 5th Block",
      locality: "Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560095",
      facilityType: "CLOUD_KITCHEN_COMMISSARY",
      totalPreparationArea: 2800,
      waterSupplyType: "Commercial RO + UV Multi-Stage Filtration",
      pestControlAgency: "Terminix SIS Commercial Solutions",
      lastPestControlDate: new Date("2026-09-02"),
      oilRecyclerContract: "Authorized Bio-Energy Partner Ltd",
    },
  });
  console.log("✅ Created Shared Physical Premises (PRM-BLR-004)");

  // 3. Create Kitchen 1: The Grand Horizon Kitchen (Exemplary Verified)
  const rGrandHorizon = await prisma.restaurant.create({
    data: {
      name: "The Grand Horizon Kitchen",
      slug: "the-grand-horizon-aerocity",
      legalName: "Grand Horizon Hospitality Limited",
      fssaiNumber: "KP-DEMO-133240010099",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2028-05-15"),
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
      lastInspectedAt: new Date("2026-10-22"),
      coverImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      ownerId: ownerPriya.id,
      kitchenProfile: {
        create: {
          kitchenType: "DINE_IN",
          squareFootage: 2600,
          foodHandlersCount: 22,
          fostacSupervisorName: "Chef Rajeshwar Sengupta",
          fostacCertNumber: "FOSTAC/DEL/2025/1199",
          waterSource: "COMMERCIAL_RO",
          pestControlAgency: "Rentokil PCI Pest Solutions",
          lastPestControlDate: new Date("2026-10-12"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
      documents: {
        create: [
          {
            uploaderId: ownerPriya.id,
            docType: "WATER_TEST_REPORT",
            title: "IS 10500 Potable Water Bacteriological Test (NABL)",
            fileName: "water_test_gh_oct2026.pdf",
            fileUrl: "/docs/water_test_sample.pdf",
            fileSize: 428000,
            verificationStatus: "VERIFIED",
            issueDate: new Date("2026-10-01"),
            expiryDate: new Date("2027-04-01"),
            notes: "NABL Laboratory Ref: DL-WT-2026-9042. All microbiological and heavy metal parameters compliant with IS 10500.",
            verifiedById: inspector.id,
            verifiedAt: new Date("2026-10-22"),
          },
          {
            uploaderId: ownerPriya.id,
            docType: "PEST_CONTROL_CONTRACT",
            title: "Commercial Pest Management Service Record",
            fileName: "rentokil_oct_service_gh.pdf",
            fileUrl: "/docs/pest_control_sample.pdf",
            fileSize: 285400,
            verificationStatus: "VERIFIED",
            issueDate: new Date("2026-10-12"),
            expiryDate: new Date("2026-12-12"),
            notes: "Quarterly commercial insect & rodent monitoring log. Service log signed by certified licensed applicator.",
            verifiedById: inspector.id,
            verifiedAt: new Date("2026-10-22"),
          },
        ],
      },
    },
  });

  const inspGH = await prisma.inspection.create({
    data: {
      restaurantId: rGrandHorizon.id,
      inspectorId: inspector.id,
      inspectionType: "SCHEDULED_COMPREHENSIVE",
      status: "COMPLETED",
      scheduledDate: new Date("2026-10-20"),
      completedDate: new Date("2026-10-22"),
      overallScore: 92,
      hygieneRatingSmiles: 5,
      findingsSummary: "Exemplary sanitary and documentation standards. NABL water lab tests confirmed potable. Color-coded prep stations and cold-chain logging verified fully compliant.",
      categories: {
        create: [
          {
            categoryKey: "HYGIENE_SANITATION",
            name: "Hygiene & Sanitation",
            weightPercent: 25,
            scoreObtained: 94,
            weightedScore: 23.5,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Hands-free sensor washbasins, continuous grease trap cleaning, stainless steel prep tables sanitised with food-grade disinfectants.",
          },
          {
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling Practices",
            weightPercent: 25,
            scoreObtained: 92,
            weightedScore: 23.0,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Clear color segregation for raw meats and ready-to-eat produce. Medical fitness certificates (Form IX) verified for all 22 kitchen staff.",
          },
          {
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Management",
            weightPercent: 15,
            scoreObtained: 90,
            weightedScore: 13.5,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Monthly commercial contract with Rentokil PCI. Electronic insect killer units operational away from food prep.",
          },
          {
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Temperature Control & Cold Chain",
            weightPercent: 15,
            scoreObtained: 92,
            weightedScore: 13.8,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Walk-in chillers logged at 2.8°C; deep freezers at -20.4°C with digital telemetric alerts.",
          },
          {
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Documentation & Regulatory Compliance",
            weightPercent: 20,
            scoreObtained: 92,
            weightedScore: 18.4,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Active FSSAI State License valid to 2028. FoSTaC Food Safety Supervisor certificate verified.",
          },
        ],
      },
    },
  });

  // 4. Create Kitchen 2: Spice Pavilion (Good Kitchen with Expired Pest Documentation)
  const rSpicePavilion = await prisma.restaurant.create({
    data: {
      name: "Spice Pavilion Fine Dining",
      slug: "spice-pavilion-connaught-place",
      legalName: "Spice Pavilion Hospitality Pvt Ltd",
      fssaiNumber: "KP-DEMO-133240010084",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2027-08-15"),
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
      documents: {
        create: [
          {
            uploaderId: ownerPriya.id,
            docType: "WATER_TEST_REPORT",
            title: "IS 10500 Potable Water Bacteriological Test",
            fileName: "water_test_sept2026_nabl.pdf",
            fileUrl: "/docs/water_test_sample.pdf",
            fileSize: 342100,
            verificationStatus: "VERIFIED",
            issueDate: new Date("2026-09-15"),
            expiryDate: new Date("2027-03-15"),
            notes: "NABL Accredited Lab Ref: ND-WT-4412. Parameters compliant with BIS standards for food preparation. Valid until March 2027.",
            verifiedById: inspector.id,
            verifiedAt: new Date("2026-10-18"),
          },
          {
            uploaderId: ownerPriya.id,
            docType: "PEST_CONTROL_CONTRACT",
            title: "Commercial Pest Management Service Record",
            fileName: "rentokil_oct_service.pdf",
            fileUrl: "/docs/pest_control_sample.pdf",
            fileSize: 198400,
            verificationStatus: "EXPIRED",
            issueDate: new Date("2026-10-05"),
            expiryDate: new Date("2026-11-05"), // Lapsed relative to Nov 2026 evaluation!
            notes: "Monthly rodent and insect treatment log. Lapsed certificate. Validity ended 5 November 2026. Re-certification required.",
            verifiedById: inspector.id,
            verifiedAt: new Date("2026-10-18"),
          },
          {
            uploaderId: ownerPriya.id,
            docType: "FOSTAC_CERTIFICATE",
            title: "FoSTaC Food Safety Supervisor Certification",
            fileName: "fostac_supervisor_cert_2025.pdf",
            fileUrl: "/docs/fostac_sample.pdf",
            fileSize: 512000,
            verificationStatus: "VERIFIED",
            issueDate: new Date("2025-01-15"),
            expiryDate: new Date("2028-01-15"),
            notes: "Certificate ID: FOSTAC/DEL/2025/8842. Advance Catering Level 2 verified.",
            verifiedById: inspector.id,
            verifiedAt: new Date("2026-10-18"),
          },
        ],
      },
    },
  });

  await prisma.inspection.create({
    data: {
      restaurantId: rSpicePavilion.id,
      inspectorId: inspector.id,
      inspectionType: "SCHEDULED_COMPREHENSIVE",
      status: "COMPLETED",
      scheduledDate: new Date("2026-10-17"),
      completedDate: new Date("2026-10-18"),
      overallScore: 78,
      hygieneRatingSmiles: 4,
      criticalViolationsCount: 0,
      nonCriticalViolationsCount: 1,
      findingsSummary: "Kitchen maintains solid sanitary standards and valid potable water testing. However, the commercial pest management service certificate expired on 5 November 2026. Lapsed service record requires renewal.",
      correctiveActionsRequired: "Submit updated monthly pest control service log with certified applicator signature.",
      categories: {
        create: [
          {
            categoryKey: "HYGIENE_SANITATION",
            name: "Hygiene & Sanitation",
            weightPercent: 25,
            scoreObtained: 94,
            weightedScore: 23.5,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Foot-operated wash basins, automated soap dispensers, clean uniforms, and hair nets in full compliance.",
          },
          {
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling Practices",
            weightPercent: 25,
            scoreObtained: 92,
            weightedScore: 23.0,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Color-coded cutting boards (green veg, red raw meat, yellow poultry). FIFO stock rotation actively labeled.",
          },
          {
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Management",
            weightPercent: 15,
            scoreObtained: 25,
            weightedScore: 3.75,
            verificationStatus: "EXPIRED_EVIDENCE",
            observations: "Pest control certificate expired on 5 November 2026. Score heavily capped at 25 points under KitchenProof Methodology v2.0.",
          },
          {
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Temperature Control & Cold Chain",
            weightPercent: 15,
            scoreObtained: 90,
            weightedScore: 13.5,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "Walk-in chillers logged at 3.2°C; hot-holding tables maintained above 68°C continuously.",
          },
          {
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Documentation & Regulatory Compliance",
            weightPercent: 20,
            scoreObtained: 90,
            weightedScore: 18.0,
            verificationStatus: "VERIFIED_COMPLIANT",
            observations: "FSSAI State License active and valid to August 2027. FoSTaC supervisor certificate verified.",
          },
        ],
      },
    },
  });

  // 5. Create Kitchen 3A: Biryani Cloud Box (Shared Cloud Kitchen Commissary)
  const rBiryaniCloud = await prisma.restaurant.create({
    data: {
      name: "Biryani Cloud Box",
      slug: "biryani-cloud-box-koramangala",
      legalName: "Cloud Epicure Private Limited",
      fssaiNumber: "KP-DEMO-112240020099",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2027-12-31"),
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
      lastInspectedAt: new Date("2026-09-14"),
      coverImageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      ownerId: ownerPriya.id,
      premisesId: sharedPremisesBLR.id,
      kitchenProfile: {
        create: {
          kitchenType: "CLOUD_KITCHEN",
          squareFootage: 2800,
          foodHandlersCount: 14,
          fostacSupervisorName: "Imran Pasha",
          fostacCertNumber: "FOSTAC/BLR/2024/7321",
          waterSource: "COMMERCIAL_RO",
          pestControlAgency: "Terminix SIS India",
          lastPestControlDate: new Date("2026-09-02"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
    },
  });

  // 6. Create Kitchen 3B: Curry Express Cloud Kitchen (Hosted on Same Commissary)
  const rCurryExpress = await prisma.restaurant.create({
    data: {
      name: "Curry Express Cloud Kitchen",
      slug: "curry-express-koramangala",
      legalName: "Cloud Epicure Private Limited",
      fssaiNumber: "KP-DEMO-112240020102",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2027-12-31"),
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
      lastInspectedAt: new Date("2026-09-14"),
      coverImageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      ownerId: ownerPriya.id,
      premisesId: sharedPremisesBLR.id,
      kitchenProfile: {
        create: {
          kitchenType: "CLOUD_KITCHEN",
          squareFootage: 2800,
          foodHandlersCount: 14,
          fostacSupervisorName: "Imran Pasha",
          fostacCertNumber: "FOSTAC/BLR/2024/7321",
          waterSource: "COMMERCIAL_RO",
          pestControlAgency: "Terminix SIS India",
          lastPestControlDate: new Date("2026-09-02"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
    },
  });

  // 7. Create Kitchen 4: Street Bites & Tandoor (Flagged with Active Critical Violation)
  const rStreetBites = await prisma.restaurant.create({
    data: {
      name: "Street Bites & Tandoor",
      slug: "street-bites-tandoor-mumbai",
      legalName: "Coastal Street Ventures LLP",
      fssaiNumber: "KP-DEMO-115230050012",
      fssaiType: "STATE_LICENSE",
      fssaiValidUntil: new Date("2027-03-30"),
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
      lastInspectedAt: new Date("2026-10-30"),
      coverImageUrl: "https://images.unsplash.com/photo-1505253758473-96b3015f21c9?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      ownerId: ownerPriya.id,
      kitchenProfile: {
        create: {
          kitchenType: "QUICK_SERVICE",
          squareFootage: 650,
          foodHandlersCount: 6,
          fostacSupervisorName: "Sunil G. Kamble",
          fostacCertNumber: "FOSTAC/MUM/2024/2209",
          waterSource: "MUNICIPAL_TESTED",
          pestControlAgency: "Local Commercial Pest Care",
          lastPestControlDate: new Date("2026-08-15"),
          oilDisposalMethod: "AUTHORIZED_RECYCLER",
        },
      },
    },
  });

  await prisma.inspection.create({
    data: {
      restaurantId: rStreetBites.id,
      inspectorId: inspector.id,
      inspectionType: "UNANNOUNCED_RISK_AUDIT",
      status: "COMPLETED",
      scheduledDate: new Date("2026-10-30"),
      completedDate: new Date("2026-10-30"),
      overallScore: 42,
      hygieneRatingSmiles: 1,
      criticalViolationsCount: 2,
      nonCriticalViolationsCount: 3,
      findingsSummary: "CRITICAL NON-COMPLIANCE: Walk-in refrigerator running at 11.8°C. Marinated raw poultry held in danger zone. Insect light unit non-functional with insect activity observed near dry store.",
      correctiveActionsRequired: "Repair compressor unit immediately, discard affected meat inventory, conduct deep fumigation within 72 hours.",
      categories: {
        create: [
          {
            categoryKey: "HYGIENE_SANITATION",
            name: "Hygiene & Sanitation",
            weightPercent: 25,
            scoreObtained: 52,
            weightedScore: 13.0,
            verificationStatus: "MINOR_NON_COMPLIANCE",
            observations: "Floor drain traps clogged; handwash sink blocked by inventory crates.",
          },
          {
            categoryKey: "FOOD_HANDLING",
            name: "Food Handling Practices",
            weightPercent: 25,
            scoreObtained: 45,
            weightedScore: 11.25,
            verificationStatus: "MINOR_NON_COMPLIANCE",
            observations: "Raw chicken handled without gloves; shared cutting boards observed.",
          },
          {
            categoryKey: "PEST_MANAGEMENT",
            name: "Pest Management",
            weightPercent: 15,
            scoreObtained: 20,
            weightedScore: 3.0,
            verificationStatus: "CRITICAL_NON_COMPLIANCE",
            observations: "Insect ingress detected. Broken door weather seal. Fly killer inactive.",
          },
          {
            categoryKey: "TEMPERATURE_CONTROL",
            name: "Temperature Control & Cold Chain",
            weightPercent: 15,
            scoreObtained: 20,
            weightedScore: 3.0,
            verificationStatus: "CRITICAL_NON_COMPLIANCE",
            observations: "CRITICAL: Refrigerator core temperature 11.8°C. Meat held in bacterial multiplication danger zone.",
          },
          {
            categoryKey: "DOCUMENTATION_COMPLIANCE",
            name: "Documentation & Regulatory Compliance",
            weightPercent: 20,
            scoreObtained: 65,
            weightedScore: 13.0,
            verificationStatus: "MINOR_NON_COMPLIANCE",
            observations: "License active but twice-daily temperature logs not maintained since 12 October.",
          },
        ],
      },
    },
  });

  // 8. Create Kitchen 5: Golden Wok Express (Self-Reported Unverified Kitchen)
  await prisma.restaurant.create({
    data: {
      name: "Golden Wok Express",
      slug: "golden-wok-express-gurugram",
      legalName: "Quick Wok Retailers LLP",
      fssaiNumber: "KP-DEMO-108240030005",
      fssaiType: "REGISTRATION",
      fssaiValidUntil: new Date("2027-01-20"),
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
      lastInspectedAt: null,
      coverImageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      isDemoData: true,
      ownerId: ownerPriya.id,
      kitchenProfile: {
        create: {
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
      },
    },
  });

  console.log("✅ Seed completed successfully! 5 distinct realistic kitchens with physical premises seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
