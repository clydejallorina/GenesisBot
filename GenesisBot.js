const fs = require("fs");
const _ = require('lodash');
const child_process = require('child_process');
const winston = require('winston');
const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect: true});

const config = _.merge(require('./config.json'), require('./secrets.json'));

// role ids
// TODO: replace these with name lookups at some point
var spectatorID = "207396959789514752";
var newcomerID = "207396529386946560";
var crewID = "209692193785380864";


client.on("message" , function(message) {
    if (message.content.startsWith("!")) {
        if (message.content == "!join") {
            if (client.memberHasRole(message.author, newcomerID)) {
                client.addMemberToRole(message.author, spectatorID, function(err) {
                    if (err) {
                        winston.error("Error giving user", message.author.name, "the Spectator role:", err);
                    } else {
                        winston.info("Spectator role added to user " + message.author.name + ". Removing newcomer role and deleting !join message...");
                        client.deleteMessage(message);
                        client.removeMemberFromRole(message.author , newcomerID , function(err){
                            if (err) {
                                winston.error("Error removing newcomer role:", err);
                            } else {
                                winston.info("Success.");
                            }
                        });
                    }
                });
            }
        }
    } else if (message.content == "=halt") {
        client.destroy(function(err){
            winston.info("Are you fucking kidding me?! *dies a gristly death*");
            process.exit(14);
        });
    } else if (message.content.startsWith("=getroleid")) {
        // drop the =getroleid at the beginning of the string
        var roleName = message.content.split(' ').splice(1).join(' ');

        var role = message.channel.server.roles.get("name" , roleName);
        if (role != null)
            client.reply(message, "Role " + roleName + " has id " + role.id);
        else
            client.reply(message, "Role not found! (Role lookup is case sensitive!)");
    } else if (message.content == "=restart") {
        client.destroy(function(err){
            winston.info("Restart in progress.");
            process.exit();
        })
    }
});

client.on("serverNewMember", function(server, user) {
    if (server.id == config.serverID) {
        client.addMemberToRole(user, newcomerID, function(err) {
            if (err) {
                winston.error("Error giving user", user.name, "the newcomer role:", err);
            } else {
                winston.info("A new member,", user.name, "joined and was given the newcomer role.");
            }
        });
    }
});

winston.info("Logging in with token", config.token);
client.loginWithToken(config.token, function (err) {
    if (err) {
        winston.info("Error logging in to Discord:", err);
    } else {
        winston.info("Bot login successful!");
    }
});

client.on('ready', function() {
    child_process.exec('git rev-parse --short HEAD', (error, stdout, stderr) => {
        client.setPlayingGame('commit ' + stdout.trim());
    });
});

