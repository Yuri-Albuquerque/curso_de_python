import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { HintToggle } from '@/components/HintToggle';
import type { PredictOutputStep } from '@/types';

interface PredictOutputExerciseProps {
  step: PredictOutputStep;
  onSolved: (correct: boolean) => void;
}

export function PredictOutputExercise({ step, onSolved }: PredictOutputExerciseProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const normalize = (s: string) => s.trim().replace(/\s+/g, ' ');
  const correct =
    normalize(answer) === normalize(step.expectedOutput);

  function handleSubmit() {
    if (!answer.trim()) return;
    setSubmitted(true);
    onSolved(correct);
  }

  return (
    <div>
      <h3 className="lesson-card-title">Preveja a saída</h3>
      <div className="markdown-content" style={{ marginBottom: '1rem' }}>
        <p>{step.prompt}</p>
      </div>

      <div className="fill-blank-code">{step.code}</div>

      <div className="mt-4">
        <label className="badge badge-muted mb-2">Qual será a saída?</label>
        <textarea
          className="fill-blank-input"
          style={{
            width: '100%',
            minHeight: '5rem',
            display: 'block',
            padding: '0.75rem',
            borderRadius: 'var(--r-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
          }}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={submitted}
          placeholder="Digite a saída esperada..."
        />
      </div>

      {step.hint && <HintToggle hint={step.hint} />}

      {submitted && (
        <div className="mt-4">
          <FeedbackPanel
            correct={correct}
            message={
              correct
                ? 'Previsão correta!'
                : `Saída esperada: "${step.expectedOutput}"`
            }
          />
        </div>
      )}

      {!submitted && (
        <div className="lesson-footer">
          <span />
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!answer.trim()}
          >
            Verificar
          </button>
        </div>
      )}
    </div>
  );
}