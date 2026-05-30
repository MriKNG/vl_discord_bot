const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/warnings.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption(o => o.setName('user').setDescription('User to check').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const warnings = fs.existsSync(dbPath)
      ? JSON.parse(fs.readFileSync(dbPath))[target.id] ?? []
      : [];

    if (warnings.length === 0) {
      return interaction.reply({ content: `${target.tag} has no warnings.`, ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`Warnings for ${target.tag}`)
      .setColor(0xFEE75C)
      .setDescription(warnings.map((w, i) =>
        `**${i + 1}.** ${w.reason}\n*by ${w.moderator} on ${new Date(w.date).toLocaleDateString()}*`
      ).join('\n\n'))
      .setFooter({ text: `Total: ${warnings.length} warning(s)` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};