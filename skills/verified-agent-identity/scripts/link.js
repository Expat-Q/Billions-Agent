const { createPairing } = require("./linkHumanToAgent");
const { formatError } = require("./shared/utils");

async function main() {
  try {
    const challenge = {
      name: "My Agent",
      description: "My personal AI agent"
    };
    
    console.log("Generating link for:", challenge);
    const url = await createPairing(challenge);
    console.log("\n--- VERIFICATION LINK ---");
    console.log(url);
    console.log("-------------------------\n");
  } catch (error) {
    console.error(formatError(error));
    process.exit(1);
  }
}

main();
