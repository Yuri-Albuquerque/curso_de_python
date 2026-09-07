import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { loadLessons } from '@/curriculum/lessons';
import { HomePage } from '@/pages/HomePage';
import { TracksPage } from '@/pages/TracksPage';
import { TrackDetailPage } from '@/pages/TrackDetailPage';
import { LessonPage } from '@/pages/LessonPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoginPage } from '@/pages/LoginPage';

const basename = '/curso_de_python';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <HomePage />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/login',
      element: (
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <LoginPage />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/trilhas',
      element: (
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <TracksPage />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/trilha/:trackId',
      element: (
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <TrackDetailPage />
          </main>
          <Footer />
        </div>
      ),
    },
    {
      path: '/licao/:lessonId',
      element: (
        <div className="app-layout">
          <Navbar />
          <main className="app-main app-main-lesson">
            <LessonPage />
          </main>
        </div>
      ),
    },
    {
      path: '/progresso',
      element: (
        <div className="app-layout">
          <Navbar />
          <main className="app-main">
            <ProgressPage />
          </main>
          <Footer />
        </div>
      ),
    },
    { path: '/404', element: <NotFoundPage /> },
    { path: '*', element: <Navigate to="/404" replace /> },
  ],
  { basename },
);

export function App() {
  // As 66 lições vêm num chunk carregado sob demanda. As páginas leem o
  // currículo de forma SÍNCRONA (getLessonById/getLessonsForTrack), então o
  // router só pode montar depois que esse chunk chegar — caso contrário a
  // primeira renderização não acha lição nenhuma e a tela fica em
  // "Lição não encontrada" / "Lições em breve" para sempre.
  const [licoesProntas, setLicoesProntas] = useState(false);

  useEffect(() => {
    let cancelado = false;
    void loadLessons().finally(() => {
      if (!cancelado) setLicoesProntas(true);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  if (!licoesProntas) {
    return (
      <div className="app-loading" role="status" aria-live="polite">
        <div className="app-loading-spinner" aria-hidden="true" />
        <p>Carregando o curso...</p>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}