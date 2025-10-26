export const STYLE_CONFIGS = {
  professional: {
    tone: 'professional and authoritative',
    guidelines: 'Use industry terminology, maintain formal language, focus on value and insights. Avoid emojis and casual expressions.',
    structure: 'Start with a strong statement or statistic, develop the argument, conclude with actionable takeaway.'
  },
  casual: {
    tone: 'friendly and conversational',
    guidelines: 'Use everyday language, include 1-2 relevant emojis, be relatable and approachable. Keep it light and engaging.',
    structure: 'Start with a relatable hook, share thoughts naturally, end with a question or call to action.'
  },
  funny: {
    tone: 'humorous and entertaining',
    guidelines: 'Use wit, wordplay, or relatable humor. Include 2-3 playful emojis. Keep it lighthearted but not offensive.',
    structure: 'Setup with a relatable situation, deliver the punchline or twist, engage with humor.'
  },
  inspirational: {
    tone: 'motivational and uplifting',
    guidelines: 'Use empowering language, include 1-2 inspirational emojis, focus on possibilities and growth. Be authentic.',
    structure: 'Start with an inspiring observation, build motivation, end with an empowering message.'
  },
  storytelling: {
    tone: 'narrative and engaging',
    guidelines: 'Tell a compelling story with a clear beginning, middle, and end. Use vivid details, include 1-2 relevant emojis.',
    structure: 'Set the scene, develop the narrative, conclude with the lesson or insight.'
  }
};

export const LENGTH_CONFIGS = {
  short: { tokens: 150, description: '1-2 sentences, quick and punchy' },
  medium: { tokens: 300, description: '3-5 sentences, balanced content' },
  long: { tokens: 500, description: '6+ sentences, detailed and comprehensive' }
};

export const PROMPTS = {
  analyzeTopicSystem: `You are an expert social media content strategist. Analyze the given topic and provide strategic insights for creating engaging social media content.

Your task is to:
1. Identify the main themes and key points
2. Determine the best angle or hook for social media
3. Suggest emotional appeals or engagement strategies
4. Consider the target audience

Provide your analysis in a structured JSON format with these fields:
- themes: array of main themes
- hook: suggested engaging hook
- keyPoints: array of key points to emphasize
- emotionalAppeal: type of emotional appeal to use
- targetAudience: description of likely audience`,

  analyzeTopicUser: (topic, style, styleConfig, lengthConfig) => `Topic: "${topic}"
Style: ${style} (${styleConfig.tone})
Length: ${lengthConfig.description}

Analyze this topic for a social media post.`,

  generateContentSystem: (styleConfig, lengthConfig, analysis) => `You are an expert social media copywriter. Create engaging, authentic social media posts that resonate with audiences.

IMPORTANT GUIDELINES:
- Tone: ${styleConfig.tone}
- Style Guidelines: ${styleConfig.guidelines}
- Structure: ${styleConfig.structure}
- Length: ${lengthConfig.description}
- Write in a natural, human voice
- Make it shareable and engaging
- DO NOT use hashtags in the post content (users can add them separately)
- DO NOT include meta-commentary or explanations
- Output ONLY the post content itself

Analysis Context:
${JSON.stringify(analysis, null, 2)}`,

  generateContentUser: (style, topic) => `Create a ${style} social media post about: "${topic}"

Write the post content now:`
};