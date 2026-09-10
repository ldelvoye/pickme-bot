import { Client, Events, GatewayIntentBits } from "discord.js";

import { MESSAGES } from "./messages.js";
import { isUninvited } from "./uninvited.js";

const DEFAULT_CHANCE = 1 / 10;

function readToken() {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error("DISCORD_TOKEN is not set");
  }
  return token;
}

function readChance() {
  const override = process.env.PICKME_CHANCE;
  if (override === undefined) {
    return DEFAULT_CHANCE;
  }
  const chance = Number(override);
  if (Number.isNaN(chance)) {
    throw new Error(`PICKME_CHANCE must be a number, got "${override}"`);
  }
  return chance;
}

function pickMessage() {
  const index = Math.floor(Math.random() * MESSAGES.length);
  return MESSAGES[index];
}

async function botIdentity(guild) {
  const me = await guild.members.fetchMe();
  const roleIds = [...me.roles.cache.keys()];
  return { userId: me.id, roleIds };
}

const token = readToken();
const chance = readChance();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag} with chance ${chance}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) {
    return;
  }
  if (!message.inGuild()) {
    return;
  }

  const bot = await botIdentity(message.guild);
  if (!isUninvited(message.content, bot)) {
    return;
  }

  const rolled = Math.random() < chance;
  if (!rolled) {
    return;
  }

  try {
    await message.reply({
      content: pickMessage(),
      allowedMentions: { parse: [], repliedUser: false },
    });
  } catch (error) {
    console.error(`Could not reply in #${message.channel.name}:`, error);
  }
});

client.on(Events.Error, (error) => {
  console.error("Client error:", error);
});

await client.login(token);
