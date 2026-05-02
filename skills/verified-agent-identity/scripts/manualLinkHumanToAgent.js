const { createPairing } = require("./linkHumanToAgent");
const { parseArgs, formatError } = require("./shared/utils");

async function main() {
  try {
    console.log("DEBUG process.argv:", process.argv);
    const args = parseArgs();
    console.log("DEBUG parsed args:", args);

    if (!args.challenge) {
      console.error(
        "Invalid arguments. Usage: node manualLinkHumanToAgent.js --challenge <json> [--did <did>]",
      );
      process.exit(1);
    }

    const challenge = JSON.parse(args.challenge);
    const url = await createPairing(challenge, args.did);

    console.log(url);
  } catch (error) {
    console.error(formatError(error));
    process.exit(1);
  }
}

main();
