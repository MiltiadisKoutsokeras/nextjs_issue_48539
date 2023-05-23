import { withSessionAPI } from "../../lib/ironsession"
import { UserData } from "../../lib/user"

import type { NextApiRequest, NextApiResponse } from "next"
interface Data {
    message?: string
}

export default withSessionAPI(handler)

function handler(req: NextApiRequest, res: NextApiResponse<UserData | Data>) {
    const userData = req.session.userData as UserData
    userData
        ? res.status(200).json(userData)
        : res.status(401).json({ message: "Not Authorized" })
}
