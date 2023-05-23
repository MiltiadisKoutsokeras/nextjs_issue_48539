import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import { Redirectable } from "."
import { withSessionSSR } from "../lib/ironsession"
import styles from '../styles/Home.module.css'

export interface LoginProps {
    [key: string]: unknown
}

async function loginWithUsernamePassword(
    username: string,
    password: string,
): Promise<string> {
    const endpoint = "/api/login"
    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    const requestOptions: RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify({ username, password }),
    }

    return fetch(endpoint, requestOptions).then(
        (resp) => resp.json().then(
            (data) => (resp.status === 200 ? "success" : data.error)
        )
    ).catch((err) => err.message)
}

export default function Login() {
    const router = useRouter()
    const [submitError, setSubmitError] = useState('')

    return (
        <div className={styles.container}>
            <form className={styles.main} onSubmit={
                async function handleSubmit(event: any) {
                    // Do not perform the default submit handler
                    event.preventDefault();
                    try {
                        loginWithUsernamePassword(
                            event.currentTarget.username.value,
                            event.currentTarget.password.value
                        ).then((result) => {
                            if (result === "success") {
                                router.push("/")
                            } else {
                                setSubmitError(result)
                            }
                        })
                    } catch (exc) {
                        setSubmitError((exc as Error).message)
                    }
                }
            }>
                <h1 className={styles.title}>nextjs_issue_48539</h1>
                <label>
                    <span>Username:</span>
                    <input type="text" name="username" autoComplete="username"
                        placeholder="Username" required />
                </label>
                <br />
                <label>
                    <span>Password:</span>
                    <input type="password" name="password"
                        autoComplete="current-password" required />
                </label>
                <br />
                <button type="submit">Login</button>
                <p>{submitError}</p>
            </form>
        </div>
    )
}

const getServerSideProps: GetServerSideProps = withSessionSSR<LoginProps>(
    async ({
        req
    }): Promise<
        | {
            props: LoginProps
        }
        | Redirectable
    > => {
        // eslint-disable-next-line no-console
        console.log("[LOGIN] - Init server side - TIME: ", new Date())

        if (req.session?.userData) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/",
                },
            }
        }
        // eslint-disable-next-line no-console
        console.log("[LOGIN] - Exit server side - TIME: ", new Date())

        return {
            props: {},
        }
    },
)

export { getServerSideProps }