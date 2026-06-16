import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { drawingsText, specsText, projectType, codeVintage, disciplines } = req.body;

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: `You are an expert NYC preconstruction manager. Analyze the provided project documents and identify ALL scope gaps under the ${codeVintage} building code for a ${projectType} project. Focus only on these disciplines: ${disciplines.join(", ")}. Return ONLY a valid JSON array with no other text. Each item must have: id, severity (CRITICAL/HIGH/MEDIUM/LOW), discipline, title, description, drawingRef, specRef, costRisk, scheduleRisk, recommendation.`,
      messages: [{
        role: "user",
        content: `Project Type: ${projectType}\nCode: ${codeVintage}\nDisciplines: ${disciplines.join(", ")}\n\nDRAWINGS:\n${(drawingsText||"").substring(0, 8000)}\n\nSPECIFICATIONS:\n${(specsText||"").substring(0, 8000)}\n\nIdentify all scope gaps. Return JSON array only.`,
      }],
    });

    const responseText = message.content[0]?.text || "[]";
    let gaps = [];
    try {
      gaps = JSON.parse(responseText);
    } catch {
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) gaps = JSON.parse(match[0]);
    }

    const enriched = gaps.map((g, i) => ({
      ...g,
      id: g.id || `GAP-${i + 1}`,
      assignedTo: "Unassigned",
      status: "Open",
      note: "",
    }));

    res.status(200).json({ gaps: enriched });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}
