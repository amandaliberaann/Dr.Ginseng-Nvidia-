from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

from openai import OpenAI
import os
import time
import json

# Initialize the Flask application
app = Flask(__name__)

# Enable CORS for all routes and allow all domains
CORS(app)  # This allows all domains to access the API

def return_json(obj):
    return json.loads(obj.model_dump_json())

def wait_on_run(run, thread):
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.5)
    return run

def pretty_print(messages):
    print("# Messages")
    for m in messages:
        print(f"{m['role']}: {m['content']}")  # Adjusted for compatibility with serialized format

# Initialize OpenAI client with your API key
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))

# Retrieve assistant and create a new thread globally (if needed per request, this should be moved into the function)
assistant = client.beta.assistants.retrieve(assistant_id="asst_Swu2bnyqeDIFMJ1GUrB4qi1o")
thread = client.beta.threads.create()

# Sample route for a GET request
@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, World!"}), 200

@app.route('/api/chatbot/v1/chat/completions', methods=['POST'])
def handle_data():
    try:
        # Extract JSON data from the request
        data = request.json

        # Create a message in the thread
        message = client.beta.threads.messages.create(
            thread_id=thread.id, role="user", content=data.get("content", "Explain to me how to be a good software engineer?")
        )

        # Create a new run associated with the assistant and the thread
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id,
        )

        # Wait for the run to complete
        run = wait_on_run(run, thread)

        # Retrieve messages in the thread after the created message
        messages = client.beta.threads.messages.list(
            thread_id=thread.id, order="asc", after=message.id
        )

        # Check if messages were retrieved successfully
        if not messages.data:
            print("No messages received from the API.")
            return jsonify({"error": "No messages received from the API."}), 500

        # Process the messages into a format suitable for Lobe Chat
        processed_messages = []
        for msg in messages.data:
            # Extract text content safely
            if hasattr(msg.content[0], 'text') and hasattr(msg.content[0].text, 'value'):
                content_text = msg.content[0].text.value
            else:
                content_text = str(msg.content)

            # Append to processed messages list
            processed_messages.append({
                "role": msg.role,
                "content": content_text
            })

        # Format the response in a structure expected by your frontend
        response_data = {
            "id": "response-id",  # Optional: include unique response identifiers if needed
            "model": "gpt-4o-mini",  # Adjust this based on your model version
            "object": "chat.completion",
            "choices": [
                {
                    "index": i,
                    "message": {
                        "role": m["role"],
                        "content": m["content"]
                    },
                    "finish_reason": "stop"
                }
                for i, m in enumerate(processed_messages)
            ]
        }

        print(response_data)
        # Serialize response to JSON
        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 400

# Error handler for 404 - Not Found
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

# Error handler for 500 - Internal Server Error
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# Main entry point to run the application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
