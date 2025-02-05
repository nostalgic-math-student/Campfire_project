"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const DAOComponent = () => {
  const [newProposal, setNewProposal] = useState("");

  // Usa el contrato DAO registrado en deployedContracts.ts
  const { writeContractAsync, isPending } = useScaffoldWriteContract({ contractName: "DAO" });

  const handleCreateProposal = async () => {
    try {
      // Llama al contrato con los argumentos correspondientes
      await writeContractAsync(
        {
          functionName: "createProposal", // Nombre de la función en el contrato
          args: [newProposal], // Argumentos que requiere la función
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log("📦 Transaction blockHash", txnReceipt.blockHash);
          },
        },
      );
    } catch (e) {
      console.error("Error creando la propuesta", e);
    }
  };

  return (
    <div>
      <h1>Crear Nueva Propuesta</h1>
      <input
        type="text"
        placeholder="Descripción de la propuesta"
        className="input border border-primary"
        onChange={e => setNewProposal(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleCreateProposal} disabled={isPending}>
        {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Crear Propuesta"}
      </button>
    </div>
  );
};
