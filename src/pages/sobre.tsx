import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/sobre.module.css";

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre Nós — EscritaIA</title>
        <meta name="description" content="EscritaIA — ferramenta gratuita para correção de redações, desenvolvida por equipe de iniciação científica." />
      </Head>

      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Sobre Nós</h1>

          <section className={styles.card}>
            <p className={styles.paragraph}>
              A EscritaIA nasceu como projeto de iniciação científica com o objetivo de oferecer uma ferramenta gratuita e acessível para apoio à correção de redações dissertativas‑argumentativas; o desenvolvimento priorizou reprodutibilidade e baixo custo, adotando Next.js no frontend, rotas API server‑side para integrar o motor de correção (inicialmente LanguageTool), Auth0 para autenticação social e um módulo de normalização que padroniza as sugestões (posição, tipo de erro, sugestão e justificativa) para fins de análise; todas as redações usadas na pesquisa foram coletadas com consentimento, transcritas manualmente para garantir fidelidade e anonimizadas para preservar privacidade; tecnicamente, a interface usa CSS Modules, variáveis globais para cores e tipografia, e um formato JSON padronizado para armazenamento temporário de metadados; o roadmap inclui persistência em banco relacional, integração com modelos híbridos (regras + LLM) e melhorias na experiência de salvar e revisar histórico de redações.
            </p>
          </section>

          <section className={styles.teamSection}>
            <h2 className={styles.teamTitle}>Equipe</h2>

            <div className={styles.teamGrid}>
              <div className={styles.member}>
                <div className={styles.photoWrap}>
                  <Image src="../imagens/team/Alisson.jpg" alt="Alisson Vinison" width={160} height={160} className={styles.photo} />
                </div>
                <div className={styles.name}>Alisson Vinison</div>
              </div>

              <div className={styles.member}>
                <div className={styles.photoWrap}>
                  <Image src="/imagens/team/Pedro.jpg" alt="Pedro Vinicius" width={160} height={160} className={styles.photo} />
                </div>
                <div className={styles.name}>Pedro Vinicius</div>
              </div>

              <div className={styles.member}>
                <div className={styles.photoWrap}>
                  <Image src="/imagens/team/Carlos.jpg" alt="Carlos Alexandre" width={160} height={160} className={styles.photo} />
                </div>
                <div className={styles.name}>Carlos Alexandre</div>
              </div>

              <div className={styles.member}>
                <div className={styles.photoWrap}>
                  <Image src="/imagens/team/Jhonnatha.jpg" alt="Jhonnatha Pedro" width={160} height={160} className={styles.photo} />
                </div>
                <div className={styles.name}>Jhonnatha Pedro</div>
              </div>

              <div className={styles.member}>
                <div className={styles.photoWrap}>
                  <Image src="/imagens/team/Guilherme.jpg" alt="Guilherme Kilvio" width={160} height={160} className={styles.photo} />
                </div>
                <div className={styles.name}>Guilherme Kilvio</div>
              </div>
            </div>
          </section>

          <footer className={styles.footer}>
            <small>EscritaIA — projeto de iniciação científica • Fortaleza, CE</small>
          </footer>
        </div>
      </main>
    </>
  );
}
