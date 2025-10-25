import langGraphService from '../services/langGraphService.js';

export const generatePostWithAI = async (req, res) => {
  const { topic, style, length } = req.body;

  console.log(`Generating AI post for topic: "${topic}", style: ${style}, length: ${length}`);

  if (!process.env.OLLAMA_BASE_URL) {
    return res.status(500).json({
      success: false,
      message: 'AI service is not configured. Please contact the administrator.'
    });
  }

  const result = await langGraphService.generatePost(topic, style, length);

  if (!result.success) {
    console.error('AI generation failed:', result.error);
    return res.status(500).json({
      success: false,
      message: result.message || 'Failed to generate post',
      error: result.error
    });
  }

  console.log('AI post generated successfully');

  return res.status(200).json({
    success: true,
    message: 'Post generated successfully',
    data: {
      generatedContent: result.data.generatedContent,
      originalInput: result.data.originalInput,
      style: result.data.style,
      length: result.data.length,
      metadata: result.data.metadata,
      analysis: result.data.analysis
    }
  });
};