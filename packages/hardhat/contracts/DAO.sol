// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DAO is Ownable {
    struct Proposal {
        string description;
        uint256 votes;
        bool executed;
    }

    Proposal[] public proposals;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId);


        // DAO is Ownable for testing purposes; live is decentralized
    constructor(address initialOwner) Ownable(initialOwner) {} // Llama al constructor de Ownable

    function createProposal(string memory _description) public onlyOwner {
        proposals.push(Proposal(_description, 0, false));
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
        emit ProposalExecuted(_proposalId);
    }
}
