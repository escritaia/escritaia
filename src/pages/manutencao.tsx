import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/manutencao.module.css'

export default function Manutencao() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Em Manutenção | EscritaIA</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.icon} />
          <h1 className={styles.title}>🚧 Em construção!</h1>
          <p className={styles.subtitle}>
            Esta função estará disponível em breve. Estamos preparando algo incrível para você!
          </p>
          <div className={styles.loader}>
            <span />
            <span />
            <span />
          </div>

          <button
            className={styles.backButton}
            onClick={() => router.back()}
          >
            ← Voltar
          </button>
        </div>
      </div>
    </>
  )
}
