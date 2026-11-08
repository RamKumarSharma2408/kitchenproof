/**
 * KitchenProof Explainable Safety Scoring Engine
 * Methodology Version: 2.0.0 (November 2026)
 *
 * Grounded in Codex Alimentarius (General Principles of Food Hygiene)
 * and FSSAI Schedule 4 (General Hygienic and Sanitary Practices).
 *
 * Features:
 * - Evidence-aware scoring with explicit provenance & expiry penalties
 * - Critical Control Gates (capping overall score on statutory/hygiene failure)
 * - Decoupled numerical safety score (0-100) and Verification Level
 * - Evidence Completeness metric replacing ambiguous confidence percentages
 */

export interface ScoringCategoryConfig {
  key: string;
  name: string;
  weightPercent: number; // Sum = 100
  description: string;
  statutoryBasis: string;
  defaultCriteria: string[];
}

export const SCORING_CATEGORIES: Record<string, ScoringCategoryConfig> = {
  HYGIENE_SANITATION: {
    key: "HYGIENE_SANITATION",
    name: "Hygiene & Sanitation",
    weightPercent: 25,
    description:
      "Cleanliness of food preparation surfaces, ventilation hoods, grease traps, potable water testing, and scheduled deep sanitization.",
    statutoryBasis: "FSSAI Schedule 4, Part II, Section 1 & 4 (Sanitary Requirements)",
    defaultCriteria: [
      "Potable water tested to IS 10500 standards within the past 6 months",
      "Food contact surfaces sanitised with food-grade disinfectants",
      "Handwashing stations equipped with sensor/elbow taps, soap, and disposable towels",
      "Floor drainage covered with stainless steel grease-trapping grates",
    ],
  },
  FOOD_HANDLING: {
    key: "FOOD_HANDLING",
    name: "Food Handling Practices",
    weightPercent: 25,
    description:
      "Segregation of raw and cooked food, color-coded cutting boards, allergen control, personal protective gear (hairnets, aprons, gloves), and handler health certification.",
    statutoryBasis: "FSSAI Schedule 4, Part II, Section 5 & 8 (Personal Hygiene & Processing)",
    defaultCriteria: [
      "Medical fitness certificates (Form IX) verified for all food handlers",
      "Dedicated color-coded knives and chopping boards for raw meats and vegetarian foods",
      "Cooked food held above 60°C or blast-chilled within 2 hours",
      "No food items stored directly on the floor; min 15 cm clearance maintained",
    ],
  },
  PEST_MANAGEMENT: {
    key: "PEST_MANAGEMENT",
    name: "Pest Management",
    weightPercent: 15,
    description:
      "Active pest control contract with licensed agency, fly killer / insect light traps, rodent bait stations outside kitchen, and gap-free weather-stripping on doors.",
    statutoryBasis: "FSSAI Schedule 4, Part II, Section 3 (Pest Control Systems)",
    defaultCriteria: [
      "Monthly pest management contract and chemical application log sheets verified",
      "Electronic insect killer units functional and positioned away from open food",
      "Mesh screens (wire gauge 16 or finer) on all external windows and intake vents",
      "Zero evidence of rodent activity, droppings, or cockroach infestation",
    ],
  },
  TEMPERATURE_CONTROL: {
    key: "TEMPERATURE_CONTROL",
    name: "Temperature Control & Cold Chain",
    weightPercent: 15,
    description:
      "Calibrated temperature logging for walk-in chillers (≤ 4°C), deep freezers (≤ -18°C), digital probe thermometers for cooked food (core ≥ 75°C).",
    statutoryBasis: "FSSAI Schedule 4, Part II, Section 6 (Cold Storage & Temperature Monitoring)",
    defaultCriteria: [
      "Twice-daily logged temperature chart for chillers and freezers with digital display",
      "Calibrated core food thermometers available and sanitised between probes",
      "Defrosting done under refrigeration or in continuous running cold water, never at room temperature",
      "Power backup (DG/UPS) connected to refrigeration units to prevent temperature spikes",
    ],
  },
  DOCUMENTATION_COMPLIANCE: {
    key: "DOCUMENTATION_COMPLIANCE",
    name: "Documentation & Regulatory Compliance",
    weightPercent: 20,
    description:
      "Valid FSSAI license prominently displayed on purple Food Safety Display Board, FoSTaC certified supervisor on premises, oil polar compound testing records, and audit history.",
    statutoryBasis: "Food Safety and Standards Act 2006, Section 31 (Licensing and Registration)",
    defaultCriteria: [
      "Active FSSAI license or registration certificate with validity exceeding 60 days",
      "Purple Food Safety Display Board (FSDB) mounted at customer & kitchen entrance",
      "FoSTaC trained Food Safety Supervisor certificate verified",
      "Used Cooking Oil (UCO) Total Polar Compounds (TPC) logged (< 25%) and RUCO collection",
    ],
  },
};

