import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import styles from '../styles/editor.module.css'

type Props = {
  initialTema?: string
  initialRedacao?: string
}

export default function Editor({ initialTema = '', initialRedacao = '' }: Props) {
  const router = useRouter()
  const [tema, setTema] = useState(initialTema)
  const [redacao, setRedacao] = useState(initialRedacao)
  const [imagemBase64, setImagemBase64] = useState<string | null>(null)
  const [resposta, setResposta] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const [usuario, setUsuario] = useState<User | null>(null)
  const [avatarURL, setAvatarURL] = useState('/avatar-default.png')
  const [nome, setNome] = useState('Usuário')

  useEffect(() => {
    if (!router.isReady) return
    const qTema = Array.isArray(router.query.tema) ? router.query.tema[0] : router.query.tema
    const qRedacao = Array.isArray(router.query.redacao) ? router.query.redacao[0] : router.query.redacao
    if (qTema) setTema(String(qTema))
    if (qRedacao) setRedacao(String(qRedacao))
  }, [router.isReady, router.query.tema, router.query.redacao])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUsuario(user)
      try {
        const ref = doc(db, 'usuarios', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          setAvatarURL(data?.avatar || '/avatar-default.png')
          setNome(data?.nome || user.displayName || 'Usuário')
        } else {
          setNome(user.displayName || 'Usuário')
        }
      } catch (err) {
        console.error('Erro ao buscar usuário:', err)
      }
    })
    return () => unsub()
  }, [router])

  const handleImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result?.toString()
      if (base64?.startsWith('data:image')) {
        setImagemBase64(base64)
        setRedacao('') // limpa campo de texto se imagem for usada
      }
    }
    reader.readAsDataURL(file)
  }

  const corrigirRedacao = async () => {
    if (!tema || (!redacao && !imagemBase64)) {
      alert('Preencha o tema e a redação ou envie uma imagem.')
      return
    }

    setCarregando(true)
    setResposta('')

    try {
      const res = await fetch('/api/corrigir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, redacao, imagemBase64 }),
      })
      const data = await res.json()
      setResposta(data.resposta || 'Não houve resposta da IA.')
    } catch {
      setResposta('Erro ao comunicar com a IA.')
    }

    setCarregando(false)
  }

  return (
    <>
      <Head>
        <title>Editor de Redação</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.siteHeader}>
          <button
            className={`${styles.hamburger} ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>

          <div className={styles.logo}>
            <Image
              src="/imagens/ccimg.png"
              alt="Logo"
              width={32}
              height={32}
              className={styles.logoImg}
            />
            <span className={styles.logoTitle}>EscritaIA</span>
          </div>

          {usuario && (
            <div className={styles.perfil}>
              <span className={styles.email}>Olá, {nome}</span>
              <button
                className={styles['action-circle']}
                onClick={() => router.push('/conta')}
                aria-label="Meu perfil"
              >
                <img
                  src={avatarURL}
                  alt="Avatar"
                  className={styles.avatar}
                />
              </button>
            </div>
          )}
        </header>

        {menuOpen && (
          <nav className={styles.menuContent} aria-label="Menu lateral">
            <button
              className={styles.fecharMenu}
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
            >
              ✖
            </button>
            <Link href="/inicial" className={styles.menuLink}>🏠 Início</Link>
            <Link href="/manutencao" className={styles.menuLink}>📚 Aprenda Mais</Link>
            <Link href="/manutencao" className={styles.menuLink}>🌐 Fale com Monitores</Link>
          </nav>
        )}

        <div className={styles.editorBox}>
          <h2 className={styles.title}>📝 Corretor de Redação ENEM</h2>

          <label className={styles.label} htmlFor="tema">Tema:</label>
          <input
            id="tema"
            type="text"
            className={styles.input}
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Ex: Desafios da educação digital no Brasil"
            autoComplete="off"
          />

          <label className={styles.label} htmlFor="redacao">Redação (texto digitado):</label>
          <textarea
            id="redacao"
            className={styles.textarea}
            value={redacao}
            onChange={(e) => setRedacao(e.target.value)}
            placeholder="Escreva seu texto aqui..."
          />

          <label className={styles.label}>Ou envie uma imagem da redação:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagem}
            className={styles.input}
          />

          <button
            className={styles.button}
            onClick={corrigirRedacao}
            disabled={carregando}
            aria-busy={carregando}
          >
            {carregando ? 'Corrigindo...' : 'Corrigir Redação'}
          </button>

          {resposta && (
            <div className={styles.resultado}>
              <h3>🔍 Correção da Redação:</h3>
              <ReactMarkdown>{resposta}</ReactMarkdown>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <Link href="/manutencao" className={styles.footerLink}>Sobre</Link>
          <Link href="/manutencao" className={styles.footerLink}>Privacidade</Link>
        </footer>
      </div>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const { tema = '', redacao = '' } = context.query ?? {}
  return {
    props: {
      initialTema: Array.isArray(tema) ? tema[0] : tema,
      initialRedacao: Array.isArray(redacao) ? redacao[0] : redacao,
    },
  }
}
