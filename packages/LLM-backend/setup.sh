#!/bin/bash

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Initializes ollama service on background
ollama serve &

# Download mistral model
ollama pull mistral

# Install dependencies needed for the project
pip install chromadb langchain openai tiktoken fastapi uvicorn requests pyngrok langchain-ollama

# Configure ngrok authtoken needed for API exposure
ngrok config add-authtoken NGROK-AUTH-TOKEN