export type EvidenceVerificationStatus =
  | "INDEPENDENTLY_VERIFIED"
  | "VERIFIED_AT_SOURCE"
  | "VERIFIED_COMPLIANT"
  | "MINOR_NON_COMPLIANCE"
  | "CRITICAL_NON_COMPLIANCE"
  | "UPLOADED_UNREVIEWED"
  | "EXPIRED_EVIDENCE"
  | "UNVERIFIED"
  | "MISSING_EVIDENCE"
  | "REJECTED";

export interface CategoryAssessmentInput {
  categoryKey: string;
  scoreObtained: number; // 0-100
  verificationStatus: EvidenceVerificationStatus;
  evidenceCount?: number;
  hasExpiredEvidence?: boolean;
  isStatutoryLicenseMissing?: boolean;
  isPestInfestationPresent?: boolean;
  isWaterNonPotable?: boolean;
  isColdChainBreached?: boolean;
}

export type VerificationLevel =
  | "FULLY_VERIFIED"
  | "CONDITIONALLY_VERIFIED"
  | "ACTION_REQUIRED"
  | "SELF_REPORTED"
  | "UNVERIFIED";

export type PerformanceBand =
  | "EXCELLENT"
  | "GOOD"
  | "MODERATE"
  | "NEEDS_IMPROVEMENT"
  | "CRITICAL_RISK";

export interface ScoreCalculationResult {
  overallScore: number; // 0-100
  numericalScore: number; // 0-100 (alias)
  evidenceCompleteness: number; // 0-100 (% of required statutory/hygiene items backed by verifiable evidence)
  dataConfidenceScore: number; // Kept for backwards compatibility (0-100)
  verificationLevel: VerificationLevel;
  performanceBand: PerformanceBand;
  hygieneRatingSmiles: number; // 1-5 (equivalent to FSSAI rating smiles)
  categoryBreakdown: {
    key: string;
    name: string;
    weightPercent: number;
    scoreObtained: number;
    weightedContribution: number;
    verificationStatus: string;
    statusLabel: string;
    evidenceConfidence: number;
  }[];
  criticalFlags: string[];
  appliedGates: string[];
  methodologyVersion: string;
  isPassingGrade: boolean;
}

