/* eslint-disable unused-imports/no-unused-vars */
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

import { LOBE_CHAT_OBSERVATION_ID, LOBE_CHAT_TRACE_ID } from '@/const/trace';
import {
  ChatMessageError,
  MessageToolCall,
  MessageToolCallChunk,
  MessageToolCallSchema,
} from '@/types/message';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Consider storing keys in environment variables for security
  dangerouslyAllowBrowser: true,
});

let assistantId: string | null = null;
let threadId: string | null = null;

// Function to initialize the assistant and thread
async function initializeAssistant(): Promise<void> {
  if (!assistantId || !threadId) {
    const assistant = await client.beta.assistants.retrieve('asst_Swu2bnyqeDIFMJ1GUrB4qi1o');
    assistantId = assistant.id;
    const thread = await client.beta.threads.create();
    threadId = thread.id;
  }
}

type SSEFinishType = 'done' | 'error' | 'abort';

export type OnFinishHandler = (
  text: string,
  context: {
    observationId?: string | null;
    toolCalls?: MessageToolCall[];
    traceId?: string | null;
    type?: SSEFinishType;
  },
) => Promise<void>;

export interface MessageTextChunk {
  text: string;
  type: 'text';
}

interface MessageToolCallsChunk {
  isAnimationActives?: boolean[];
  tool_calls: MessageToolCall[];
  type: 'tool_calls';
}

export interface FetchSSEOptions {
  fetcher?: typeof fetch;
  onAbort?: (text: string) => Promise<void>;
  onErrorHandle?: (error: ChatMessageError) => void;
  onFinish?: OnFinishHandler;
  onMessageHandle?: (chunk: MessageTextChunk | MessageToolCallsChunk) => void;
  smoothing?: boolean;
}

const createSmoothMessage = (params: { onTextUpdate: (delta: string, text: string) => void }) => {
  let buffer = '';
  // why use queue: https://shareg.pt/GLBrjpK
  let outputQueue: string[] = [];

  // eslint-disable-next-line no-undef
  let animationTimeoutId: NodeJS.Timeout | null = null;
  let isAnimationActive = false;

  // when you need to stop the animation, call this function
  const stopAnimation = () => {
    isAnimationActive = false;
    if (animationTimeoutId !== null) {
      clearTimeout(animationTimeoutId);
      animationTimeoutId = null;
    }
  };

  // define startAnimation function to display the text in buffer smooth
  // when you need to start the animation, call this function
  const startAnimation = (speed = 2) =>
    new Promise<void>((resolve) => {
      if (isAnimationActive) {
        resolve();
        return;
      }

      isAnimationActive = true;

      const updateText = () => {
        // 如果动画已经不再激活，则停止更新文本
        if (!isAnimationActive) {
          clearTimeout(animationTimeoutId!);
          animationTimeoutId = null;
          resolve();
        }

        // 如果还有文本没有显示
        // 检查队列中是否有字符待显示
        if (outputQueue.length > 0) {
          // 从队列中获取前两个字符（如果存在）
          const charsToAdd = outputQueue.splice(0, speed).join('');
          buffer += charsToAdd;

          // 更新消息内容，这里可能需要结合实际情况调整
          params.onTextUpdate(charsToAdd, buffer);

          // 设置下一个字符的延迟
          animationTimeoutId = setTimeout(updateText, 16); // 16 毫秒的延迟模拟打字机效果
        } else {
          // 当所有字符都显示完毕时，清除动画状态
          isAnimationActive = false;
          animationTimeoutId = null;
          resolve();
        }
      };

      updateText();
    });

  const pushToQueue = (text: string) => {
    outputQueue.push(...text.split(''));
  };

  return {
    isAnimationActive,
    isTokenRemain: () => outputQueue.length > 0,
    pushToQueue,
    startAnimation,
    stopAnimation,
  };
};

const createSmoothToolCalls = (params: {
  onToolCallsUpdate: (toolCalls: MessageToolCall[], isAnimationActives: boolean[]) => void;
}) => {
  let toolCallsBuffer: MessageToolCall[] = [];

  // 为每个 tool_call 维护一个输出队列和动画控制器

  // eslint-disable-next-line no-undef
  const animationTimeoutIds: (NodeJS.Timeout | null)[] = [];
  const outputQueues: string[][] = [];
  const isAnimationActives: boolean[] = [];

  const stopAnimation = (index: number) => {
    isAnimationActives[index] = false;
    if (animationTimeoutIds[index] !== null) {
      clearTimeout(animationTimeoutIds[index]!);
      animationTimeoutIds[index] = null;
    }
  };

  const startAnimation = (index: number, speed = 2) =>
    new Promise<void>((resolve) => {
      if (isAnimationActives[index]) {
        resolve();
        return;
      }

      isAnimationActives[index] = true;

      const updateToolCall = () => {
        if (!isAnimationActives[index]) {
          resolve();
        }

        if (outputQueues[index].length > 0) {
          const charsToAdd = outputQueues[index].splice(0, speed).join('');

          const toolCallToUpdate = toolCallsBuffer[index];

          if (toolCallToUpdate) {
            toolCallToUpdate.function.arguments += charsToAdd;

            // 触发 ui 更新
            params.onToolCallsUpdate(toolCallsBuffer, [...isAnimationActives]);
          }

          animationTimeoutIds[index] = setTimeout(updateToolCall, 16);
        } else {
          isAnimationActives[index] = false;
          animationTimeoutIds[index] = null;
          resolve();
        }
      };

      updateToolCall();
    });

  const pushToQueue = (toolCallChunks: MessageToolCallChunk[]) => {
    toolCallChunks.forEach((chunk) => {
      // init the tool call buffer and output queue
      if (!toolCallsBuffer[chunk.index]) {
        toolCallsBuffer[chunk.index] = MessageToolCallSchema.parse(chunk);
      }

      if (!outputQueues[chunk.index]) {
        outputQueues[chunk.index] = [];
        isAnimationActives[chunk.index] = false;
        animationTimeoutIds[chunk.index] = null;
      }

      outputQueues[chunk.index].push(...(chunk.function?.arguments || '').split(''));
    });
  };

  const startAnimations = async (speed = 2) => {
    const pools = toolCallsBuffer.map(async (_, index) => {
      if (outputQueues[index].length > 0 && !isAnimationActives[index]) {
        await startAnimation(index, speed);
      }
    });

    await Promise.all(pools);
  };
  const stopAnimations = () => {
    toolCallsBuffer.forEach((_, index) => {
      stopAnimation(index);
    });
  };

  return {
    isAnimationActives,
    isTokenRemain: () => outputQueues.some((token) => token.length > 0),
    pushToQueue,
    startAnimations,
    stopAnimations,
  };
};

