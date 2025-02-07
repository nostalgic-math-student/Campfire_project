// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AITrainer is Ownable {
    uint256 public trainingCount; // Contador de entrenamientos realizados

    event TrainingStarted(uint256 indexed proposalId, string datasetHash, uint256 totalTrainings);

    constructor(address initialOwner) Ownable(initialOwner) {
        trainingCount = 0; // Inicializa el contador en 0
    }

    function trainModel(uint256 proposalId, string memory datasetHash) external{
        trainingCount++; // Incrementa el contador cada vez que se entrena

        emit TrainingStarted(proposalId, datasetHash, trainingCount);
    }
}
