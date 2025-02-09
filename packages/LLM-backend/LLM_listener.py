from web3 import Web3
import requests

# Conectar con la blockchain (ejemplo con una RPC local)
w3 = Web3(Web3.HTTPProvider(" http://127.0.0.1:8545/"))

# Dirección del contrato y ABI
contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
abi =[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "initialOwner",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": True,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": False,
      "inputs": [
        {
          "indexed": True,
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "indexed": False,
          "internalType": "string",
          "name": "datasetHash",
          "type": "string"
        },
        {
          "indexed": False,
          "internalType": "uint256",
          "name": "totalTrainings",
          "type": "uint256"
        }
      ],
      "name": "TrainingStarted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "proposalId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "datasetHash",
          "type": "string"
        }
      ],
      "name": "trainModel",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "trainingCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]# ABI de AITrainer.sol

contract = w3.eth.contract(address=contract_address, abi=abi)

# Callback para detectar eventos
def handle_event(event):
    dataset_cid = event["args"]["datasetCID"]
    print(f"📢 Evento detectado: Entrenamiento solicitado con CID {dataset_cid}")

    # Llamar a la API de entrenamiento
    response = requests.post("https://d1a2-35-243-235-7.ngrok-free.app/api/v1/add_cid", json={"cid": dataset_cid})
    print(response.json())

# Escuchar eventos en tiempo real
event_filter = contract.events.TrainingStarted.create_filter(from_block="latest")
while True:
    for event in event_filter.get_new_entries():
        handle_event(event)
