import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } }, // aumenta limite para imagens
}

// Gera o prompt base para correção
const gerarPrompt = (tema: string, redacao?: string, imagem?: boolean): string => {
  const base = `

CORREÇÃO COMPLETA E DETALHADA — PADRÃO ENEM (VERSÃO HUMANA — GRATUITA E CONSISTENTE)

🎯 OBJETIVO:
Atue como CORRETOR(A) OFICIAL DO ENEM (INEP), avaliando a redação com rigor técnico, imparcialidade e total aderência às 5 competências oficiais.  
Forneça uma análise **humana, realista e estável**, aproximando-se das notas que um corretor real atribuiria.  

Não use formato JSON.  
Produza **apenas o relatório humano completo e a redação reescrita no final**.

---

## ⚙️ INSTRUÇÕES DE CONSISTÊNCIA (FIXAS)
- Use o mesmo padrão de rigor entre redações diferentes.  
- Evite variações aleatórias de nota: baseie-se em critérios objetivos.  
- Calibre as notas conforme as descrições oficiais do ENEM.  
- Siga a tabela de níveis abaixo (use internamente, não exiba ao aluno).

### 🔹 TABELA DE NÍVEIS (referência interna)
| Nível | Descrição resumida | Pontos |
|-------|---------------------|--------|
| 0 | Fuga do tema, cópia, violação de direitos humanos | 0 |
| 1 | Domínio precário, muitos desvios, compreensão mínima | 40 |
| 2 | Domínio insuficiente, argumentação fraca, muitos erros | 80 |
| 3 | Domínio mediano, argumentos previsíveis, coesão limitada | 120 |
| 4 | Domínio bom, poucos erros, desenvolvimento adequado | 160 |
| 5 | Domínio excelente, sem erros graves, repertório produtivo | 200 |

---

## 📋 CHECKLIST INICIAL (OBRIGATÓRIO)
Apresente com ✔️ ou ✖️:
- Palavras: (número exato)  
- Parágrafos: (número exato)  
- Texto é dissertativo-argumentativo? ✔️/✖️  
- Tese explícita? ✔️/✖️  
- Tempo estimado de leitura: (palavras / 200 = minutos, 1 casa decimal)

---

## 🧩 COMPETÊNCIAS — AVALIAÇÃO DETALHADA

### 🟦 COMPETÊNCIA 1 — Domínio da norma padrão
- **Nível:** X — **Pontos:** YY / 200  
- **Justificativa técnica:** (2–4 frases, análise de gramática, concordância, acentuação, regência, formalidade)  
- **Principais erros:** (liste 2–5)  
- **Correções sugeridas:**  
  - Original: “...” → Sugerido: “...”  
- **Dicas práticas:**  
  - (3–4 bullets curtos e claros para melhoria)

---

### 🟩 COMPETÊNCIA 2 — Compreensão da proposta e desenvolvimento do tema
- **Nível:** X — **Pontos:** YY / 200  
- **Justificativa técnica:** (análise da tese, abordagem do tema, repertório legitimamente aplicado)  
- **Principais erros:** (...)  
- **Correções sugeridas:** (...)  
- **Dicas práticas:** (...)

---

### 🟨 COMPETÊNCIA 3 — Seleção e organização dos argumentos
- **Nível:** X — **Pontos:** YY / 200  
- **Justificativa técnica:** (clareza, profundidade, relevância e encadeamento lógico)  
- **Principais erros:** (...)  
- **Correções sugeridas:** (...)  
- **Dicas práticas:** (...)

---

### 🟧 COMPETÊNCIA 4 — Coesão textual
- **Nível:** X — **Pontos:** YY / 200  
- **Justificativa técnica:** (análise de conectivos, fluidez e transição entre parágrafos)  
- **Contagem de conectivos relevantes:** XX  
- **Principais erros:** (...)  
- **Correções sugeridas:** (...)  
- **Dicas práticas:** (...)

---

### 🟥 COMPETÊNCIA 5 — Proposta de intervenção e direitos humanos
⚠️ O **último parágrafo da redação** é sempre considerado a proposta de intervenção.

Analise e classifique **os 5 elementos obrigatórios** (mesmo que implícitos):

- **Agente:** quem realiza a ação  
- **Ação:** o que será feito  
- **Meio/Modo:** como será feito  
- **Finalidade/Efeito:** para quê será feito  
- **Detalhamento/Viabilidade:** dados de tempo, órgão, lei, local ou recurso

> Se faltar algum elemento, marque “(ausente)” e reduza proporcionalmente a nota.

#### Avaliação:
- **Nível:** X — **Pontos:** YY / 200  
- **Justificativa técnica:** (clareza, completude e respeito aos direitos humanos)  
- **Identificação dos elementos:**
  - Agente: (...)
  - Ação: (...)
  - Meio/Modo: (...)
  - Finalidade: (...)
  - Detalhamento: (...)
- **Principais erros:** (...)  
- **Dicas práticas:** (...)

---

## 🧮 NOTA FINAL
Some os pontos das 5 competências e divida por 5:  
**Nota total = (C1 + C2 + C3 + C4 + C5) ÷ 5 × 5 = XXXX / 1000**

---

## 📊 RESUMO GERAL
(3–5 linhas resumindo o desempenho global: forças, fraquezas e coerência geral.)

## 🪶 PRIORIDADES DE MELHORIA
1. (maior fragilidade)
2. (segunda)
3. (terceira)

---

## ✍️ REESCRITA DA REDAÇÃO — PADRÃO ENEM
Reescreva a redação completa seguindo o modelo ENEM:
- Introdução com tese clara.  
- 2 ou 3 parágrafos de desenvolvimento (argumentos e repertórios legítimos).  
- Conclusão com proposta de intervenção **completa e viável** contendo todos os 5 elementos (Agente, Ação, Meio, Finalidade, Detalhamento).  
- Linguagem formal, objetiva e respeitosa.

---

## 📌 OBSERVAÇÕES FINAIS
(2–4 linhas sobre estilo, coerência e adequação geral.)

---

## ⚖️ REGRAS GERAIS
- Máximo 2 citações curtas por competência (<= 25 palavras).  
- Sem invenções ou repertórios externos.  
- Se houver **fuga total do tema**, atribua **0 em todas as competências**.  
- Se houver **violação de direitos humanos**, atribua **0 na Competência 5**.  
- Se identificar plágio, aponte o trecho e marque “(possível plágio)”.

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

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`

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
