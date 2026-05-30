const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: './bot.env' });

const commands = [];
const cmdPath = path.join(__dirname, 'commands');

for (const folder of fs.readdirSync(cmdPath)) {
  const folderPath = path.join(cmdPath, folder);
  for (const file of fs.readdirSync(folderPath).filter(f => f.endsWith('.js'))) {
    const cmd = require(path.join(folderPath, file));
    if (cmd.data) commands.push(cmd.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  console.log(`Registering ${commands.length} commands...`);
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log('✅ Commands registered!');
})();