import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
} from "next"

// Iron Session for cookie encryption https://github.com/vvo/iron-session
import type { IronSessionOptions } from "iron-session"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import { UserData } from "./user"

// Options controlling the Iron Session behavior
const ironSessionOptions: IronSessionOptions = {
    // Name of the encrypted user state cookie
    cookieName: process.env.COOKIE_USER_STATE_NAME as string,
    // Secret password for encrypting/decrypting the cookie, at least 32 chars
    password: process.env.COOKIE_USER_STATE_SECRET as string,
    cookieOptions: {
        // secure: true should be used in production (HTTPS)
        // but can't be used in development (HTTP)
        secure: process.env.SECURE_COOKIES === "true",
    },
}

// Wrapper for applying Iron Session options in API Routes
export function withSessionAPI(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, ironSessionOptions)
}

// Wrapper for applying Iron Session options in Server Side Rendering pages
export function withSessionSSR<P extends { [key: string]: unknown }>(
    handler: (
        context: GetServerSidePropsContext,
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    // eslint-disable-next-line no-console
    console.log(
        "[IRON SESSION] - withSessionSSR function triggered - TIME: ",
        new Date(),
    )
    return withIronSessionSsr(handler, ironSessionOptions)
}

// Typing session data with TypeScript:
// https://github.com/vvo/iron-session#typing-session-data-with-typescript
declare module "iron-session" {
    interface IronSessionData {
        userData?: UserData
    }
}
