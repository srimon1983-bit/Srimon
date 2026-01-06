
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface ExposurePoint {
  clauseTitle: string;
  originalText: string;
  riskLevel: RiskLevel;
  impactOnBuyer: string;
  impactOnSeller: string;
  suggestedRevision: string;
  explanation: string;
}

export interface ContractAnalysis {
  contractTitle: string;
  jurisdiction: string;
  overallRiskScore: number; // 0-100
  summary: string;
  buyerExposureSummary: string;
  sellerExposureSummary: string;
  exposures: ExposurePoint[];
  missingClauses: string[];
}

export interface SpottedError {
  location: string;
  description: string;
  severity: 'Minor' | 'Major' | 'Critical';
}

export interface SuggestedImprovement {
  originalClause: string;
  suggestedChange: string;
  benefit: string;
}

export interface ComparisonResult {
  summary: string;
  crossContractExposures: {
    category: string;
    findings: {
      contractName: string;
      riskLevel: RiskLevel;
      summary: string;
    }[];
    winner: string; 
    recommendation: string;
  }[];
  holisticExposureForParties: {
    party: string;
    exposureLevel: string;
    criticalWarning: string;
  }[];
  conflictAlerts: string[];
  spottedErrors: SpottedError[];
  suggestedImprovements: SuggestedImprovement[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: ContractAnalysis | null;
}

export interface ComparisonState {
  isLoading: boolean;
  error: string | null;
  result: ComparisonResult | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
