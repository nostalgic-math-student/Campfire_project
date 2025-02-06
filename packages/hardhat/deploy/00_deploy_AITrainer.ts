import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployAITrainer: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const aiTrainer = await deploy("AITrainer", {
    from: deployer,
    args: ["0xf5278628a82C12907e198d42F7b99968D24135D5"],
    log: true,
  });

  console.log(`AITrainer deployed at: ${aiTrainer.address}`);
};

export default deployAITrainer;
deployAITrainer.tags = ["AITrainer"];
