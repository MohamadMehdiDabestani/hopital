import Levenshtein from 'fast-levenshtein';

export interface LevenshteinTask {
  candidates: Array<{ rowId: string; inputRaw: string; inputName: string; compactInput: string }>;
  dbMedicines: string[];
}

export interface LevenshteinResult {
  rowId: string;
  input: string;
  suggestion: string;
}

self.onmessage = (e: MessageEvent<LevenshteinTask>) => {
  const { candidates, dbMedicines } = e.data;
  const result: LevenshteinResult[] = [];

  for (const candidate of candidates) {
    let bestMatch = '';
    let bestDistance = Infinity;

    for (const med of dbMedicines) {
      const compactMed = med.replace(/\s/g, '');
      const distance = Levenshtein.get(candidate.compactInput, compactMed);

      if (distance < bestDistance) {
        bestDistance = distance;
        bestMatch = med;
      }
    }

    if (bestDistance <= 3 && bestMatch) {
      result.push({
        rowId: candidate.rowId,
        input: candidate.inputRaw,
        suggestion: bestMatch,
      });
    }
  }

  self.postMessage(result);
};
