/**
 * KitchenProof Explainable Safety Scoring Engine
 * Methodology Version: 1.2.0 (November 2026)
 *
 * Grounded in Codex Alimentarius (General Principles of Food Hygiene)
 * and FSSAI Schedule 4 (General Hygienic and Sanitary Practices).
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

export interface CategoryAssessmentInput {
  categoryKey: string;
  scoreObtained: number; // 0-100
  verificationStatus:
    | "VERIFIED_COMPLIANT"
    | "MINOR_NON_COMPLIANCE"
    | "CRITICAL_NON_COMPLIANCE"
    | "UNVERIFIED"
    | "MISSING_EVIDENCE"
    | "EXPIRED_EVIDENCE";
  evidenceCount: number;
  hasExpiredEvidence: boolean;
}

export interface ScoreCalculationResult {
  overallScore: number; // 0-100
  dataConfidenceScore: number; // 0-100
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
  methodologyVersion: string;
  isPassingGrade: boolean;
}

export function calculateSafetyScore(
  assessments: CategoryAssessmentInput[]
): ScoreCalculationResult {
  let totalWeightedScore = 0;
  let totalConfidenceWeighted = 0;
  let totalWeightEvaluated = 0;
  const criticalFlags: string[] = [];

  const categoryBreakdown = Object.values(SCORING_CATEGORIES).map((catConfig) => {
    const assessment = assessments.find((a) => a.categoryKey === catConfig.key);

    let rawScore = 0;
    let verificationStatus = "MISSING_EVIDENCE";
    let evidenceConfidence = 0;

    if (assessment) {
      verificationStatus = assessment.verificationStatus;
      rawScore = Math.max(0, Math.min(100, assessment.scoreObtained));

      // Calculate confidence based on evidence quality
      if (assessment.verificationStatus === "VERIFIED_COMPLIANT") {
        evidenceConfidence = 100;
      } else if (assessment.verificationStatus === "MINOR_NON_COMPLIANCE") {
        evidenceConfidence = 90;
      } else if (assessment.verificationStatus === "CRITICAL_NON_COMPLIANCE") {
        evidenceConfidence = 100; // Certainty of violation
        criticalFlags.push(`Critical violation identified in ${catConfig.name}`);
      } else if (assessment.verificationStatus === "EXPIRED_EVIDENCE") {
        evidenceConfidence = 30; // Depleted confidence due to outdated data
        rawScore = Math.min(rawScore, 40); // Cap score on expired evidence
      } else if (assessment.verificationStatus === "UNVERIFIED") {
        evidenceConfidence = 40; // Self-reported claim only
        rawScore = Math.min(rawScore, 50); // Cap unverified claims
      } else {
        evidenceConfidence = 0;
        rawScore = 0;
      }
    }

    const weightedContribution = (rawScore * catConfig.weightPercent) / 100;
    totalWeightedScore += weightedContribution;
    totalConfidenceWeighted += (evidenceConfidence * catConfig.weightPercent) / 100;
    totalWeightEvaluated += catConfig.weightPercent;

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

  const finalScore = Math.round(totalWeightedScore);
  const dataConfidenceScore = Math.round(totalConfidenceWeighted);

  // Convert to FSSAI equivalent 1 to 5 smiles
  let hygieneRatingSmiles = 1;
  if (finalScore >= 85) hygieneRatingSmiles = 5;
  else if (finalScore >= 75) hygieneRatingSmiles = 4;
  else if (finalScore >= 60) hygieneRatingSmiles = 3;
  else if (finalScore >= 45) hygieneRatingSmiles = 2;
  else hygieneRatingSmiles = 1;

  // Penalise smiles if critical flags exist
  if (criticalFlags.length > 0 && hygieneRatingSmiles > 2) {
    hygieneRatingSmiles = 2;
  }

  return {
    overallScore: finalScore,
    dataConfidenceScore,
    hygieneRatingSmiles,
    categoryBreakdown,
    criticalFlags,
    methodologyVersion: "1.2.0",
    isPassingGrade: finalScore >= 65 && criticalFlags.length === 0,
  };
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "VERIFIED_COMPLIANT":
      return "Verified Compliant";
    case "MINOR_NON_COMPLIANCE":
      return "Minor Non-Compliance (Rectification in Progress)";
    case "CRITICAL_NON_COMPLIANCE":
      return "Critical Non-Compliance";
    case "EXPIRED_EVIDENCE":
      return "Audit Documentation Expired";
    case "UNVERIFIED":
      return "Self-Reported (Pending Inspection)";
    case "MISSING_EVIDENCE":
    default:
      return "No Evidence Submitted";
  }
}
