export function buildFullPrompt({
  selectedTemplate,
  storyLength,
  userPrompt,
}: {
  selectedTemplate: { category: string; type: string };
  storyLength: string;
  userPrompt: string;
}) {
  const lengthMap: Record<string, string> = {
    short: "A concise short story (1–2 minute read).",
    medium: "A medium-length story (3–5 minute read).",
    long: "A long, detailed story (6–10 minute read).",
  };

  return `
Write a ${lengthMap[storyLength]}
Category: ${selectedTemplate.category}
Type: ${selectedTemplate.type}

Story idea: ${userPrompt}

Start directly with the story. 
Do not include any introductions, disclaimers, or explanations. 
Only return the finished story text.
  `.trim();
}
