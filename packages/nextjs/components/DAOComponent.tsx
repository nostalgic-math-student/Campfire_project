import { useEffect, useState } from "react";
import * as Client from "@web3-storage/w3up-client";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const DAOComponent = () => {
  const [client, setClient] = useState<Client.Client | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [datasetHash, setDatasetHash] = useState<string | null>(null);
  const [proposalDescription, setProposalDescription] = useState("");

  const { writeContractAsync, isPending } = useScaffoldWriteContract("DAO");

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const principal = Signer.parse(process.env.NEXT_PUBLIC_KEY as string);
        const store = new StoreMemory();
        const newClient = await Client.create({ principal, store });

        const proof = await Proof.parse(process.env.NEXT_PUBLIC_PROOF as string);
        const space = await newClient.addSpace(proof);
        await newClient.setCurrentSpace(space.did());

        console.log("Storacha Client inicializado correctamente");
        setClient(newClient);
      } catch (error) {
        console.error("Error inicializando el cliente de Storacha:", error);
      }
    };

    initializeClient();
  }, []);

  // Función para manejar la selección de archivos
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Función para subir archivos a Storacha
  const uploadToStoracha = async () => {
    if (!client || !selectedFile) {
      alert("Selecciona un archivo primero y espera la inicialización del cliente");
      return;
    }

    try {
      console.log("Subiendo archivo a Storacha...");
      const cid = await client.uploadFile(selectedFile);
      console.log("Archivo subido con CID:", cid);
      setDatasetHash(cid.toString());
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  };

  // Función para crear una propuesta en la DAO
  const handleCreateProposal = async () => {
    if (!proposalDescription || !datasetHash) {
      alert("Falta descripción o datasetHash. Sube un dataset primero.");
      return;
    }

    try {
      await writeContractAsync({
        functionName: "createProposal",
        args: [proposalDescription, datasetHash],
      });

      console.log("✅ Propuesta creada con datasetHash:", datasetHash);
      alert("Propuesta enviada a la DAO");
    } catch (error) {
      console.error("Error creando propuesta:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Subir Dataset a IPFS y Crear Propuesta</h1>

      {/* Input para seleccionar el archivo */}
      <input type="file" onChange={handleFileChange} />

      {/* Botón para subir a IPFS */}
      <button className="btn btn-primary" onClick={uploadToStoracha} disabled={!selectedFile}>
        {datasetHash ? "✅ Dataset Subido" : "Subir a Storacha"}
      </button>

      {datasetHash && <p className="text-green-500">Dataset CID: {datasetHash}</p>}

      {/* Input para la descripción de la propuesta */}
      <input
        type="text"
        placeholder="Descripción de la propuesta"
        className="input border border-primary"
        onChange={e => setProposalDescription(e.target.value)}
        disabled={!datasetHash} // Se habilita solo después de subir el dataset
      />

      {/* Botón para crear la propuesta en la DAO */}
      <button className="btn btn-secondary" onClick={handleCreateProposal} disabled={isPending || !datasetHash}>
        {isPending ? <span className="loading loading-spinner"></span> : "Crear Propuesta"}
      </button>
    </div>
  );
};

export default DAOComponent;
