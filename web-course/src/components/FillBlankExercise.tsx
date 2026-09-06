import { useState, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { HintToggle } from '@/components/HintToggle';
import type { FillBlankStep } from '@/types';

interface FillBlankExerciseProps {
  step: FillBlankStep;
  onSolved: (correct: boolean) => void;
}

export function FillBlankExercise({ step, onSolved }: FillBlankExerciseProps) {
  const [values, setValues] = useState<string[]>(() => step.blanks.map(() => ''));
  const [submitted, setSubmitted] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const parts = step.codeTemplate.split('___');

  const correctArray = step.blanks.map(
    (ans, i) => values[i].trim().toLowerCase() === ans.trim().toLowerCase(),
  );
  const allCorrect = correctArray.every(Boolean);

  function handleSubmit() {
    if (values.some((v) => v.trim() === '')) return;
    setSubmitted(true);
    onSolved(allCorrect);
  }

  return (
    <div>
      <h3 className="lesson-card-title">Preencha as lacunas</h3>
      <div className="markdown-content" style={{ marginBottom: '1rem' }}>
        <p>{step.prompt}</p>
      </div>

      <div className="fill-blank-code">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < step.blanks.length && (
              <input
                ref={(el) => { inputsRef.current[i] = el; }}
                className={`fill-blank-input${
                  submitted
                    ? correctArray[i]
                      ? ' correct'
                      : ' incorrect'
                    : ''
                }`}
                value={values[i]}
                onChange={(e) => {
                  const next = [...values];
                  next[i] = e.target.value;
                  setValues(next);
                }}
                disabled={submitted}
                placeholder="..."
                style={{
                  width: `${Math.max(step.blanks[i].length + 2, 6)}ch`,
                }}
              />
            )}
          </span>
        ))}
      </div>

      {step.hint && <HintToggle hint={step.hint} />}

      {submitted && (
        <div className="mt-4">
          <FeedbackPanel
            correct={allCorrect}
            message={
              allCorrect
                ? 'Todas as lacunas estão corretas!'
                : `Respostas esperadas: ${step.blanks.join(', ')}`
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
            disabled={values.some((v) => v.trim() === '')}
          >
            Verificar
          </button>
        </div>
      )}
    </div>
  );
}