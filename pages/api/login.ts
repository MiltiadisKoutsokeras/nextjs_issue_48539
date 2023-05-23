import { NextApiRequest, NextApiResponse } from "next"
import { withSessionAPI } from "../../lib/ironsession"

export default withSessionAPI(handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = req.body

    // Check against hardcoded password = secret
    if (password != 'secret') {
        res.status(401).json({
            error: 'Wrong password',
        })
    } else {
        req.session.userData = {
            username: username,
            firstName: 'First name',
            lastName: 'Last name'
        }
        await req.session.save()

        res.status(200).json({ success: true })
    }
}
