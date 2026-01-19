import * as fs from 'fs';
import * as path from 'path';
import { RetentionRate } from '../types';

interface RetentionRatesData {
  current: {
    rate: number;
    effectiveDate: string;
    source: string;
    lastUpdated: string;
  };
  history: RetentionRate[];
}

const dataDir = path.join(__dirname, '../../data');
const retentionRatesPath = path.join(dataDir, 'retention-rates.json');

function readRetentionRates(): RetentionRatesData {
  try {
    const content = fs.readFileSync(retentionRatesPath, 'utf-8');
    return JSON.parse(content) as RetentionRatesData;
  } catch (error) {
    throw new Error(`Failed to read retention rates: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function getCurrentRetention() {
  const data = readRetentionRates();
  return {
    rate: data.current.rate,
    effectiveDate: data.current.effectiveDate,
    source: data.current.source,
    lastUpdated: data.current.lastUpdated,
    metadata: {
      currency: 'CLP',
      description: 'Chilean Peso withholding rate for professional service invoices (boletas de honorarios)'
    }
  };
}

export function getRetentionHistory(): RetentionRate[] {
  return readRetentionRates().history;
}

export function updateCurrentRetention(rate: number, effectiveDate: string, source: string): void {
  try {
    const data = readRetentionRates();
    const now = new Date().toISOString();
    const currentYear = new Date(effectiveDate).getFullYear();
    
    data.current = { rate, effectiveDate, source, lastUpdated: now };

    const existingIndex = data.history.findIndex(h => h.year === currentYear);
    const entry = { year: currentYear, rate, effectiveDate, source, lastUpdated: now };

    if (existingIndex >= 0) {
      data.history[existingIndex] = entry;
    } else {
      data.history.push(entry);
      data.history.sort((a, b) => b.year - a.year);
    }

    fs.writeFileSync(retentionRatesPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    throw new Error(`Failed to update retention rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
