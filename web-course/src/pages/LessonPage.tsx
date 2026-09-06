import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Heart, Trophy, Home, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const REMARK_PLUGINS = [remarkGfm];
import type { LessonStep, Lesson } from '@/types';
import { getLessonById } from '@/curriculum/lessons';
import { tracks } from '@/curriculum/tracks';
import { achievements } from '@/curriculum/achievements';
import { useProgress } from '@/hooks/useProgress';
import { usePyodide } from '@/hooks/usePyodide';
import { Quiz } from '@/components/Quiz';
import { CodeExercise } from '@/components/CodeExercise';
import { FillBlankExercise } from '@/components/FillBlankExercise';
import { OrderLinesExercise } from '@/components/OrderLinesExercise';
import { PredictOutputExercise } from '@/components/PredictOutputExercise';
import { FeedbackPanel } from '@/components/FeedbackPanel';

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { progress, completeLesson, updateLessonStepProgress, checkAchievements } = useProgress();
  const { status: pyodideStatus } = usePyodide();

  const [lesson, setLesson] = useState<Lesson | undefined>(() =>
    lessonId ? getLessonById(lessonId) : undefined,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  // Re-fetch lesson if lessonId changes or lessons load after initial render
  useEffect(() => {
    if (lessonId) {
      const l = getLessonById(lessonId);
      setLesson(l);
      setStepIndex(0);
      setStepResults([]);
      setShowCompletion(false);
    }
  }, [lessonId]);

  const track = lesson ? tracks.find((t) => t.id === lesson.trackId) : undefined;

  const handleStepSolved = useCallback(
    (correct: boolean) => {
      setStepResults((prev) => {
        const next = [...prev];
        next[stepIndex] = correct;
        return next;
      });

      if (lesson) {
        updateLessonStepProgress(lesson.id, stepIndex + 1, lesson.steps.length);
      }
    },
    [stepIndex, lesson, updateLessonStepProgress],
  );

  const handleNext = useCallback(() => {
    if (!lesson) return;
    if (stepIndex < lesson.steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      // Lesson complete
      const allCorrect = stepResults.every(Boolean);
      if (lesson && !progress.completedLessons.includes(lesson.id)) {
        completeLesson(lesson.id, lesson.xp, lesson.steps.length);
        checkAchievements(achievements);
      }
      setShowCompletion(true);
    }
  }, [lesson, stepIndex, stepResults, progress.completedLessons, completeLesson, checkAchievements]);

  const handleRetry = useCallback(() => {
    setStepIndex(0);
    setStepResults([]);
    setShowCompletion(false);
  }, []);

  if (!lesson) {
    return (
      <div className="lesson-page">
        <div className="lesson-header">
          <Link to="/trilhas" className="lesson-back-btn">
            <ArrowLeft size={18} /> Trilhas
          </Link>
        </div>
        <div className="lesson-body">
          <div className="lesson-card text-center">
            <h2>Lição não encontrada</h2>
            <p className="text-muted mb-4">
              A lição "{lessonId}" não está disponível. Ela pode estar em desenvolvimento.
            </p>
            <Link to="/trilhas" className="btn btn-primary">
              <ArrowLeft size={18} /> Voltar para trilhas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showCompletion) {
    const allCorrect = stepResults.every(Boolean);
    return (
      <div className="lesson-page">
        <div className="lesson-body">
          <div className="lesson-card text-center">
            <div
              className="icon-shape icon-shape-lg mx-auto mb-4"
              style={{
                background: allCorrect ? 'rgba(9,200,44,0.1)' : 'rgba(255,180,0,0.1)',
                color: allCorrect ? 'var(--success)' : 'var(--gold)',
              }}
            >
              <Trophy size={32} />
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {allCorrect ? 'Lição Concluída!' : 'Lição Concluída!'}
            </h1>
            <p className="text-muted mb-4">
              Você ganhou <strong style={{ color: 'var(--gold)' }}>+{lesson.xp} XP</strong> e completou
              {' '}{lesson.steps.length} etapas.
            </p>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="stat-number" style={{ fontSize: '1.75rem', color: 'var(--gold)' }}>
                  +{lesson.xp}
                </div>
                <div className="stat-label">XP</div>
              </div>
              <div className="text-center">
                <div className="stat-number" style={{ fontSize: '1.75rem', color: 'var(--success)' }}>
                  {stepResults.filter(Boolean).length}/{lesson.steps.length}
                </div>
                <div className="stat-label">Corretas</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              {track && (
                <Link to={`/trilha/${track.id}`} className="btn btn-outline">
                  <ArrowLeft size={18} /> Próxima lição
                </Link>
              )}
              <button className="btn btn-ghost" onClick={handleRetry}>
                <RotateCcw size={18} /> Repetir
              </button>
              <Link to="/" className="btn btn-primary">
                <Home size={18} /> Início
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const step: LessonStep = lesson.steps[stepIndex];
  const progressPct = ((stepIndex + (stepResults[stepIndex] ? 1 : 0)) / lesson.steps.length) * 100;
  const isExplanation = step.type === 'explanation';

  return (
    <div className="lesson-page">
      {/* Header with progress bar */}
      <div className="lesson-header">
        <Link to={track ? `/trilha/${track.id}` : '/trilhas'} className="lesson-back-btn">
          <ArrowLeft size={18} /> Sair
        </Link>
        <div className="lesson-progress-bar">
          <div className="lesson-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="lesson-hearts">
          <Heart size={18} fill="currentColor" />
          {Math.max(0, 3 - stepResults.filter((r) => r === false).length)}
        </div>
      </div>

      {/* Pyodide loading indicator */}
      {pyodideStatus === 'loading' && (
        <div className="pyodide-banner">
          <div className="spinner" />
          <span>Carregando Python no navegador...</span>
        </div>
      )}

      {/* Lesson body */}
      <div className="lesson-body">
        <div className="lesson-card">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="badge badge-muted">
              Etapa {stepIndex + 1} de {lesson.steps.length}
            </span>
            <span className="badge badge-teal" style={{ textTransform: 'capitalize' }}>
              {stepTypeLabel(step.type)}
            </span>
          </div>

          {/* Step content */}
          <div className="lesson-step-content">
            {renderStep(step, handleStepSolved)}
          </div>

          {/* Footer navigation */}
          {isExplanation && (
            <div className="lesson-footer">
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                Leitura e compreensão
              </span>
              <button className="btn btn-primary" onClick={handleNext}>
                Continuar
              </button>
            </div>
          )}

          {step.type !== 'explanation' && stepResults[stepIndex] !== undefined && (
            <div className="lesson-footer">
              <FeedbackPanel
                correct={stepResults[stepIndex]}
                title={stepResults[stepIndex] ? 'Correto!' : 'Incorreto'}
                message={
                  stepResults[stepIndex]
                    ? 'Você pode avançar para a próxima etapa.'
                    : 'Tente novamente ou avance.'
                }
              />
              <button className="btn btn-primary" onClick={handleNext}>
                {stepIndex < lesson.steps.length - 1 ? 'Próxima etapa' : 'Finalizar'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function stepTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    explanation: 'Explicação',
    code: 'Código',
    quiz: 'Quiz',
    'fill-blank': 'Lacunas',
    'order-lines': 'Ordenar',
    'predict-output': 'Prever Saída',
    'fix-bug': 'Corrigir Bug',
  };
  return labels[type] ?? type;
}

function renderStep(step: LessonStep, onSolved: (correct: boolean) => void) {
  switch (step.type) {
    case 'explanation':
      return (
        <div>
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>
              {step.content}
            </ReactMarkdown>
            {step.codeExample && (
              <pre>
                <code>{step.codeExample}</code>
              </pre>
            )}
          </div>
        </div>
      );

    case 'quiz':
      return (
        <Quiz
          question={step.question}
          options={step.options}
          answer={step.answer}
          explanation={step.explanation}
          onAnswered={onSolved}
        />
      );

    case 'code':
    case 'fix-bug':
      return <CodeExercise step={step} onSolved={onSolved} />;

    case 'fill-blank':
      return <FillBlankExercise step={step} onSolved={onSolved} />;

    case 'order-lines':
      return <OrderLinesExercise step={step} onSolved={onSolved} />;

    case 'predict-output':
      return <PredictOutputExercise step={step} onSolved={onSolved} />;

    default:
      return <p>Tipo de etapa não suportado.</p>;
  }
}