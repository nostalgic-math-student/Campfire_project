// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IAITrainer {
    function trainModel(uint256 proposalId, string memory datasetHash) external;
}

contract DAO is Ownable {
    struct Proposal {
        string description;
        uint256 votes;
        bool executed;
        string datasetHash; // Hash del dataset aprobado para el entrenamiento
    }

    Proposal[] public proposals;
    IAITrainer public aiTrainer;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId, string datasetHash);

    constructor(address initialOwner, address _aiTrainer) Ownable(initialOwner) {
        aiTrainer = IAITrainer(_aiTrainer);
    }

    function createProposal(string memory _description, string memory _datasetHash) public onlyOwner {
        proposals.push(Proposal(_description, 0, false, _datasetHash));
        emit ProposalCreated(proposals.length - 1, _description);
    }

    function vote(uint256 _proposalId) public {
        require(_proposalId < proposals.length, "Propuesta inexistente");
        proposals[_proposalId].votes++;
        emit Voted(_proposalId, proposals[_proposalId].votes);
    }

    function executeProposal(uint256 _proposalId) public onlyOwner {
        require(_proposalId < proposals.length, "Propuesta inexistente");
        require(!proposals[_proposalId].executed, "Ya ejecutada");

        proposals[_proposalId].executed = true;
        emit ProposalExecuted(_proposalId, proposals[_proposalId].datasetHash);

        // Llama al contrato AITrainer para ejecutar el entrenamiento
        aiTrainer.trainModel(_proposalId, proposals[_proposalId].datasetHash);
    }
}