export function calculateSafetyScore(
  assessments: CategoryAssessmentInput[]
): ScoreCalculationResult {
  let totalWeightedScore = 0;
  let totalCompletenessWeighted = 0;
  const criticalFlags: string[] = [];
  const appliedGates: string[] = [];

  let hasExpired = false;
  let hasUnverified = false;
  let allFullyVerified = true;

  // Track critical gate conditions
  let licenseMissing = false;
  let pestInfested = false;
  let waterUnsafe = false;
  let coldChainFailed = false;

  const categoryBreakdown = Object.values(SCORING_CATEGORIES).map((catConfig) => {
    const assessment = assessments.find((a) => a.categoryKey === catConfig.key);

    let rawScore = 0;
    let verificationStatus: EvidenceVerificationStatus = "MISSING_EVIDENCE";
    let evidenceConfidence = 0;

    if (assessment) {
      verificationStatus = assessment.verificationStatus;
      rawScore = Math.max(0, Math.min(100, assessment.scoreObtained));

      // Check explicit flags
      if (assessment.isStatutoryLicenseMissing) licenseMissing = true;
      if (assessment.isPestInfestationPresent) pestInfested = true;
      if (assessment.isWaterNonPotable) waterUnsafe = true;
      if (assessment.isColdChainBreached) coldChainFailed = true;

      // Handle evidence types and confidence weighting
      switch (assessment.verificationStatus) {
        case "INDEPENDENTLY_VERIFIED":
          evidenceConfidence = 100;
          break;
        case "VERIFIED_AT_SOURCE":
          evidenceConfidence = 95;
          break;
        case "VERIFIED_COMPLIANT":
          evidenceConfidence = 100;
          break;
        case "MINOR_NON_COMPLIANCE":
          evidenceConfidence = 90;
          break;
        case "CRITICAL_NON_COMPLIANCE":
          evidenceConfidence = 100; // Certainty of violation
          criticalFlags.push(`Critical non-compliance detected in ${catConfig.name}`);
          if (catConfig.key === "PEST_MANAGEMENT") pestInfested = true;
          if (catConfig.key === "HYGIENE_SANITATION") waterUnsafe = true;
          if (catConfig.key === "TEMPERATURE_CONTROL") coldChainFailed = true;
          if (catConfig.key === "DOCUMENTATION_COMPLIANCE") licenseMissing = true;
          break;
        case "UPLOADED_UNREVIEWED":
          evidenceConfidence = 35;
          rawScore = Math.min(rawScore, 30); // Operator upload capped
          hasUnverified = true;
          allFullyVerified = false;
          break;
        case "EXPIRED_EVIDENCE":
          evidenceConfidence = 20; // Degraded validity
          rawScore = Math.min(rawScore, 25); // Heavy expiry penalty
          hasExpired = true;
          allFullyVerified = false;
          criticalFlags.push(`Expired audit documentation in ${catConfig.name}`);
          break;
        case "UNVERIFIED":
          evidenceConfidence = 30; // Self-reported claim only
          rawScore = Math.min(rawScore, 40); // Cap unverified claims
          hasUnverified = true;
          allFullyVerified = false;
          break;
        case "REJECTED":
          evidenceConfidence = 0;
          rawScore = 0;
          allFullyVerified = false;
          criticalFlags.push(`Documentation rejected for ${catConfig.name}`);
          break;
        case "MISSING_EVIDENCE":
        default:
          evidenceConfidence = 0;
          rawScore = 0;
          allFullyVerified = false;
          break;
      }
    } else {
      allFullyVerified = false;
    }

    const weightedContribution = (rawScore * catConfig.weightPercent) / 100;
    totalWeightedScore += weightedContribution;
    totalCompletenessWeighted += (evidenceConfidence * catConfig.weightPercent) / 100;

    return {
      key: catConfig.key,
      name: catConfig.name,
      weightPercent: catConfig.weightPercent,
      scoreObtained: Math.round(rawScore),
      weightedContribution: parseFloat(weightedContribution.toFixed(1)),
      verificationStatus,
      statusLabel: getStatusLabel(verificationStatus),
      evidenceConfidence: Math.round(evidenceConfidence),
    };
  });

  let finalScore = Math.round(totalWeightedScore);
  const evidenceCompleteness = Math.round(totalCompletenessWeighted);

  // CRITICAL GATES: Cap scores regardless of other high category scores
  if (licenseMissing) {
    if (finalScore > 40) {
      appliedGates.push("Missing / Invalid Statutory License: Overall score capped at 40 (Fail)");
      finalScore = 40;
    }
  }

  if (pestInfested) {
    if (finalScore > 45) {
      appliedGates.push("Active Pest Infestation / Critical Pest Violation: Overall score capped at 45 (Fail)");
      finalScore = 45;
    }
  }

  if (waterUnsafe) {
    if (finalScore > 40) {
      appliedGates.push("Non-Potable Water Supply / IS 10500 Failure: Overall score capped at 40 (Fail)");
      finalScore = 40;
    }
  }

  if (coldChainFailed) {
    if (finalScore > 45) {
      appliedGates.push("Severe Cold Chain Breach (>10°C in chillers): Overall score capped at 45 (Fail)");
      finalScore = 45;
    }
  }

  // Determine Verification Level
  let verificationLevel: VerificationLevel = "UNVERIFIED";
  if (licenseMissing || pestInfested || waterUnsafe || appliedGates.length > 0) {
    verificationLevel = "ACTION_REQUIRED";
  } else if (hasExpired) {
    verificationLevel = finalScore >= 70 ? "CONDITIONALLY_VERIFIED" : "ACTION_REQUIRED";
  } else if (allFullyVerified && assessments.length >= 5) {
    verificationLevel = "FULLY_VERIFIED";
  } else if (hasUnverified) {
    verificationLevel = "SELF_REPORTED";
  } else {
    verificationLevel = "UNVERIFIED";
  }

  // Determine Performance Band
  let performanceBand: PerformanceBand = "CRITICAL_RISK";
  if (finalScore >= 85) performanceBand = "EXCELLENT";
  else if (finalScore >= 70) performanceBand = "GOOD";
  else if (finalScore >= 55) performanceBand = "MODERATE";
  else if (finalScore >= 40) performanceBand = "NEEDS_IMPROVEMENT";
  else performanceBand = "CRITICAL_RISK";

  // Convert to FSSAI equivalent 1 to 5 smiles
  let hygieneRatingSmiles = 1;
  if (finalScore >= 85) hygieneRatingSmiles = 5;
  else if (finalScore >= 75) hygieneRatingSmiles = 4;
  else if (finalScore >= 60) hygieneRatingSmiles = 3;
  else if (finalScore >= 45) hygieneRatingSmiles = 2;
  else hygieneRatingSmiles = 1;

  // Penalise smiles if critical flags or gates exist
  if ((criticalFlags.length > 0 || appliedGates.length > 0) && hygieneRatingSmiles > 2) {
    hygieneRatingSmiles = 2;
  }
  if (licenseMissing && hygieneRatingSmiles > 1) {
    hygieneRatingSmiles = 1;
  }

  const isPassingGrade =
    finalScore >= 65 && criticalFlags.length === 0 && appliedGates.length === 0 && !licenseMissing;

  return {
    overallScore: finalScore,
    numericalScore: finalScore,
    evidenceCompleteness,
    dataConfidenceScore: evidenceCompleteness, // Backward compatibility
    verificationLevel,
    performanceBand,
    hygieneRatingSmiles,
    categoryBreakdown,
    criticalFlags,
    appliedGates,
    methodologyVersion: "2.0.0",
    isPassingGrade,
  };
}

function getStatusLabel(status: EvidenceVerificationStatus | string): string {
  switch (status) {
    case "INDEPENDENTLY_VERIFIED":
      return "Independently Verified (Third-Party Audit)";
    case "VERIFIED_AT_SOURCE":
      return "Verified at Official Statutory Source";
    case "VERIFIED_COMPLIANT":
      return "Verified Compliant";
    case "MINOR_NON_COMPLIANCE":
      return "Minor Non-Compliance (Rectification in Progress)";
    case "CRITICAL_NON_COMPLIANCE":
      return "Critical Non-Compliance (Action Required)";
    case "UPLOADED_UNREVIEWED":
      return "Uploaded by Operator (Pending Third-Party Review)";
    case "EXPIRED_EVIDENCE":
      return "Audit Documentation Expired";
    case "UNVERIFIED":
      return "Self-Reported (Unverified)";
    case "REJECTED":
      return "Rejected / Invalid Evidence";
    case "MISSING_EVIDENCE":
    default:
      return "No Evidence Submitted";
  }
}
