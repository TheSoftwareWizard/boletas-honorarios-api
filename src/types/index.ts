export interface RetentionRate {
  year: number;
  rate: number;
  effectiveDate: string;
  source: string;
  lastUpdated: string;
}

export interface CurrentRetentionResponse {
  rate: number;
  effectiveDate: string;
  source: string;
  lastUpdated: string;
  metadata: {
    currency: string;
    description: string;
  };
}

export interface RetentionHistoryResponse {
  rates: RetentionRate[];
  total: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    timestamp: string;
  };
}
