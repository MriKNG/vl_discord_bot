const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Send an embed message to a channel')
    .addStringOption(o => o.setName('title').setDescription('Embed title').setRequired(true))
    .addStringOption(o => o.setName('description').setDescription('Embed description').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Channel to send to').setRequired(true))
    .addStringOption(o => o.setName('color').setDescription('Hex color e.g. #5865F2'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const title   = interaction.options.getString('title');
    const desc    = interaction.options.getString('description');
    const channel = interaction.options.getChannel('channel');
    const color   = interaction.options.getString('color') ?? '#5865F2';

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(desc)
      .setColor(color)
      .setFooter({ text: `Posted by ${interaction.user.tag}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: `✅ Embed sent to ${channel}`, ephemeral: true });
  }
};