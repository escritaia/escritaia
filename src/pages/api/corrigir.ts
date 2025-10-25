import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } }, // aumenta limite para imagens
}

// Gera o prompt base para correção
const gerarPrompt = (tema: string, redacao?: string, imagem?: boolean): string => {
  const base = `
CORREÇÃO COMPLETA E DETALHADA — PADRÃO ENEM (TEMPLATE AVANÇADO)

INSTRUÇÕES GERAIS (OBRIGATÓRIO)
Você deve atuar como CORRETOR(A) OFICIAL DO ENEM (INEP). Avalie a redação recebida com rigor técnico, imparcialidade e estrita observância das cinco competências oficiais. Use o português culto e normas gramaticais vigentes. NÃO traga fontes externas; baseie-se exclusivamente no texto enviado.

ENTREGA (OBRIGATÓRIO)
1) Produza duas saídas no mesmo retorno:
   A) **Versão humana** (legível) seguindo o formato detalhado abaixo.
   B) **Versão JSON** com estrutura definida (ver "ESQUEMA JSON" adiante).
2) Além da avaliação, entregue **uma redação reescrita** (texto inteiro) no estilo ENEM, respeitando:
   - Introdução com tese explícita (1–2 frases claras);
   - 2–3 parágrafos de desenvolvimento (argumento + repertório/exemplo + ligação à tese);
   - Conclusão com proposta de intervenção completa (agente, ação, meio, finalidade, viabilidade) e respeito aos direitos humanos.
3) Todas as citações diretas do texto original usadas na justificativa devem ter **no máximo 25 palavras** cada. Se for necessário mostrar trecho maior, parafraseie.

CHECKLIST INICIAL (faça e mostre ✔/✖)
- [ ] Contagem de palavras do texto original (incluir número).
- [ ] Número de parágrafos.
- [ ] Texto é dissertativo-argumentativo? (sim/não)
- [ ] Texto tem tese explícita? (sim/não)

MECÂNICA DE PONTUAÇÃO (NÍVEIS)
- Nível 0 — 0 pontos
- Nível 1 — 40 pontos
- Nível 2 — 80 pontos
- Nível 3 — 120 pontos
- Nível 4 — 160 pontos
- Nível 5 — 200 pontos
**Observação:** Competência 2 não tem Nível 0 (aplicar níveis 1–5 apenas).

PARÂMETROS DE AVALIAÇÃO (O QUE AVALIAR)
- Competência 1 — Dominio da norma padrão: ortografia, acentuação, pontuação, concordância, regência, formalidade.
- Competência 2 — Compreensão da proposta e desenvolvimento do tema: tese, progressão temática, repertório relevante. (Sem Nível 0.)
- Competência 3 — Seleção e organização dos argumentos: relevância, profundidade, encadeamento, repertório.
- Competência 4 — Coesão textual e mecanismos linguísticos: conectivos, retomadas pronominais, transições, repetição.
- Competência 5 — Proposta de intervenção e direitos humanos: agente, ação, meio, finalidade, viabilidade, respeito aos direitos humanos.

FORMATO EXATO DA SAÍDA (VERSÃO HUMANA)
Para cada competência, entregue:

**Competência X — [Título]**  
- Nível: N (Nível X) — Pontos: YY / 200  
- Nota: YY / 200  *(repetir para legibilidade)*  
- Justificativa técnica: (2–4 frases; inclua **até 2 citações curtas** do texto original, cada citação <= 25 palavras)  
- Principais erros: (lista objetiva, 2–6 itens; classificar por tipo: ortografia/gramática, argumentação, estrutura, coesão, proposta, repertório)  
- Correções sugeridas: (1–2 frases reescritas que melhorem o trecho; mostrar a frase original e a reescrita)  
- Dicas específicas e práticas: (3–4 bullets, ações concretas que o autor pode aplicar)

Repita para as 5 competências.

Depois das 5 competências:
- **Nota total:** ZZZZ / 1000  
- **Resumo geral (3–5 linhas):** análise concisa do desempenho global (forças + fraquezas principais).  
- **Resumo de prioridades (3 principais pontos numerados 1–3):** ações para revisão priorizada.  
- **Versão reescrita da redação (texto completo):** entregue o texto refeito no padrão ENEM (sem marcações).  
- **Observações finais (2–4 linhas):** comentários sobre estilo, tom e adequação social.

REGRAS DE REDAÇÃO DA CORREÇÃO
- Ao indicar nível, sempre explique por que o nível foi atribuído com referência clara ao texto.  
- As "correções sugeridas" devem ser **alternativas concretas** (reescritas), não instruções vagas.  
- Não use jargões técnicos sem explicar.  
- Limite citações diretas a 2 por competência (cada citação <= 25 palavras).  
- Nunca invente dados, eventos ou autores como repertório — use apenas o que estiver no texto ou repertório genérico (ex.: "dados estatísticos recentes" só se citado no texto).

EXIGÊNCIAS ADICIONAIS (QA)
- Marque claramente onde encontra problemas de originalidade ou plágio (se houverem indícios, indique frases que parecem copiadas).
- Informe se o texto possui ofensas, discriminação ou violação de direitos humanos (se sim, emitir alerta e atribuir nota 0 em Competência 5).
- Indique tempo estimado de leitura do texto (aprox.): (palavras/200 = minutos) — apenas estimativa.

MAPA RÁPIDO DE APLICAÇÃO DOS NÍVEIS (EXEMPLOS)
- Nível 5 (200 pts): texto praticamente sem desvios; tese clara; argumentos desenvolvidos; proposta completa e viável.  
- Nível 4 (160 pts): pequenos deslizes; estrutura adequada; proposta com poucos detalhes faltantes.  
- Nível 3 (120 pts): compreensão adequada; falhas significativas de desenvolvimento/clareza.  
- Nível 2 (80 pts): argumentação pobre ou repetitiva; coesão fraca.  
- Nível 1 (40 pts): fuga parcial ao tema; erros graves na norma culta ou proposta ausente/inviável.  
- Nível 0 (0 pts): incoerência total, texto ilegível ou inexistente (não aplicável a C2).

OBS: Competência 2 → não atribuir Nível 0; comece em Nível 1 se houver problemas graves.

EXEMPLO DE SAÍDA (resumido — como deve parecer)
**Competência 1 — Domínio da norma padrão**  
- Nível: 3 (120 pts) — Nota: 120 / 200  
- Justificativa: "Há deslizes de regência e pontuação; ex.: 'as pessoa é' (citação curta)."  
- Principais erros: concordância verbal (2 exemplos), vírgula mal colocada.  
- Correções sugeridas: Original: "As pessoa é..." → Sugerido: "As pessoas são..."  
- Dicas: 1) revisar concordância sujeito-verbo; 2) praticar leitura em voz alta; 3) revisar regras de regência verbal.

ENTREGA FINAL
- Forneça **primeiro** a VERSÃO HUMANA completa (legível).  
- Termine com a redação REESCRITA (pura, sem marcações).
- Não inclua comentários sobre o processo de correção (ex.: “eu usei tal método”); apenas entregue a correção e a reescrita.

FIM DO PROMPT.
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
