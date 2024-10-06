import { MESSAGE_CANCEL_FLAT } from '@/const/message';
import { LOBE_CHAT_OBSERVATION_ID, LOBE_CHAT_TRACE_ID } from '@/const/trace';
import { ChatErrorType } from '@/types/fetch';
import {
  ChatMessageError,
  MessageToolCall,
  MessageToolCallChunk,
  MessageToolCallSchema,
} from '@/types/message';

import { fetchEventSource } from './fetchEventSource';
import { getMessageError } from './parseError';
import { parseToolCalls } from './parseToolCalls';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Consider storing keys in environment variables for security
  dangerouslyAllowBrowser: true
});

let assistantId = '';
let threadId = '';

// Function to initialize the assistant and thread
async function initializeAssistant() {
  console.log(process.env.OPENAI_API_KEY);
  const assistant = await client.beta.assistants.retrieve('asst_Swu2bnyqeDIFMJ1GUrB4qi1o');
  const thread = await client.beta.threads.create();
  assistantId = assistant.id;
  threadId = thread.id;
};



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
  console.log("url: ");
  console.log(url);
  console.log("Option: ");
  console.log(options);

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
  console.log(1);

  // if (typeof options.body === 'string') {
  //   try {
  //     // Parse the existing body
  //     const bodyJson = JSON.parse(options.body);
      
  //     // Add the assistant_id
  //     bodyJson.assistant_id = "asst_Swu2bnyqeDIFMJ1GUrB4qi1o"; // Replace with your actual assistant ID
      
  //     // Re-stringify the modified body
  //     options.body = JSON.stringify(bodyJson);
  //   } catch (error) {
  //     console.error("Failed to parse or modify the request body:", error);
  //   }
  // }
  console.log(options);
  async function handleEventSource(content, options) {
    try {
      await initializeAssistant();
      // Ensure assistant and thread are initialized
      if (!assistantId || !threadId) {
        throw new Error('Assistant or thread is not initialized. Call initializeAssistant() first.');
      }
      console.log(content);
      console.log(assistantId);
      console.log(threadId);
      // Create a message in the thread
      const message = await client.beta.threads.messages.create(threadId, {
        role: 'user',
        content: content || 'Explain to me how to be a good software engineer?',
      });
  
      // We use the stream SDK helper to create a run with streaming.
      let run = client.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId
      })
      .on('textCreated', (text: any) => console.log('\nassistant > '))
      .on('textDelta', (textDelta: any, snapshot: any) => {

        if (smoothing) {
          textController.pushToQueue(textDelta.value);

          if (!textController.isAnimationActive) textController.startAnimation();
        } else {
          output += textDelta.value;
          options.onMessageHandle?.({ text: textDelta.value, type: 'text' });
        }})
      .on('toolCallCreated', (toolCall: any) => console.log(`\nassistant > ${toolCall.type}\n\n`))
      .on('toolCallDelta', (toolCallDelta: any, snapshot: any) => {
        if (toolCallDelta.type === 'code_interpreter') {
          if (toolCallDelta.code_interpreter.input) {
            process.stdout.write(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) {
            process.stdout.write("\noutput >\n");
            toolCallDelta.code_interpreter.outputs.forEach((output: any) => {
              if (output.type === "logs") {
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
  };

  const parsedBody = JSON.parse(options.body);

  // Step 2: Access the last message in the "messages" array
  const lastMessage = parsedBody.messages[parsedBody.messages.length - 1];

  // Step 3: Access the "content" of the last message
  const lastContent = lastMessage.content;

  response = await handleEventSource(lastContent, options);
  // await fetchEventSource(url, {
  //   body: options.body,
  //   fetch: options?.fetcher,
  //   headers: options.headers as Record<string, string>,
  //   method: options.method,
  //   onerror: (error) => {
  //     if (error === MESSAGE_CANCEL_FLAT || (error as TypeError).name === 'AbortError') {
  //       finishedType = 'abort';
  //       options?.onAbort?.(output);
  //       textController.stopAnimation();
  //     } else {
  //       finishedType = 'error';

  //       options.onErrorHandle?.(
  //         error.type
  //           ? error
  //           : {
  //               body: {
  //                 message: error.message,
  //                 name: error.name,
  //                 stack: error.stack,
  //               },
  //               message: error.message,
  //               type: ChatErrorType.UnknownChatFetchError,
  //             },
  //       );
  //       return;
  //     }
  //   },
  //   onmessage: (ev) => {
  //     triggerOnMessageHandler = true;
  //     let data;
  //     try {
  //       data = JSON.parse(ev.data);
  //       console.log("check data");
  //       console.log(data);
  //     } catch (e) {
  //       console.warn('parse error:', e);
  //       options.onErrorHandle?.({
  //         body: {
  //           context: {
  //             chunk: ev.data,
  //             error: { message: (e as Error).message, name: (e as Error).name },
  //           },
  //           message:
  //             'chat response streaming chunk parse error, please contact your API Provider to fix it.',
  //         },
  //         message: 'parse error',
  //         type: 'StreamChunkError',
  //       });

  //       return;
  //     }

  //     switch (ev.event) {
  //       case 'error': {
  //         finishedType = 'error';
  //         options.onErrorHandle?.(data);
  //         break;
  //       }

  //       case 'text': {
  //         if (smoothing) {
  //           textController.pushToQueue(data);

  //           if (!textController.isAnimationActive) textController.startAnimation();
  //         } else {
  //           output += data;
  //           options.onMessageHandle?.({ text: data, type: 'text' });
  //         }

  //         break;
  //       }

  //       case 'tool_calls': {
  //         // get finial
  //         // if there is no tool calls, we should initialize the tool calls
  //         if (!toolCalls) toolCalls = [];
  //         toolCalls = parseToolCalls(toolCalls, data);

  //         if (smoothing) {
  //           // make the tool calls smooth

  //           // push the tool calls to the smooth queue
  //           toolCallsController.pushToQueue(data);
  //           // if there is no animation active, we should start the animation
  //           if (toolCallsController.isAnimationActives.some((value) => !value)) {
  //             toolCallsController.startAnimations();
  //           }
  //         } else {
  //           options.onMessageHandle?.({
  //             tool_calls: toolCalls,
  //             type: 'tool_calls',
  //           });
  //         }
  //       }
  //     }
  //   },
  //   onopen: async (res) => {
  //     response = res.clone();
  //     // 如果不 ok 说明有请求错误
  //     if (!response.ok) {
  //       throw await getMessageError(res);
  //     }
  //   },
  //   signal: options.signal,
  // });

  console.log(2);
  // only call onFinish when response is available
  // so like abort, we don't need to call onFinish
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
  console.log("Response: ");
  console.log(response);
  return response;
};
