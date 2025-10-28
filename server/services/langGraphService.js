import { ChatOllama } from '@langchain/ollama';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StateGraph } from '@langchain/langgraph';
import { Annotation } from '@langchain/langgraph';
import { STYLE_CONFIGS, LENGTH_CONFIGS, PROMPTS } from '../config/aiConfig.js';

const GraphState = Annotation.Root({
  topic: Annotation({
    reducer: (prev, next) => next ?? prev,
  }),
  style: Annotation({
    reducer: (prev, next) => next ?? prev,
  }),
  length: Annotation({
    reducer: (prev, next) => next ?? prev,
  }),
  analysis: Annotation({
    reducer: (prev, next) => next ?? prev,
  }),
  generatedContent: Annotation({
    reducer: (prev, next) => next ?? prev,
  }),
  metadata: Annotation({
    reducer: (prev, next) => next ?? prev,
  }),
  error: Annotation({
    reducer: (prev, next) => next ?? prev,
  }),
});

class LangGraphService {
  constructor() {
    this.llm = new ChatOllama({
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
    });

    this.graph = this.buildGraph();
  }

  buildGraph() {
    const workflow = new StateGraph(GraphState);

    workflow.addNode('analyzeTopic', this.analyzeTopic.bind(this));
    workflow.addNode('generateContent', this.generateContent.bind(this));

    workflow.addEdge('__start__', 'analyzeTopic');
    workflow.addEdge('analyzeTopic', 'generateContent');
    workflow.addEdge('generateContent', '__end__');

    return workflow.compile();
  }

  async analyzeTopic(state) {
    try {
      const { topic, style, length } = state;

      const styleConfig = STYLE_CONFIGS[style] || STYLE_CONFIGS.casual;
      const lengthConfig = LENGTH_CONFIGS[length] || LENGTH_CONFIGS.medium;

      const systemPrompt = PROMPTS.analyzeTopicSystem;
      const userPrompt = PROMPTS.analyzeTopicUser(topic, style, styleConfig, lengthConfig);

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ];

      const response = await this.llm.invoke(messages);

      let analysis;
      try {
        const content = response.content.trim();
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        const jsonContent = jsonMatch ? jsonMatch[1] : content;
        analysis = JSON.parse(jsonContent);
      } catch (parseError) {
        analysis = {
          themes: [topic],
          hook: topic,
          keyPoints: [topic],
          emotionalAppeal: 'informative',
          targetAudience: 'general audience'
        };
      }

      return {
        ...state,
        analysis,
        metadata: {
          ...state.metadata,
          analysisCompleted: true,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        ...state,
        error: `Topic analysis failed: ${error.message}`,
        analysis: {
          themes: [state.topic],
          hook: state.topic,
          keyPoints: [state.topic],
          emotionalAppeal: 'informative',
          targetAudience: 'general audience'
        }
      };
    }
  }

  async generateContent(state) {
    try {
      const { topic, style, length, analysis } = state;

      const styleConfig = STYLE_CONFIGS[style] || STYLE_CONFIGS.casual;
      const lengthConfig = LENGTH_CONFIGS[length] || LENGTH_CONFIGS.medium;

      const systemPrompt = PROMPTS.generateContentSystem(styleConfig, lengthConfig, analysis);
      const userPrompt = PROMPTS.generateContentUser(style, topic);

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ];

      const response = await this.llm.invoke(messages);
      const generatedContent = response.content.trim();

      const cleanedContent = generatedContent
        .replace(/^["']|["']$/g, '')
        .replace(/^Post:\s*/i, '')
        .trim();

      return {
        ...state,
        generatedContent: cleanedContent,
        metadata: {
          ...state.metadata,
          contentGenerated: true,
          finalStyle: style,
          finalLength: length,
          wordCount: cleanedContent.split(/\s+/).length,
          characterCount: cleanedContent.length,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error in generateContent:', error);
      return {
        ...state,
        error: `Content generation failed: ${error.message}`,
        generatedContent: null
      };
    }
  }

  async generatePost(topic, style = 'casual', length = 'medium') {
    try {
      const initialState = {
        topic: topic.trim(),
        style,
        length,
        analysis: null,
        generatedContent: null,
        metadata: {
          startTime: new Date().toISOString()
        },
        error: null
      };

      const result = await this.graph.invoke(initialState);

      if (!result.generatedContent) {
        throw new Error('Failed to generate content');
      }

      return {
        success: true,
        data: {
          generatedContent: result.generatedContent,
          originalInput: topic,
          style,
          length,
          metadata: result.metadata,
          analysis: result.analysis
        }
      };
    } catch (error) {
      console.error('Error in generatePost:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to generate post'
      };
    }
  }
}

export default new LangGraphService();