/**
 * Fetch data using stream method
 */
// eslint-disable-next-line no-undef
export const fetchSSE = async (url: string, options: RequestInit & FetchSSEOptions = {}) => {
  let output = '';
  let toolCalls: undefined | MessageToolCall[];
  let triggerOnMessageHandler = false;
  let finishedType: SSEFinishType = 'done';
  let response!: Response;

  const { smoothing = true } = options;

  const textController = createSmoothMessage({
    onTextUpdate: (delta, text) => {
      output = text;
      options.onMessageHandle?.({ text: delta, type: 'text' });
    },
  });

  const toolCallsController = createSmoothToolCalls({
    onToolCallsUpdate: (toolCalls, isAnimationActives) => {
      options.onMessageHandle?.({ isAnimationActives, tool_calls: toolCalls, type: 'tool_calls' });
    },
  });

  // eslint-disable-next-line no-undef
  async function handleEventSource(content: string, options: RequestInit & FetchSSEOptions = {}) {
    try {
      await initializeAssistant();
      // Ensure assistant and thread are initialized
      if (!assistantId || !threadId) {
        throw new Error(
          'Assistant or thread is not initialized. Call initializeAssistant() first.',
        );
      }

      // Create a message in the thread
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const message = await client.beta.threads.messages.create(threadId, {
        content: content || 'Explain to me how to be a good software engineer?',
        role: 'user',
      });

      // We use the stream SDK helper to create a run with streaming.

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let run = client.beta.threads.runs
        .stream(threadId, {
          assistant_id: assistantId,
        })
        .on('textCreated', () => console.log('\nassistant > '))
        .on('textDelta', (textDelta: any) => {
          if (smoothing) {
            textController.pushToQueue(textDelta.value);

            if (!textController.isAnimationActive) textController.startAnimation();
          } else {
            output += textDelta.value;
            options.onMessageHandle?.({ text: textDelta.value, type: 'text' });
          }
        })
        .on('toolCallCreated', (toolCall: any) => console.log(`\nassistant > ${toolCall.type}\n\n`))
        .on('toolCallDelta', (toolCallDelta: any) => {
          if (toolCallDelta.type === 'code_interpreter') {
            if (toolCallDelta.code_interpreter.input) {
              process.stdout.write(toolCallDelta.code_interpreter.input);
            }
            if (toolCallDelta.code_interpreter.outputs) {
              process.stdout.write('\noutput >\n');
              toolCallDelta.code_interpreter.outputs.forEach((output: any) => {
                if (output.type === 'logs') {
                  process.stdout.write(`\n${output.logs}\n`);
                }
              });
            }
          }
        });

      return output;
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      return { error: (error as Error).message };
    }
  }

  if (typeof options.body !== 'string') {
    throw new Error('options.body must be a JSON string');
  }

  const parsedBody = JSON.parse(options.body);

  // Step 2: Access the last message in the "messages" array
  // eslint-disable-next-line unicorn/prefer-at
  const lastMessage = parsedBody.messages[parsedBody.messages.length - 1];

  // Step 3: Access the "content" of the last message
  const lastContent = lastMessage.content;

  await handleEventSource(lastContent, options);
  if (response) {
    textController.stopAnimation();
    toolCallsController.stopAnimations();

    if (response.ok) {
      // if there is no onMessageHandler, we should call onHandleMessage first
      if (!triggerOnMessageHandler) {
        output = await response.clone().text();
        options.onMessageHandle?.({ text: output, type: 'text' });
      }

      const traceId = response.headers.get(LOBE_CHAT_TRACE_ID);
      const observationId = response.headers.get(LOBE_CHAT_OBSERVATION_ID);

      if (textController.isTokenRemain()) {
        await textController.startAnimation(15);
      }

      if (toolCallsController.isTokenRemain()) {
        await toolCallsController.startAnimations(15);
      }

      await options?.onFinish?.(output, { observationId, toolCalls, traceId, type: finishedType });
    }
  }
  console.log('Response: ');
  console.log(response);
  return response;
};
