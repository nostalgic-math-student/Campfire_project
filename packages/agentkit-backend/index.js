require("dotenv").config();
const { Agent } = require("@coinbase/agentkit");
const { ethers } = require("ethers");
const fs = require("fs");

// Configuración de conexión a la blockchain
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const abiPath = "./AITrainer_ABI.json";
const trainerAbi = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

const trainerContract = new ethers.Contract(
  process.env.TRAINER_CONTRACT_ADDRESS,
  trainerAbi,
  wallet
);
// Definir el Agente
const aiTrainerAgent = new Agent({
  name: "AITrainerAgent",
  description: "Ejecuta entrenamiento de LLM basado en decisiones de la DAO",
  actions: {
    trainModel: {
      execute: async (params) => {
        const { proposalId, datasetHash } = params;
        console.log(`Ejecutando entrenamiento para propuesta: ${proposalId}`);

        const tx = await trainerContract.trainModel(proposalId, datasetHash);
        await tx.wait();
        console.log("Entrenamiento ejecutado con éxito!");
      }
    }
  }
});

// Escuchar eventos de la DAO cuando se apruebe una propuesta
aiTrainerAgent.listen("ProposalApproved", async (event) => {
  const { proposalId, datasetHash } = event.args;
  await aiTrainerAgent.actions.trainModel({ proposalId, datasetHash });
});

console.log("✅ AI Trainer Agent corriendo...");
