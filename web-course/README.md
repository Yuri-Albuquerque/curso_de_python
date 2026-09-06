# Python para Economistas — Curso Interativo

Plataforma interativa de aprendizado de Python para estudantes de Economia, inspirada na dinâmica do Duolingo, com execução de Python diretamente no navegador via Pyodide (WebAssembly).

## Recursos

- 7 trilhas de aprendizado progressivo (66 lições no total)
- Execução de Python no navegador (sem servidor, sem backend)
- Exercícios interativos: múltipla escolha, completar código, ordenar linhas, prever saída, corrigir bugs
- Sistema de XP, sequência diária (streak) e conquistas
- Desbloqueio progressivo de lições
- Progresso salvo localmente (localStorage)
- Design responsivo (celular e computador)
- Hospedagem gratuita no GitHub Pages

## Trilhas

1. **Fundamentos** — expressões, variáveis, tipos, strings, booleanos, I/O, conversão
2. **Controle de Fluxo** — comparações, if/elif/else, laços, comprehensions
3. **Estruturas de Dados** — listas, tuplas, dicionários, conjuntos, indexação
4. **Funções em Profundidade** — parâmetros, escopo, closures, decoradores, recursão, composição
5. **Classes e Objetos** — atributos, métodos, herança, composição, dataclasses
6. **Python Intermediário e Avançado** — iteradores, geradores, exceções, type hints, testes
7. **Computação para Economia** — NumPy, pandas, visualização, séries econômicas, econometria

## Tecnologia

- React 19 + TypeScript
- Vite 6
- Pyodide (Python via WebAssembly)
- CodeMirror 6 (editor de código)
- GitHub Actions (deploy automático)

## Desenvolvimento

```bash
cd web-course
npm install
npm run dev      # servidor de desenvolvimento (http://localhost:3000)
npm run build    # build de produção
npm run test     # testes (Vitest)
npm run typecheck # verificação de tipos
```

## Deploy

O deploy é automático via GitHub Actions ao fazer push para `main`. O site fica disponível em:

```
https://yuri-albuquerque.github.io/curso_de_python/
```

## Estrutura

```
web-course/
├── src/
│   ├── components/     # Componentes React (CodeEditor, Quiz, ProgressMap, etc.)
│   ├── curriculum/     # Trilhas e lições
│   │   ├── tracks.ts   # Definição das 7 trilhas
│   │   └── lessons/    # 66 lições individuais
│   ├── pages/          # Páginas (Home, Tracks, Lesson, Progress)
│   ├── services/       # Pyodide runtime + progress storage
│   ├── hooks/          # Hooks React (useProgress, usePyodide)
│   ├── styles/         # CSS global (design system)
│   └── types/          # Tipos TypeScript
├── public/             # Assets estáticos
├── .github/workflows/  # GitHub Actions
└── package.json
```