const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    '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',
});

let assistantId = '';
let threadId = '';

// Function to initialize the assistant and thread
async function initializeAssistant() {
  const assistant = await client.beta.assistants.retrieve('asst_Swu2bnyqeDIFMJ1GUrB4qi1o');
  const thread = await client.beta.threads.create();
  assistantId = assistant.id;
  threadId = thread.id;
}

// Function to wait for a run to complete
async function waitOnRun(run, threadId) {
  while (run.status === 'queued' || run.status === 'in_progress') {
    // eslint-disable-next-line no-param-reassign
    run = await client.beta.threads.runs.retrieve(threadId, run.id);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    }); // Wait for 0.5 seconds
  }
  return run;
}

// Main function to process chatbot interaction
async function handleChatbotInteraction(content) {
  try {
    // Ensure assistant and thread are initialized
    if (!assistantId || !threadId) {
      throw new Error('Assistant or thread is not initialized. Call initializeAssistant() first.');
    }

    // Create a message in the thread
    const message = await client.beta.threads.messages.create(threadId, {
      content: content || 'Explain to me how to be a good software engineer?',
      role: 'user',
    });

    // We use the stream SDK helper to create a run with streaming.
    // The SDK provides helpful event listeners to handle the streamed response.
    let run = client.beta.threads.runs
      .stream(threadId, {
        assistant_id: assistantId,
      })
      .on('textCreated', (text) => process.stdout.write('\nassistant > '))
      .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
      .on('toolCallCreated', (toolCall) =>
        process.stdout.write(`\nassistant > ${toolCall.type}\n\n`),
      )
      .on('toolCallDelta', (toolCallDelta, snapshot) => {
        if (toolCallDelta.type === 'code_interpreter') {
          if (toolCallDelta.code_interpreter.input) {
            process.stdout.write(toolCallDelta.code_interpreter.input);
          }
          if (toolCallDelta.code_interpreter.outputs) {
            process.stdout.write('\noutput >\n');
            toolCallDelta.code_interpreter.outputs.forEach((output) => {
              if (output.type === 'logs') {
                process.stdout.write(`\n${output.logs}\n`);
              }
            });
          }
        }
      });

    // Wait for the run to complete
    run = await waitOnRun(run, threadId);

    // Retrieve messages in the thread after the created message
    const messages = await client.threads.messages.list({
      after: message.id,
      order: 'asc',
      threadId: threadId,
    });

    // Check if messages were retrieved successfully
    if (!messages.data.length) {
      console.log('No messages received from the API.');
      return { error: 'No messages received from the API.' };
    }

    // Process the messages into a suitable format
    const processedMessages = messages.data.map((msg) => ({
      content: msg.content?.[0]?.text?.value || String(msg.content),
      role: msg.role,
    }));

    // Format the response for the frontend
    const responseData = {
      choices: processedMessages.map((m, i) => ({
        finish_reason: 'stop',
        index: i,
        message: {
          content: m.content,
          role: m.role,
        },
      })),
      id: 'response-id',
      // Optional: unique identifier
      model: 'gpt-4o-mini',
      // Adjust this based on the model version
      object: 'chat.completion',
    };

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return { error: error.message };
  }
}

module.exports = { handleChatbotInteraction, initializeAssistant };
