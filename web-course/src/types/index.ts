// Core domain types for the Python Economics course platform

// ===== Curriculum structure =====

export interface Track {
  id: string;
  title: string;
  description: string;
  icon: string;        // lucide icon name
  color: string;       // hex color for the track theme
  order: number;
  lessons: string[];   // lesson ids in order
}

export interface Module {
  id: string;
  trackId: string;
  title: string;
  description: string;
  order: number;
  lessons: string[];
}

// ===== Lesson definition =====

export type StepType =
  | 'explanation'
  | 'code'
  | 'quiz'
  | 'fill-blank'
  | 'order-lines'
  | 'predict-output'
  | 'fix-bug';

export interface TestCase {
  expression: string;   // Python expression to evaluate after running user code
  expected: string | number | boolean | null | (string | number | boolean)[];
  description?: string;
}

export interface BaseStep {
  id: string;
  type: StepType;
}

export interface ExplanationStep extends BaseStep {
  type: 'explanation';
  content: string;      // Markdown content
  codeExample?: string; // optional code block to show
}

export interface CodeStep extends BaseStep {
  type: 'code';
  prompt: string;       // instructions (Markdown)
  starterCode: string;
  tests: TestCase[];
  hint?: string;
}

export interface QuizStep extends BaseStep {
  type: 'quiz';
  question: string;
  options: string[];
  answer: number;       // index into options
  explanation?: string;
}

export interface FillBlankStep extends BaseStep {
  type: 'fill-blank';
  prompt: string;
  codeTemplate: string; // contains ___ for blanks
  blanks: string[];     // correct answers for each blank
  hint?: string;
}

export interface OrderLinesStep extends BaseStep {
  type: 'order-lines';
  prompt: string;
  lines: string[];      // correct order (will be shuffled for display)
  hint?: string;
}

export interface PredictOutputStep extends BaseStep {
  type: 'predict-output';
  prompt: string;
  code: string;
  expectedOutput: string;
  hint?: string;
}

export interface FixBugStep extends BaseStep {
  type: 'fix-bug';
  prompt: string;
  buggyCode: string;
  tests: TestCase[];
  hint?: string;
}

export type LessonStep =
  | ExplanationStep
  | CodeStep
  | QuizStep
  | FillBlankStep
  | OrderLinesStep
  | PredictOutputStep
  | FixBugStep;

export interface Lesson {
  id: string;
  trackId: string;
  moduleId?: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  xp: number;
  estimatedMinutes: number;
  prerequisites: string[];
  steps: LessonStep[];
}

// ===== Progress =====

export interface ProgressState {
  completedLessons: string[];
  xp: number;
  streak: number;
  lastActivityDate: string;   // ISO date string (date only, no time)
  achievements: string[];
  // Per-lesson progress for resume + spaced repetition
  lessonProgress: Record<string, {
    completedSteps: number;
    totalSteps: number;
    lastAttemptErrors?: string[];
  }>;
}

// ===== Achievements =====

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;       // lucide icon name
  condition: (progress: ProgressState) => boolean;
}

// ===== Pyodide runner =====

export interface RunResult {
  stdout: string;
  stderr: string;
  error: string | null;
  result: string | null;  // the value of the last expression if it's an expression
  testsPassed: boolean;
  testResults: TestResultItem[];
}

export interface TestResultItem {
  expression: string;
  passed: boolean;
  expected: string;
  actual: string;
}