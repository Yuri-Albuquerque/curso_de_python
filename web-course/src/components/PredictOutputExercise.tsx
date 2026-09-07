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

  // Normaliza a resposta antes de comparar. Duas armadilhas reais:
  //  1. O código quase sempre termina numa expressão solta (sem `print`),
  //     e no Jupyter de verdade isso ecoa ENTRE ASPAS (repr do Python) —
  //     é natural o aluno digitar 'VALE3: R$ 60.00' ou "VALE3: R$ 60.00"
  //     mesmo quando `expectedOutput` guarda o texto sem aspas.
  //  2. Teclados móveis (iOS/Android) autocorrigem aspas retas para
  //     curvas (" " ' ') por padrão — sem isso, ninguém digitando no
  //     celular acerta um exercício com aspas.
  // Por isso removemos UM par de aspas envolvente, de qualquer tipo,
  // antes de comparar. Nenhuma das 31 respostas do curso espera aspas
  // de propósito, então isso nunca torna uma resposta errada em certa.
  const despar = (s: string) => {
    const t = s.trim().replace(/\s+/g, ' ');
    const par: Record<string, string> = { '"': '"', "'": "'", '“': '”', '‘': '’' };
    if (t.length >= 2 && par[t[0]] === t[t.length - 1]) {
      return t.slice(1, -1).trim();
    }
    return t;
  };
  const correct = despar(answer) === despar(step.expectedOutput);

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
          // A resposta é texto de código (Python), não prosa: autocorreção
          // de teclado móvel troca aspas retas por curvas e maiuscula a
          // primeira letra — os dois quebram uma comparação exata.
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
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