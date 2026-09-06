import { useState } from 'react';
import { Loader2, RotateCcw, Play, CheckCircle2 } from 'lucide-react';
import { CodeEditor } from '@/components/CodeEditor';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { HintToggle } from '@/components/HintToggle';
import { usePyodide } from '@/hooks/usePyodide';
import type { CodeStep, FixBugStep, RunResult } from '@/types';

interface CodeExerciseProps {
  step: CodeStep | FixBugStep;
  onSolved: (correct: boolean) => void;
}

export function CodeExercise({ step, onSolved }: CodeExerciseProps) {
  const { status, runCode, isRunning } = usePyodide();
  const [code, setCode] = useState(step.type === 'fix-bug' ? step.buggyCode : step.starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [hasPassed, setHasPassed] = useState(false);

  const starterCode = step.type === 'fix-bug' ? step.buggyCode : step.starterCode;
  const tests = step.tests;

  async function handleRun() {
    const r = await runCode(code, tests);
    setResult(r);
    if (r.testsPassed) {
      setHasPassed(true);
      onSolved(true);
    }
  }

  function handleReset() {
    setCode(starterCode);
    setResult(null);
    setHasPassed(false);
  }

  return (
    <div>
      <h3 className="lesson-card-title">
        {step.type === 'fix-bug' ? 'Corrija o bug' : 'Escreva o código'}
      </h3>
      <div className="markdown-content" style={{ marginBottom: '1rem' }}>
        <p>{step.prompt}</p>
      </div>

      <CodeEditor
        value={code}
        onChange={setCode}
        onRun={handleRun}
        onReset={handleReset}
        result={result}
        isRunning={isRunning}
        disabled={hasPassed}
      />

      {status === 'loading' && (
        <div className="hint-box mt-2">
          <Loader2 size={16} className="spin" />
          <span>Carregando o interpretador Python no navegador...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="hint-box mt-2" style={{ background: 'rgba(230,57,70,0.06)', borderColor: 'rgba(230,57,70,0.2)' }}>
          <span>⚠️ Não foi possível carregar o Python. Verifique sua conexão.</span>
        </div>
      )}

      {step.hint && <HintToggle hint={step.hint} />}

      {hasPassed && (
        <div className="mt-4">
          <FeedbackPanel
            correct
            title="Parabéns!"
            message="Seu código passou em todos os testes."
          />
        </div>
      )}

      {result && !result.testsPassed && result.testResults.length > 0 && (
        <div className="mt-4">
          <FeedbackPanel
            correct={false}
            title="Nem todos os testes passaram"
            message="Revise o código e tente novamente."
          />
        </div>
      )}

      {!hasPassed && (
        <div className="lesson-footer">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            {status === 'ready' ? 'Pronto para executar' : status === 'loading' ? 'Carregando Python...' : ''}
          </span>
          <button
            className="btn btn-accent"
            onClick={handleRun}
            disabled={isRunning || status !== 'ready'}
          >
            {isRunning ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
            Executar código
          </button>
        </div>
      )}
    </div>
  );
}