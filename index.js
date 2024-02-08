const fs = require('fs');
const express = require('express');
const { QuickDB } = require('quick.db');
const { DiscordModal } = require('discord-modal');
const Discord = require("discord.js");

const app = express();

app.get('/', (req, res) => {
  res.send('BOT IS ONLINE');
});

app.listen(3000, () => {
  console.log('Developed By Xyous');
});

const ms = require("ms");
const data = require("st.db");
const axios = require("axios");
const DB = new QuickDB();
const client = new Discord.Client({
  intents: 3276799
});

const { MessageActionRow, MessageButton } = require('discord.js');

DiscordModal(client);

const prefix = "-";  

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

require('events').EventEmitter.defaultMaxListeners = 9999999; 

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag} Online`);
  updateStatus(client);
  setInterval(() => {
    updateStatus(client);
  }, 5000);
});

function updateStatus(client) {
  const statusMessages = [
    `${prefix}help`,
    'Discord: @xyous',
    `${prefix}invite`,
    'Dev: @xyous',
  ];
  const randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];

  client.user.setActivity(randomStatus, { type: "PLAYING" });
}

process.on("uncaughtException" , error => {
  return;
});

process.on("unhandledRejection" , error => {
  return;
});

process.on("rejectionHandled", error => {
  return;
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command.');
  }
});

client.login(process.env.token).catch((error) => {
  console.warn("\033[31m Token Invalid");
});
