import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } }, // aumenta limite para imagens
}

// Gera o prompt base para correção
const gerarPrompt = (tema: string, redacao?: string, imagem?: boolean): string => {
  const base = `

CORREÇÃO COMPLETA E DETALHADA — PADRÃO ENEM (VERSÃO HUMANA APENAS)

INSTRUÇÕES GERAIS (MANDATÓRIO)
Você atuará como CORRETOR(A) OFICIAL DO ENEM (INEP). Avalie a redação com rigor técnico, imparcialidade e estrita observância das cinco competências oficiais. Use o português culto, seguindo a norma padrão. **NÃO** traga fontes externas; baseie-se exclusivamente no texto enviado.

ENTREGA (OBRIGATÓRIO — VERSÃO HUMANA)
- Produza **somente** a versão HUMANA (relatório detalhado e legível).
- Além da avaliação, entregue **uma redação reescrita** (texto completo no estilo ENEM).
- O relatório deve ser **completo, analítico e realista**, aproximando-se das notas de um corretor oficial do ENEM.

CHECKLIST INICIAL (MOSTRAR ✔/✖ E VALORES)
- [ ] Contagem de palavras do texto original (número exato).
- [ ] Número de parágrafos.
- [ ] Texto é dissertativo-argumentativo? (sim / não).
- [ ] Tese explícita? (sim / não).
- [ ] Tempo estimado de leitura (palavras / 200 = minutos; arredondar 1 casa decimal).

REGRAS FUNDAMENTAIS
- Máximo 2 citações curtas por competência (<= 25 palavras cada).
- Se houver **fuga total do tema**, atribua **0 em todas as competências** e explique.
- Se houver **ofensa ou violação dos direitos humanos**, atribua **0 na Competência 5** e justifique tecnicamente.
- Não invente repertório; use apenas o que está presente no texto.
- Se houver indício de plágio, cite o trecho e indique “(possível plágio — verificar fonte)”.

PONTUAÇÃO (MECÂNICA OFICIAL)
Cada competência vale 0–200 pontos (total de 1000).  
- Nível 0 — 0 pts  
- Nível 1 — 40 pts  
- Nível 2 — 80 pts  
- Nível 3 — 120 pts  
- Nível 4 — 160 pts  
- Nível 5 — 200 pts  
Competência 2 não usa Nível 0 (começa em 1).

PARÂMETROS DE AVALIAÇÃO
- C1 — Domínio da norma padrão: ortografia, acentuação, pontuação, concordância, regência, formalidade.  
- C2 — Compreensão da proposta e desenvolvimento do tema: tese, progressão, repertório.  
- C3 — Seleção e organização dos argumentos: relevância, profundidade, encadeamento.  
- C4 — Coesão textual: conectivos, retomadas, fluidez entre parágrafos.  
- C5 — Proposta de intervenção e direitos humanos: **identificar os 5 elementos**:
  1. **Agente:** quem realiza a ação.  
  2. **Ação:** o que será feito.  
  3. **Meio/Modo:** como será feito.  
  4. **Efeito/Finalidade:** para quê será feito.  
  5. **Detalhamento/Viabilidade:** elementos que tornam a proposta possível (ex.: órgãos, leis, tempo, recursos).  

⚠️ O último parágrafo da redação deve ser **automaticamente reconhecido como a proposta de intervenção**.  
Você deve **destacar e classificar claramente os 5 elementos** (Agente, Ação, Meio, Finalidade, Detalhamento) dentro do parágrafo, mesmo que alguns estejam implícitos.

FORMATO DE ENTREGA — VERSÃO HUMANA COMPLETA
Apresente nesta ordem:

---

### CABEÇALHO
- **Tema:** ${tema}  
- **CHECKLIST:**  
  - Palavras: XXX  
  - Parágrafos: XXX  
  - Dissertativo-argumentativo: ✔/✖  
  - Tese explícita: ✔/✖  
  - Tempo estimado de leitura: X.X min  

---

### COMPETÊNCIA 1 — Domínio da norma padrão  
- Nível: X — Pontos: YY / 200  
- Nota: YY / 200  
- **Justificativa técnica:** (2–4 frases; incluir até 2 citações curtas, <= 25 palavras)  
- **Principais erros:** (2–6 itens, classificados por tipo)  
- **Correções sugeridas:**  
  - Original: “...” → Sugerido: “...”  
- **Dicas práticas:**  
  - (3–4 bullets com ações concretas de melhoria)

---

### COMPETÊNCIA 2 — Compreensão da proposta e desenvolvimento do tema  
- Nível: X — Pontos: YY / 200  
- Nota: YY / 200  
- **Justificativa técnica:** (...)  
- **Principais erros:** (...)  
- **Correções sugeridas:** (...)  
- **Dicas práticas:** (...)

---

### COMPETÊNCIA 3 — Seleção e organização dos argumentos  
(mesma estrutura)

---

### COMPETÊNCIA 4 — Coesão textual  
(mesma estrutura + indicar quantidade de conectivos relevantes e se há repetições excessivas)

---

### COMPETÊNCIA 5 — Proposta de intervenção e direitos humanos  
- Nível: X — Pontos: YY / 200  
- Nota: YY / 200  
- **Justificativa técnica:** (análise de completude, respeito aos direitos humanos, clareza e viabilidade)  
- **Identificação dos elementos da proposta (último parágrafo):**  
  - **Agente:** (transcreva ou resuma o trecho que indica quem faz)  
  - **Ação:** (transcreva ou resuma o que será feito)  
  - **Meio/Modo:** (como será feito)  
  - **Efeito/Finalidade:** (para quê será feito)  
  - **Detalhamento/Viabilidade:** (indicações de tempo, local, recursos, órgão, lei etc.)  
- **Principais erros:** (...)  
- **Correções sugeridas:** (...)  
- **Dicas práticas:** (3–4 bullets para melhorar propostas futuras)

---

### NOTA FINAL
**Nota total:** XXXX / 1000  

### RESUMO GERAL
(3–5 linhas com análise concisa do desempenho global — forças e fraquezas.)

### RESUMO DE PRIORIDADES
1. (ponto de melhoria mais importante)  
2. (segundo ponto)  
3. (terceiro ponto)

---

### VERSÃO REESCRITA DA REDAÇÃO
Entregue o texto refeito **no padrão ENEM completo**:
- Introdução com tese explícita.  
- 2–3 parágrafos de desenvolvimento (argumento + repertório + ligação à tese).  
- Conclusão com proposta de intervenção **completa e viável**, incluindo Agente, Ação, Meio, Finalidade e Detalhamento.  
- Respeito aos direitos humanos.  
- Linguagem formal, objetiva e clara.

---

### OBSERVAÇÕES FINAIS
(2–4 linhas sobre estilo, adequação social e consistência argumentativa.)

`
  return imagem ? base : `${base}\n\nRedação:\n${redacao}`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { tema, redacao, imagemBase64 } = req.body as {
    tema: string
    redacao?: string
    imagemBase64?: string
  }

  if (!tema || (!redacao && !imagemBase64)) {
    return res.status(400).json({ error: 'Tema e redação ou imagem são obrigatórios.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Chave da API Gemini não configurada.' })
  }

  const prompt = gerarPrompt(tema)

  // Monta os "parts" para Gemini: texto + imagem (se houver)
  const parts: any[] = [{ text: prompt }]

  if (imagemBase64) {
    const base64Data = imagemBase64.split(',')[1] // remove o prefixo data:image/png;base64,...
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: base64Data,
      },
    })
  } else if (redacao) {
    parts.push({ text: redacao })
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${apiKey}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts }] }),
    })

    const json = await response.json()
    if (!response.ok) {
      console.error('Erro da API Gemini:', response.status, json)
      return res.status(500).json({ error: 'Falha ao comunicar com a IA', detalhes: json })
    }

    const texto = json?.candidates?.[0]?.content?.parts?.[0]?.text || 'A IA não respondeu.'
    return res.status(200).json({ resposta: texto.trim() })
  } catch (e: any) {
    console.error('Erro geral ao conectar com IA:', e)
    return res.status(500).json({ error: 'Erro de conexão com a IA', detalhes: e.message })
  }
}
