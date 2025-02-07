import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployAITrainer: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Primero desplegamos el DAO sin AITrainer aún
  const aiTrainer = await deploy("AITrainer", {
    from: deployer,
    args: ["0xf5278628a82C12907e198d42F7b99968D24135D5"],
    log: true,
  });

  const dao = await deploy("DAO", {
    from: deployer,
    args: [aiTrainer.address],
    log: true,
  });

  console.log(`DAO deployed at: ${dao.address}`);
  console.log(`AITrainer deployed at: ${aiTrainer.address}`);
};

export default deployAITrainer;
deployAITrainer.tags = ["AITrainer"];
