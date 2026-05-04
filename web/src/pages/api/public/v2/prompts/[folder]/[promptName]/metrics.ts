import { NextApiRequest, NextApiResponse } from "next";
import originalHandler from "../../[promptName]/metrics";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const folder = req.query.folder as string;
  const name = req.query.promptName as string;

  if (folder && name) {
    req.query.promptName = `${folder}/${name}`;
  }

  return originalHandler(req, res);
}
