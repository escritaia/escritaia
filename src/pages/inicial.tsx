// src/pages/inicial.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'              // ← importar
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import styles from '../styles/inicial.module.css'

export default function HomePage() {
  const router = useRouter()                         // ← instanciar
  const [usuario, setUsuario] = useState<User | null>(null)
  const [menuAberto, setMenuAberto] = useState(false)
  const [avatarURL, setAvatarURL] = useState('/avatar-default.png')
  const [nome, setNome] = useState('Usuário')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuario(user)
      if (user) {
        const ref = doc(db, 'usuarios', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          setAvatarURL(data.avatar || '/avatar-default.png')
          setNome(data.nome || user.displayName || 'Usuário')
        } else {
          setNome(user.displayName || 'Usuário')
        }
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <>
      <Head>
        <title>EscritaIA</title>
      </Head>

      <div className={styles.page}>
        <header className={styles['site-header']}>
          {/* hambúrguer permanece abrindo menu */}
          <button
            className={styles.hamburger}
            aria-label="Abrir menu"
            onClick={() => setMenuAberto(o => !o)}
          >
            <span/><span/><span/>
          </button>

          <div className={styles.logo}>
            <img src="/imagens/ccimg.png" alt="Logo" className={styles['logo-img']} />
            <span className={styles['logo-title']}>EscritaIA</span>
          </div>

          {usuario ? (
            <div className={styles.perfil}>
              <span className={styles.email}>Olá, {nome}</span>

              {/* ← Avatar vira link para editar perfil */}
              <button
                className={styles['action-circle']}
                onClick={() => router.push('/conta')}
              >
                <img src={avatarURL} alt="Avatar" className={styles.avatar} />
              </button>

              {/* se ainda quiser o dropdown */}
              {menuAberto && (
                <div className={styles.menuContent}>
                  <button
                    className={styles.fecharMenu}
                    onClick={() => setMenuAberto(false)}
                  >
                    ✖
                  </button>
                  {/* remova “Minha Conta” pois já abrimos via avatar */}
                  <Link href="/editor" className={styles.menuLink}>
                    ✏️ Corretor
                  </Link>
                  <Link href="/manutencao" className={styles.menuLink}>
                    📚 Aprenda Mais
                  </Link>
                  <Link href="/manutencao" className={styles.menuLink}>
                    🌐 Fale com Monitores
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <nav className={styles.nav}>
              <Link href="/login" className={styles.buttonLink}>Login</Link>
              <Link href="/signup" className={styles.buttonLink}>Criar Conta</Link>
            </nav>
          )}
        </header>

        {/* HERO */}
          <section className={styles.hero}>
            <div className={styles.heroInner}>
              <div className={styles.documentIcon} />

              <h1 className={styles.heroTitle}>Bem-vindo ao EscritaIA</h1>
              <p className={styles.heroSubtitle}>
                A plataforma de correção de redações com Inteligência Artificial
              </p>

              {usuario ? (
                /* Usuário logado: outro CTA ou simplesmente esconda */
                <Link href="/editor" className={styles.ctaButton}>
                  Acessar Corretor
                </Link>
              ) : (
                /* Usuário não logado: mostra Começar Agora */
                <Link href="/signup" className={styles.ctaButton}>
                  Começar Agora
                </Link>
              )}
            </div>
          </section>

          {/* APRESENTAÇÃO DETALHADA */}
          <section className={styles.presentation}>
            <h2>Quem somos</h2>
            <p>
              Somos uma equipe de estudantes apaixonados por tecnologia e educação.
              Criamos o EscritaIA para apoiar alunos e professores no processo de
              correção de redações, oferecendo uma ferramenta moderna e acessível.
            </p>
            <p>
              Nosso objetivo não é substituir professores, mas promover autonomia
              e aprendizado contínuo.
            </p>
          </section>

          <section className={styles.presentationAlt}>
            <h2>O que fazemos</h2>
            <ul>
              <li>Estrutura do texto (introdução, desenvolvimento e conclusão)</li>
              <li>Coesão e coerência</li>
              <li>Argumentação e repertório cultural</li>
              <li>Gramática, ortografia e pontuação</li>
            </ul>
            <p>
              Além da correção, o EscritaIA fornece dicas detalhadas para aprimorar
              cada redação de forma consciente e estratégica.
            </p>
          </section>

          <section className={styles.presentation}>
            <h2>Para quem é</h2>
            <p>
              <strong>Alunos:</strong> feedback imediato, entendem seus pontos fortes
              e desenvolvem autonomia.
            </p>
            <p>
              <strong>Professores:</strong> apoio na correção e acompanhamento de
              forma ágil e organizada.
            </p>
          </section>

          <section className={styles.presentationAlt}>
            <h2>Por que usar nossa plataforma?</h2>
            <p>
              Correção detalhada baseada nos padrões do ENEM, dicas práticas e
              autonomia na escrita, complementando o trabalho de professores.
            </p>
          </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <Link href="/manutencao" className={styles.footerLink}>
            Sobre Nós
          </Link>
          {' | '}
          <Link href="/manutencao" className={styles.footerLink}>
            Fale Conosco
          </Link>
        </footer>
      </div>
    </>
  )
}
