
export interface ValidationControl {
  id: string;
  title: string;
  description: string;
  evidenceExpected: string;
  acceptableExamples: string;
  badExamples: string;
  implementationSuggestions: string;
  evidenceTypes: string[];
  category: string;
}
