import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { FeedbackPanel } from '@/components/FeedbackPanel';
import { HintToggle } from '@/components/HintToggle';
import type { OrderLinesStep } from '@/types';

interface OrderLinesExerciseProps {
  step: OrderLinesStep;
  onSolved: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // Ensure it's not the same as the correct order
  if (a.length > 1 && a.every((v, i) => v === arr[i])) {
    return shuffle(arr);
  }
  return a;
}

export function OrderLinesExercise({ step, onSolved }: OrderLinesExerciseProps) {
  const [lines, setLines] = useState<string[]>(() => shuffle(step.lines));
  const [submitted, setSubmitted] = useState(false);

  const correct = lines.every((l, i) => l === step.lines[i]);

  function move(idx: number, dir: -1 | 1) {
    const next = [...lines];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setLines(next);
  }

  return (
    <div>
      <h3 className="lesson-card-title">Ordene as linhas</h3>
      <div className="markdown-content" style={{ marginBottom: '1rem' }}>
        <p>{step.prompt}</p>
      </div>

      <div className="order-lines-list">
        {lines.map((line, idx) => (
          <div key={idx} className="order-line-item">
            <span style={{ color: 'var(--text-muted)', fontWeight: 700, minWidth: '1.5rem' }}>
              {idx + 1}.
            </span>
            <span className="flex-1">{line}</span>
            <div className="order-line-controls">
              <button
                className="order-line-btn"
                onClick={() => move(idx, -1)}
                disabled={idx === 0 || submitted}
              >
                <ArrowUp size={14} />
              </button>
              <button
                className="order-line-btn"
                onClick={() => move(idx, 1)}
                disabled={idx === lines.length - 1 || submitted}
              >
                <ArrowDown size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {step.hint && <HintToggle hint={step.hint} />}

      {submitted && (
        <div className="mt-4">
          <FeedbackPanel
            correct={correct}
            message={
              correct
                ? 'Ordem correta!'
                : `Ordem correta:\n${step.lines.map((l, i) => `${i + 1}. ${l}`).join('\n')}`
            }
          />
        </div>
      )}

      {!submitted && (
        <div className="lesson-footer">
          <span />
          <button
            className="btn btn-primary"
            onClick={() => {
              setSubmitted(true);
              onSolved(correct);
            }}
          >
            Verificar
          </button>
        </div>
      )}
    </div>
  );
}