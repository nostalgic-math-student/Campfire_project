import os
import time
import psutil
import subprocess
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import ollama
from pyngrok import ngrok
from threading import Thread

# Create the API with FastAPI
app = FastAPI()

# Schema for chat requests
class ChatRequest(BaseModel):
    messages: list
    model: str = "mistral"
    temperature: float = 0.7

# Chat endpoint
@app.post("/api/v1/chat")
def chat(request: ChatRequest):
    response = ollama.chat(
        model=request.model,
        messages=request.messages,
        options={"temperature": request.temperature}
    )
    return {"response": response["message"]["content"]}

# Function to close ngrok and Uvicorn processes before starting new instances
def close_processes():
    """Closes any active ngrok and Uvicorn sessions before restarting."""
    try:
        print("🔄 Closing ngrok and Uvicorn processes...")

        # Close active tunnels using pyngrok API
        tunnels = ngrok.get_tunnels()
        for tunnel in tunnels:
            print(f"⛔ Closing tunnel: {tunnel.public_url}")
            ngrok.disconnect(tunnel.public_url)

        # Kill previous ngrok and Uvicorn processes
        os.system("pkill -f ngrok")
        os.system("pkill -f uvicorn")

        time.sleep(5)  # Wait to ensure processes are fully terminated
        print("✅ All previous processes have been closed.")

    except Exception as e:
        print(f"⚠️ Error closing processes: {e}")

# Function to restart ngrok every 2 hours while ensuring Google Colab doesn't kill it
def restart_ngrok():
    while True:
        try:
            print("🔄 Renewing ngrok to keep the API active...")
            close_processes()  # Ensure no previous sessions exist
            time.sleep(2)
            global public_url
            public_url = ngrok.connect(8000).public_url
            print(f"🔥 New public API URL: {public_url}")
            print(f"🕒 Last renewal: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        except Exception as e:
            print(f"⚠️ Error restarting ngrok: {e}")

        # Keep logs visible every 30 minutes
        for i in range(4):  
            print(f"⌛ Waiting for renewal ({30 * (i + 1)} minutes elapsed)...")
            time.sleep(1800)  

# Function to start Uvicorn in a separate process and prevent Google Colab from stopping it
def run_uvicorn():
    print("🚀 Starting Uvicorn...")
    subprocess.Popen(["nohup", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "&"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Close ngrok and Uvicorn before starting new instances
close_processes()

# Start ngrok for the first time
public_url = ngrok.connect(8000).public_url
print(f"🔥 Initial public API URL: {public_url}")

# Run Uvicorn in a separate thread
Thread(target=run_uvicorn).start()

# Run ngrok in a separate thread
Thread(target=restart_ngrok).start()

# 🔴 Infinite loop to prevent Google Colab from closing the session
while True:
    print("🔄 Keeping Google Colab session alive...")
    time.sleep(600)  # Print a message every 10 minutes
