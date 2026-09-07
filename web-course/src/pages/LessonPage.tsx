import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Trophy, Home, RotateCcw, RefreshCw } from 'lucide-react';
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
  const { progress, completeLesson, updateLessonStepProgress, checkAchievements } = useProgress();
  const { status: pyodideStatus } = usePyodide();

  const [lesson, setLesson] = useState<Lesson | undefined>(() =>
    lessonId ? getLessonById(lessonId) : undefined,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  // Review mode state
  const [reviewQueue, setReviewQueue] = useState<number[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewAnswered, setReviewAnswered] = useState(false);
  const [reviewCorrect, setReviewCorrect] = useState(false);
  const [reviewResolvedCount, setReviewResolvedCount] = useState(0);

  // Re-fetch lesson if lessonId changes or lessons load after initial render
  useEffect(() => {
    if (lessonId) {
      const l = getLessonById(lessonId);
      setLesson(l);
      setStepIndex(0);
      setStepResults([]);
      setShowCompletion(false);
      setReviewQueue([]);
      setReviewMode(false);
      setReviewIndex(0);
      setReviewAnswered(false);
      setReviewCorrect(false);
      setReviewResolvedCount(0);
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

  const handleReviewSolved = useCallback((correct: boolean) => {
    setReviewAnswered(true);
    setReviewCorrect(correct);
    if (correct) {
      setReviewResolvedCount((c) => c + 1);
    }
  }, []);

  const finishLesson = useCallback(() => {
    if (!lesson) return;
    if (!progress.completedLessons.includes(lesson.id)) {
      completeLesson(lesson.id, lesson.xp, lesson.steps.length);
      checkAchievements(achievements);
    }
    setShowCompletion(true);
  }, [lesson, progress.completedLessons, completeLesson, checkAchievements]);

  const handleNext = useCallback(() => {
    if (!lesson) return;
    if (stepIndex < lesson.steps.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      // All steps answered — check if review is needed
      const wrongSteps = stepResults
        .map((r, i) => (r === false ? i : -1))
        .filter((i) => i >= 0);

      if (wrongSteps.length > 0) {
        // Enter review mode
        setReviewQueue(wrongSteps);
        setReviewMode(true);
        setReviewIndex(0);
        setReviewAnswered(false);
        setReviewCorrect(false);
      } else {
        // No review needed — complete
        finishLesson();
      }
    }
  }, [lesson, stepIndex, stepResults, finishLesson]);

  const handleReviewNext = useCallback(() => {
    if (reviewIndex < reviewQueue.length - 1) {
      setReviewIndex((i) => i + 1);
      setReviewAnswered(false);
      setReviewCorrect(false);
    } else {
      // Review complete — show completion
      finishLesson();
    }
  }, [reviewIndex, reviewQueue, finishLesson]);

  const handleRetry = useCallback(() => {
    setStepIndex(0);
    setStepResults([]);
    setShowCompletion(false);
    setReviewQueue([]);
    setReviewMode(false);
    setReviewIndex(0);
    setReviewAnswered(false);
    setReviewCorrect(false);
    setReviewResolvedCount(0);
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

  // ── Completion screen ──────────────────────────────────────────
  if (showCompletion) {
    const firstTryCorrect = stepResults.filter((r) => r === true).length;
    const neededReview = reviewQueue.length;
    const reviewCorrected = reviewResolvedCount;
    const allCorrectFirstTry = neededReview === 0;

    return (
      <div className="lesson-page">
        <div className="lesson-body">
          <div className="lesson-card text-center">
            <div
              className="icon-shape icon-shape-lg mx-auto mb-4"
              style={{
                background: allCorrectFirstTry ? 'rgba(9,200,44,0.1)' : 'rgba(255,180,0,0.1)',
                color: allCorrectFirstTry ? 'var(--success)' : 'var(--gold)',
              }}
            >
              <Trophy size={32} />
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Lição Concluída!
            </h1>
            <p className="text-muted mb-4">
              Você ganhou <strong style={{ color: 'var(--gold)' }}>+{lesson.xp} XP</strong> e completou
              {' '}{lesson.steps.length} etapas.
            </p>

            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              <div className="text-center">
                <div className="stat-number" style={{ fontSize: '1.75rem', color: 'var(--gold)' }}>
                  +{lesson.xp}
                </div>
                <div className="stat-label">XP</div>
              </div>
              <div className="text-center">
                <div className="stat-number" style={{ fontSize: '1.75rem', color: 'var(--success)' }}>
                  {firstTryCorrect}
                </div>
                <div className="stat-label">Acertos na 1ª tentativa</div>
              </div>
              {neededReview > 0 && (
                <>
                  <div className="text-center">
                    <div className="stat-number" style={{ fontSize: '1.75rem', color: 'var(--gold)' }}>
                      {neededReview}
                    </div>
                    <div className="stat-label">Precisaram revisão</div>
                  </div>
                  <div className="text-center">
                    <div className="stat-number" style={{ fontSize: '1.75rem', color: 'var(--accent)' }}>
                      {reviewCorrected}/{neededReview}
                    </div>
                    <div className="stat-label">Corrigidos na revisão</div>
                  </div>
                </>
              )}
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

  // ── Current step (normal or review mode) ───────────────────────
  const inReview = reviewMode;
  const currentStepIndex = inReview ? reviewQueue[reviewIndex] : stepIndex;
  const step: LessonStep = lesson.steps[currentStepIndex];
  const isExplanation = step.type === 'explanation';

  // Progress bar
  const progressPct = inReview
    ? ((reviewIndex + (reviewAnswered ? 1 : 0)) / reviewQueue.length) * 100
    : ((stepIndex + (stepResults[stepIndex] ? 1 : 0)) / lesson.steps.length) * 100;

  // Key forces remount of exercise components when switching steps/modes
  const stepKey = inReview ? `review-${reviewIndex}` : `normal-${stepIndex}`;

  const onSolved = inReview ? handleReviewSolved : handleStepSolved;

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
        {inReview ? (
          <span className="badge badge-review">
            <RefreshCw size={14} /> Revisão
          </span>
        ) : (
          <div className="lesson-hearts">
            <Heart size={18} fill="currentColor" />
            {Math.max(0, 3 - stepResults.filter((r) => r === false).length)}
          </div>
        )}
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
              {inReview
                ? `Revisão ${reviewIndex + 1} de ${reviewQueue.length}`
                : `Etapa ${stepIndex + 1} de ${lesson.steps.length}`}
            </span>
            <span className="badge badge-teal" style={{ textTransform: 'capitalize' }}>
              {stepTypeLabel(step.type)}
            </span>
          </div>

          {/* Step content — key forces remount so exercises reset */}
          <div className="lesson-step-content" key={stepKey}>
            {renderStep(step, onSolved)}
          </div>

          {/* Footer navigation — normal mode, explanation step */}
          {isExplanation && !inReview && (
            <div className="lesson-footer">
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                Leitura e compreensão
              </span>
              <button className="btn btn-primary" onClick={handleNext}>
                Continuar
              </button>
            </div>
          )}

          {/* Footer navigation — normal mode, exercise step (always appears after answering) */}
          {!isExplanation && !inReview && stepResults[stepIndex] !== undefined && (
            <div className="lesson-footer">
              <FeedbackPanel
                correct={stepResults[stepIndex]}
                title={stepResults[stepIndex] ? 'Correto!' : 'Incorreto'}
                message={
                  stepResults[stepIndex]
                    ? 'Você pode avançar para a próxima etapa.'
                    : 'Você errou, mas pode avançar. Vamos revisar este conteúdo ao final da lição.'
                }
              />
              <button className="btn btn-primary" onClick={handleNext}>
                {stepIndex < lesson.steps.length - 1 ? 'Próxima etapa' : 'Finalizar'}
              </button>
            </div>
          )}

          {/* Footer navigation — review mode */}
          {inReview && reviewAnswered && (
            <div className="lesson-footer">
              <FeedbackPanel
                correct={reviewCorrect}
                title={reviewCorrect ? 'Correto!' : 'Ainda incorreto'}
                message={
                  reviewCorrect
                    ? 'Você acertou na revisão! Avance para a próxima.'
                    : 'Não foi dessa vez. Você pode avançar para a próxima revisão.'
                }
              />
              <button className="btn btn-primary" onClick={handleReviewNext}>
                {reviewIndex < reviewQueue.length - 1 ? 'Próxima revisão' : 'Finalizar revisão'}
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