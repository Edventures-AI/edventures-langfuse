import { NextApiRequest, NextApiResponse } from "next";
// Import the original handler so we don't duplicate logic
import originalHandler from "../../[promptName]/index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const folder = req.query.folder as string;
  const name = req.query.promptName as string;

  // Reconstruct the slash that the proxy stripped
  let fullPromptName = `${folder}/${name}`;

  // Aggressively decode in case of leftover double-encoding (e.g., %252F)
  try {
    let decoded = decodeURIComponent(fullPromptName);
    while (decoded !== fullPromptName) {
      fullPromptName = decoded;
      decoded = decodeURIComponent(fullPromptName);
    }
  } catch (e) {
    // silently ignore decode errors
  }

  // Overwrite the query parameter and pass to the original handler
  req.query.promptName = fullPromptName;
  return originalHandler(req, res);
}
