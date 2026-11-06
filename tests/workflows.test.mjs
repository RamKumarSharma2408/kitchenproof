import test from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { calculateSafetyScore } from "../src/lib/scoring.ts";

const prisma = new PrismaClient();

test("KitchenProof Core Verification & Workflow Test Suite", async (t) => {
  let testConsumerId;
  let testOwnerId;
  let testInspectorId;
  let testRestaurantId;
  let testDocId;

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

  await t.test("2. Consumer searches for kitchens across cities and cuisines", async () => {
    const results = await prisma.restaurant.findMany({
      where: {
        city: "Bengaluru",
      },
    });

    assert.ok(results.length >= 1, "Should find at least 1 restaurant in Bengaluru");
    assert.ok(results[0].name, "Restaurant must have a name");
  });

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

  await t.test("4. Consumer saves and unsaves a kitchen", async () => {
    // Save
    const saved = await prisma.savedRestaurant.create({
      data: {
        userId: testConsumerId,
        restaurantId: testRestaurantId,
      },
    });
    assert.ok(saved.id, "Kitchen should be saved");

    // Check query
    const count = await prisma.savedRestaurant.count({
      where: { userId: testConsumerId },
    });
    assert.equal(count, 1);

    // Delete
    await prisma.savedRestaurant.delete({
      where: { id: saved.id },
    });
    const countAfter = await prisma.savedRestaurant.count({
      where: { userId: testConsumerId },
    });
    assert.equal(countAfter, 0);
  });

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
        verificationStatus: "PENDING_VERIFICATION", // Must start unverified!
        issueDate: new Date(),
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      },
    });

    assert.ok(doc.id);
    assert.equal(doc.verificationStatus, "PENDING_VERIFICATION");
    testDocId = doc.id;
  });

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

  await t.test("8 & 9. Inspector records inspection & safety score recalculates correctly", async () => {
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

    // Mathematical verification:
    // 92*0.25 = 23.0
    // 88*0.25 = 22.0
    // 85*0.15 = 12.75
    // 90*0.15 = 13.5
    // 95*0.20 = 19.0
    // Total = 90.25 -> rounded = 90
    assert.equal(calculation.overallScore, 90, "Overall score should be exactly 90");
    assert.equal(calculation.hygieneRatingSmiles, 5, "Score >= 85 must receive 5 Smiles");
    assert.equal(calculation.dataConfidenceScore, 100, "All verified evidence yields 100% confidence");
    assert.equal(calculation.isPassingGrade, true, "Should pass grade");
  });

  await t.test("10. Security & role boundaries: unverified claims cap score", async () => {
    // If evidence is unverified / self-reported, the engine must cap and penalise confidence
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

    // Even though raw scores were 95, unverified status caps individual categories to 50, missing to 0
    assert.ok(
      calculation.overallScore <= 50,
      `Unverified kitchen must not score high: got ${calculation.overallScore}`
    );
    assert.ok(
      calculation.dataConfidenceScore <= 40,
      `Unverified data confidence must be low: got ${calculation.dataConfidenceScore}`
    );
  });
});
