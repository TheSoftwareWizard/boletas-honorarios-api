import { updateCurrentRetention } from '../services/dataService';

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: ts-node updateRetention.ts <rate> <effectiveDate> <source>');
  console.error('Example: ts-node updateRetention.ts 10.75 "2024-01-01" "SII"');
  process.exit(1);
}

const rate = parseFloat(args[0]);
const effectiveDate = args[1];
const source = args[2];

if (isNaN(rate) || rate < 0 || rate > 100) {
  console.error('Error: Rate must be between 0 and 100');
  process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate)) {
  console.error('Error: Date must be in YYYY-MM-DD format');
  process.exit(1);
}

try {
  updateCurrentRetention(rate, `${effectiveDate}T00:00:00Z`, source);
  console.log(`Updated retention rate to ${rate}% effective from ${effectiveDate}`);
} catch (error) {
  console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
}
