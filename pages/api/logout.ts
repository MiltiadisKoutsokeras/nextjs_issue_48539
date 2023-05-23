import { NextApiRequest, NextApiResponse } from "next"
import { withSessionAPI } from "../../lib/ironsession"

export default withSessionAPI(handler)

async function handler(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy()
    res.status(200).json({ success: true })
}
