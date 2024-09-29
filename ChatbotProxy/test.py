from openai import OpenAI
import os
import time
from typing_extensions import override
from openai import AssistantEventHandler

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
        print(f"{m.role}: {m.content[0].text.value}")
    print()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))

assistant = client.beta.assistants.retrieve(assistant_id="asst_Swu2bnyqeDIFMJ1GUrB4qi1o")

thread = client.beta.threads.create()

message = client.beta.threads.messages.create(
    thread_id=thread.id, role="user", content="Explain to me show to be a good software engineer?"
)

run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id,
)

run = wait_on_run(run, thread)

messages = client.beta.threads.messages.list(
    thread_id=thread.id, order="asc", after=message.id
)

pretty_print(messages)