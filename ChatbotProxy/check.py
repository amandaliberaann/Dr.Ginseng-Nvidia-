from openai import OpenAI
import os
import json

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))

# Create a chat completion
completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Write a haiku about recursion in programming."}
    ]
)

# Convert the completion object to a JSON-serializable dictionary
completion_dict = {
    "id": completion.id,
    "model": completion.model,
    "object": completion.object,
    "created": completion.created,
    "choices": [
        {
            "index": choice.index,
            "finish_reason": choice.finish_reason,
            "message": {
                "role": choice.message.role,
                "content": choice.message.content,
            }
        }
        for choice in completion.choices
    ],
    "usage": {
        "prompt_tokens": completion.usage.prompt_tokens,
        "completion_tokens": completion.usage.completion_tokens,
        "total_tokens": completion.usage.total_tokens,
    }
}

# Convert the dictionary to a JSON string
completion_json = json.dumps(completion_dict, indent=4)

# Print the JSON string
print(completion_json)
