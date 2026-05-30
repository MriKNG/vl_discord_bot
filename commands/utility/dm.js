const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send a private message to a user')
    .addUserOption(o => o.setName('user').setDescription('User to DM').setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Message to send').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target  = interaction.options.getUser('user');
    const message = interaction.options.getString('message');

    try {
      await target.send({
        embeds: [new EmbedBuilder()
          .setTitle(`Message from ${interaction.guild.name}`)
          .setDescription(message)
          .setColor(0x5865F2)
          .setTimestamp()]
      });
      await interaction.reply({ content: `✅ DM sent to ${target.tag}`, ephemeral: true });
    } catch {
      await interaction.reply({ content: `❌ Could not DM ${target.tag} — they may have DMs disabled.`, ephemeral: true });
    }
  }
};