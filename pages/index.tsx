import type { GetServerSideProps } from 'next'
import { useRouter } from "next/router"
import { withSessionSSR } from "../lib/ironsession"
import { UserData } from "../lib/user"
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export interface Redirectable {
  redirect: {
    permanent: boolean
    destination: string
  }
}

export interface IndexProps {
  [key: string]: unknown
  userData?: UserData | null
}

const getServerSideProps: GetServerSideProps = withSessionSSR<IndexProps>(
  async ({
    req,
  }): Promise<
    | {
      props: IndexProps
    }
    | Redirectable
  > => {
    // eslint-disable-next-line no-console
    console.log("[INDEX] - Init server side - TIME: ", new Date())

    // Handle authentication
    if (!req.session.userData) {
      return {
        redirect: {
          permanent: true,
          destination: "/login",
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log("[INDEX] - Exit server side - TIME: ", new Date())

    return {
      props: {}
    }
  }
)

export { getServerSideProps }

export default function Home(props: IndexProps) {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <Head>
        <title>nextjs_issue_48539</title>
        <meta name="description" content="nextjs_issue_48539" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>nextjs_issue_48539</h1>

        <h2>
          Minimal Next.js Web application that reproduces <a href="https://github.com/vercel/next.js/issues/48539" target="_blank">issue #48539</a>.
        </h2>

        <p>
          <button onClick={
            async function logout() {
              fetch("/api/logout").then((resp) => router.push("/"))
            }
          }>Logout</button>
        </p>
      </main>
    </div>
  )
}
