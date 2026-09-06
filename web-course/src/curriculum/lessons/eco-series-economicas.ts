import type { Lesson } from '@/types';
export const lesson: Lesson = {
  id: 'eco-series-economicas', trackId: 'economia',
  title: 'Séries econômicas', description: 'Coleta e análise de séries do BCB e IBGE.',
  difficulty: 3, xp: 20, estimatedMinutes: 10, prerequisites: ['eco-visualizacao'],
  steps: [
    { id: 's1', type: 'explanation', content: 'O **Banco Central do Brasil** oferece uma API (SGS) gratuita para séries econômicas: PIB, inflação, juros, câmbio.',
      codeExample: 'import pandas as pd\n\n# Selic diaria (serie 11)\nurl = \'http://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json\'\nselic = pd.read_json(url)\nselic[\'data\'] = pd.to_datetime(selic[\'data\'], format=\'%d/%m/%Y\')\nselic.set_index(\'data\', inplace=True)' },
    { id: 's2', type: 'explanation', content: 'Para dados do IBGE (PNAD, POF, Censo), use a API sidra ou a biblioteca `ibge`.',
      codeExample: '# PIB trimestral\nurl = \'https://servicodados.ibge.gov.br/api/v3/agregados/6784/periodos/202301-202404/variaveis/5849?localidades=N1[all]\'\ndados = pd.read_json(url)' },
    { id: 's3', type: 'quiz', question: 'O que a API SGS do Banco Central fornece?',
      options: ['Apenas cotações do dólar', 'Séries temporais econômicas (Selic, PIB, inflação)', 'Dados demográficos', 'Dados de comércio exterior'], answer: 1,
      explanation: 'A SGS (Sistema Gerenciador de Séries Temporais) oferece dezenas de séries econômicas.' },
  ],
};
