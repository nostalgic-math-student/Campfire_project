import { useEffect, useState } from "react";
import * as Client from "@web3-storage/w3up-client";
import { Signer } from "@web3-storage/w3up-client/principal/ed25519";
import * as Proof from "@web3-storage/w3up-client/proof";
import { StoreMemory } from "@web3-storage/w3up-client/stores/memory";
import { parse } from "url";

const DAOComponent = () => {
  const [client, setClient] = useState<Client.Client | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [datasetHash, setDatasetHash] = useState<string | null>(null);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Cargar la clave privada y la prueba de delegación desde las variables de entorno
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
      parse;
      console.log("Subiendo archivo a Storacha...");
      const cid = await client.uploadFile(selectedFile);
      console.log("Archivo subido con CID:", cid);
      setDatasetHash(cid.toString());
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Subir Dataset a IPFS y Crear Propuesta</h1>

      {/* Input para seleccionar archivo */}
      <input type="file" onChange={handleFileChange} />

      {/* Botón para subir archivo */}
      <button className="btn btn-primary" onClick={uploadToStoracha} disabled={!selectedFile}>
        {datasetHash ? "✅ Dataset Subido" : "Subir a Storacha"}
      </button>

      {datasetHash && <p className="text-green-500">Dataset CID: {datasetHash}</p>}
    </div>
  );
};

export default DAOComponent;
