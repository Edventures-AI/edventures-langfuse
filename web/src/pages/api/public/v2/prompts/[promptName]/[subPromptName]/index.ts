import { NextApiRequest, NextApiResponse } from "next";
// Import the default handler from one directory up
import originalHandler from "../index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Next.js maps the first segment to promptName, and the second to subPromptName
  const folder = req.query.promptName as string;
  const name = req.query.subPromptName as string;

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

  // Overwrite the query parameter to match what the original handler expects
  req.query.promptName = fullPromptName;

  // Pass to the original handler
  return originalHandler(req, res);
}