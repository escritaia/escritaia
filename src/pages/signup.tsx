import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/account.module.css'

export default function SignupPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [serie, setSerie] = useState('')
  const [bio, setBio] = useState('')
  const [aceitaTermos, setAceitaTermos] = useState(false)
  const router = useRouter()
  const googleProvider = new GoogleAuthProvider()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!aceitaTermos) {
      alert('Você precisa aceitar os termos de uso.')
      return
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, senha)
      const user = userCred.user

      if (nome) {
        await updateProfile(user, { displayName: nome })
      }

      await setDoc(doc(db, 'usuarios', user.uid), {
        nome,
        email,
        serie,
        bio,
        criadoEm: new Date()
      })

      router.push('/inicial')
    } catch (err: any) {
      alert('Erro ao cadastrar: ' + err.message)
    }
  }

  async function handleGoogleSignUp() {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Se for primeiro login, você pode criar o doc:
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome: user.displayName || '',
        email: user.email,
        serie: '',
        bio: '',
        criadoEm: new Date()
      })

      router.push('/inicial')
    } catch (err: any) {
      alert('Erro no cadastro com Google: ' + err.message)
    }
  }

  return (
    <>
      <Head>
        <title>Criar Conta</title>
      </Head>

      <div className={styles.container}>
        <form className={styles.formBox} onSubmit={handleSignup}>
          <h2 className={styles.title}>Criar Conta</h2>

          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleSignUp}
          >
            Continuar com Google
          </button>

          <input
            type="text"
            className={styles.input}
            placeholder="Nome completo"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />

          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />

          <select
            className={styles.input}
            value={serie}
            onChange={e => setSerie(e.target.value)}
            required
          >
            <option value="">Selecione sua série</option>
            <option value="1ano">1º ano</option>
            <option value="2ano">2º ano</option>
            <option value="3ano">3º ano</option>
          </select>

          <textarea
            className={styles.textarea}
            placeholder="Frase de perfil ou bio (opcional)"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
          />

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={aceitaTermos}
              onChange={e => setAceitaTermos(e.target.checked)}
              required
            />{' '}
            Aceito os{' '}
            <Link href="/termos" className={styles.checkboxLink}>
              termos de uso
            </Link>
          </label>

          <button type="submit" className={styles.button}>
            Cadastrar
          </button>

          <div className={styles.linkBox}>
            <Link href="/login" className={styles.buttonLink}>
              Já tenho conta
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
