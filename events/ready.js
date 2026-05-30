module.exports = {
  name: 'clientReady',  // changed from 'ready'
  once: true,
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);
    client.user.setActivity('FiveM Whitelist Bot', { type: 'WATCHING' });
  }
};