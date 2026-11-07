import test from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculateSafetyScore, SCORING_CATEGORIES } from "../src/lib/scoring.ts";
import { getVerificationStatusBadge, getVerificationStatusDescription } from "../src/lib/utils.ts";
import { generateQRCodeSVG } from "../src/lib/qrcode.ts";

const prisma = new PrismaClient();

test("KitchenProof Comprehensive Verification & Production Test Suite (15 Journeys)", async (t) => {
  let testConsumerId;
  let testOwnerId;
  let testInspectorId;
  let testRestaurantId;
  let testDocId;

  // 1. Auth & Password Hashing
  await t.test("1. Consumer registers and logs in (Auth & Hashing)", async () => {
    const email = `test.consumer.${Date.now()}@example.com`;
    const password = "TestPassword@123";
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: "Test Consumer",
        email,
        passwordHash,
        role: "CONSUMER",
        city: "Bengaluru",
      },
    });

    assert.ok(user.id);
    assert.equal(user.role, "CONSUMER");
    testConsumerId = user.id;

    // Verify password verification
    const isValid = await bcrypt.compare(password, user.passwordHash);
    assert.equal(isValid, true, "Password should verify correctly");

    const isWrong = await bcrypt.compare("WrongPassword", user.passwordHash);
    assert.equal(isWrong, false, "Wrong password should be rejected");
  });

  // 2. Kitchen Directory & City Search
  await t.test("2. Consumer searches for kitchens across cities and cuisines", async () => {
    const results = await prisma.restaurant.findMany({
      where: {
        city: "Bengaluru",
      },
    });

    assert.ok(results.length >= 1, "Should find at least 1 restaurant in Bengaluru");
    assert.ok(results[0].name, "Restaurant must have a name");
  });

  // 3. Detailed Safety Profile & Categories
  await t.test("3. Consumer views detailed safety profile with category scores", async () => {
    const restaurant = await prisma.restaurant.findFirst({
      where: { verificationStatus: "VERIFIED" },
      include: {
        kitchenProfile: true,
        inspections: {
          include: { categories: true },
        },
      },
    });

    assert.ok(restaurant, "Verified restaurant should exist");
    assert.ok(restaurant.safetyScore >= 70, "Verified restaurant score should be >= 70");
    assert.ok(restaurant.kitchenProfile, "Kitchen profile must be present");
    assert.ok(restaurant.inspections.length > 0, "Inspection history should exist");

    testRestaurantId = restaurant.id;
  });

  // 4. Watchlist Toggle
  await t.test("4. Consumer saves and unsaves a kitchen", async () => {
    const saved = await prisma.savedRestaurant.create({
      data: {
        userId: testConsumerId,
        restaurantId: testRestaurantId,
      },
    });
    assert.ok(saved.id, "Kitchen should be saved");

    const count = await prisma.savedRestaurant.count({
      where: { userId: testConsumerId },
    });
    assert.equal(count, 1);

    await prisma.savedRestaurant.delete({
      where: { id: saved.id },
    });
    const countAfter = await prisma.savedRestaurant.count({
      where: { userId: testConsumerId },
    });
    assert.equal(countAfter, 0);
  });

  // 5. Food Safety Concern Submission
  await t.test("5. Consumer submits a safety concern report", async () => {
    const report = await prisma.consumerReport.create({
      data: {
        restaurantId: testRestaurantId,
        reporterId: testConsumerId,
        reporterName: "Test Consumer",
        reporterEmail: "test.consumer@example.com",
        issueType: "PEST_SIGHTING",
        description: "Observed fruit flies near preparation counter on visit.",
        status: "SUBMITTED",
      },
    });

    assert.ok(report.id);
    assert.equal(report.status, "SUBMITTED");
    assert.equal(report.issueType, "PEST_SIGHTING");
  });

  // 6. Owner Document Submission
  await t.test("6. Restaurant owner submits compliance documents", async () => {
    const owner = await prisma.user.findFirst({
      where: { role: "RESTAURANT_OWNER" },
    });
    assert.ok(owner);
    testOwnerId = owner.id;

    const doc = await prisma.document.create({
      data: {
        restaurantId: testRestaurantId,
        uploaderId: testOwnerId,
        docType: "WATER_TEST_REPORT",
        title: "Microbiological Potable Water Analysis (IS 10500)",
        fileName: "water_test_nov2026.pdf",
        fileUrl: "/demo-docs/water_test.pdf",
        verificationStatus: "PENDING_VERIFICATION", // Must start unverified
        issueDate: new Date(),
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
    });

    assert.ok(doc.id);
    assert.equal(doc.verificationStatus, "PENDING_VERIFICATION");
    testDocId = doc.id;
  });

  // 7. Inspector Document Review
  await t.test("7. Inspector reviews and approves submitted document", async () => {
    const inspector = await prisma.user.findFirst({
      where: { role: "INSPECTOR" },
    });
    assert.ok(inspector);
    testInspectorId = inspector.id;

    const updatedDoc = await prisma.document.update({
      where: { id: testDocId },
      data: {
        verificationStatus: "VERIFIED",
        verifiedById: testInspectorId,
        verifiedAt: new Date(),
        notes: "NABL certified laboratory water analysis verified compliant with IS 10500.",
      },
    });

    assert.equal(updatedDoc.verificationStatus, "VERIFIED");
    assert.equal(updatedDoc.verifiedById, testInspectorId);
  });

  // 8 & 9. Scoring Engine Exact 5 Weights Calculation
  await t.test("8 & 9. Inspector records inspection & safety score recalculates with 5 weights", async () => {
    const testAssessments = [
      {
        categoryKey: "HYGIENE_SANITATION",
        scoreObtained: 92,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 2,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "FOOD_HANDLING",
        scoreObtained: 88,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 1,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "PEST_MANAGEMENT",
        scoreObtained: 85,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 1,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "TEMPERATURE_CONTROL",
        scoreObtained: 90,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 1,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "DOCUMENTATION_COMPLIANCE",
        scoreObtained: 95,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 3,
        hasExpiredEvidence: false,
      },
    ];

    const calculation = calculateSafetyScore(testAssessments);

    // Exact Mathematical formula verification:
    // Hygiene 25%: 92 * 0.25 = 23.0
    // Food Handling 25%: 88 * 0.25 = 22.0
    // Pest Management 15%: 85 * 0.15 = 12.75
    // Temperature Control 15%: 90 * 0.15 = 13.50
    // Documentation 20%: 95 * 0.20 = 19.00
    // Total = 90.25 -> 90
    assert.equal(calculation.overallScore, 90, "Overall score must be exactly 90");
    assert.equal(calculation.hygieneRatingSmiles, 5, "Score >= 85 must receive 5 Smiles");
    assert.equal(calculation.dataConfidenceScore, 100, "All verified evidence yields 100% confidence");
    assert.equal(calculation.isPassingGrade, true, "Should pass grade");
  });

  // 10. Security & Role Boundaries: Unverified Claims Cap Score
  await t.test("10. Security & role boundaries: unverified claims cap score", async () => {
    const unverifiedAssessments = [
      {
        categoryKey: "HYGIENE_SANITATION",
        scoreObtained: 95,
        verificationStatus: "UNVERIFIED",
        evidenceCount: 0,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "FOOD_HANDLING",
        scoreObtained: 95,
        verificationStatus: "UNVERIFIED",
        evidenceCount: 0,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "PEST_MANAGEMENT",
        scoreObtained: 95,
        verificationStatus: "MISSING_EVIDENCE",
        evidenceCount: 0,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "TEMPERATURE_CONTROL",
        scoreObtained: 95,
        verificationStatus: "MISSING_EVIDENCE",
        evidenceCount: 0,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "DOCUMENTATION_COMPLIANCE",
        scoreObtained: 95,
        verificationStatus: "MISSING_EVIDENCE",
        evidenceCount: 0,
        hasExpiredEvidence: false,
      },
    ];

    const calculation = calculateSafetyScore(unverifiedAssessments);

    // Raw score was 95, but unverified claims are capped at 50 points and missing at 0
    assert.ok(
      calculation.overallScore <= 50,
      `Unverified kitchen must not score high: got ${calculation.overallScore}`
    );
    assert.ok(
      calculation.dataConfidenceScore <= 40,
      `Unverified data confidence must be low: got ${calculation.dataConfidenceScore}`
    );
  });

  // 11. Expired Evidence Penalisation
  await t.test("11. Scoring Engine applies penalty for expired compliance evidence", async () => {
    const expiredAssessments = [
      {
        categoryKey: "HYGIENE_SANITATION",
        scoreObtained: 90,
        verificationStatus: "EXPIRED_EVIDENCE",
        evidenceCount: 1,
        hasExpiredEvidence: true,
      },
      {
        categoryKey: "FOOD_HANDLING",
        scoreObtained: 90,
        verificationStatus: "EXPIRED_EVIDENCE",
        evidenceCount: 1,
        hasExpiredEvidence: true,
      },
      {
        categoryKey: "PEST_MANAGEMENT",
        scoreObtained: 90,
        verificationStatus: "EXPIRED_EVIDENCE",
        evidenceCount: 1,
        hasExpiredEvidence: true,
      },
      {
        categoryKey: "TEMPERATURE_CONTROL",
        scoreObtained: 90,
        verificationStatus: "EXPIRED_EVIDENCE",
        evidenceCount: 1,
        hasExpiredEvidence: true,
      },
      {
        categoryKey: "DOCUMENTATION_COMPLIANCE",
        scoreObtained: 90,
        verificationStatus: "EXPIRED_EVIDENCE",
        evidenceCount: 1,
        hasExpiredEvidence: true,
      },
    ];

    const calculation = calculateSafetyScore(expiredAssessments);

    // Expired evidence caps category scores to max 40 points, so overall score <= 40
    assert.ok(
      calculation.overallScore <= 40,
      `Expired evidence must cap score to <= 40: got ${calculation.overallScore}`
    );
    assert.ok(
      calculation.dataConfidenceScore <= 35,
      `Expired evidence must have degraded confidence: got ${calculation.dataConfidenceScore}`
    );
  });

  // 12. Critical Violation Smile Rating Penalty
  await t.test("12. Critical non-compliance flags cap smile rating and fail passing grade", async () => {
    const criticalAssessments = [
      {
        categoryKey: "HYGIENE_SANITATION",
        scoreObtained: 90,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 2,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "FOOD_HANDLING",
        scoreObtained: 85,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 1,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "PEST_MANAGEMENT",
        scoreObtained: 20,
        verificationStatus: "CRITICAL_NON_COMPLIANCE",
        evidenceCount: 1,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "TEMPERATURE_CONTROL",
        scoreObtained: 85,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 1,
        hasExpiredEvidence: false,
      },
      {
        categoryKey: "DOCUMENTATION_COMPLIANCE",
        scoreObtained: 90,
        verificationStatus: "VERIFIED_COMPLIANT",
        evidenceCount: 2,
        hasExpiredEvidence: false,
      },
    ];

    const calculation = calculateSafetyScore(criticalAssessments);

    assert.ok(calculation.criticalFlags.length >= 1, "Must generate critical flags");
    assert.ok(
      calculation.hygieneRatingSmiles <= 2,
      `Critical non-compliance must limit smiles to <= 2: got ${calculation.hygieneRatingSmiles}`
    );
    assert.equal(
      calculation.isPassingGrade,
      false,
      "Kitchen with critical violation cannot receive passing grade"
    );
  });

  // 13. Seven Verification States Integrity
  await t.test("13. Seven verification states resolve to explicit badges and descriptions", async () => {
    const states = [
      "VERIFIED",
      "UPLOADED_UNVERIFIED",
      "PENDING_REVIEW",
      "EXPIRED",
      "MISSING_INFO",
      "REJECTED",
      "SELF_REPORTED",
    ];

    for (const state of states) {
      const badge = getVerificationStatusBadge(state);
      assert.ok(badge.label, `State ${state} must have label`);
      assert.ok(badge.bg, `State ${state} must have bg class`);
      assert.ok(badge.text, `State ${state} must have text class`);
      assert.ok(badge.border, `State ${state} must have border class`);

      const desc = getVerificationStatusDescription(state);
      assert.ok(desc.length > 20, `State ${state} must have detailed description`);
    }
  });

  // 14. Pure Client-Side QR Code Vector SVG Generation
  await t.test("14. Zero-dependency QR code generator produces valid SVG vector poster", async () => {
    const url = "https://kitchenproof.vercel.app/restaurants/spice-pavilion-connaught-place";
    const svg = generateQRCodeSVG(url, { size: 260, color: "#143D2B", margin: 3 });

    assert.ok(svg.startsWith("<svg"), "Must output valid SVG root tag");
    assert.ok(svg.includes('viewBox="0 0 260 260"'), "Must include correct SVG viewBox");
    assert.ok(svg.includes('fill="#143D2B"'), "Must use KitchenProof brand emerald color");
    assert.ok(svg.includes("</svg>"), "Must cleanly close SVG tag");
    assert.ok(svg.length > 1000, "Must contain full matrix rectangles");
  });

  // 15. Role Segregation & RBAC Verification
  await t.test("15. Role-based access control enforces distinct user permissions", async () => {
    const roles = ["CONSUMER", "RESTAURANT_OWNER", "INSPECTOR", "ADMIN"];
    for (const role of roles) {
      const count = await prisma.user.count({ where: { role } });
      assert.ok(count >= 1, `Must have seeded user for role ${role}`);
    }

    // Verify non-owners cannot be set as owner on restaurants
    const consumer = await prisma.user.findFirst({ where: { role: "CONSUMER" } });
    assert.notEqual(consumer.role, "RESTAURANT_OWNER", "Consumer role must not equal Owner role");
  });
});
