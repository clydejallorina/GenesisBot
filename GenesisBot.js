var fs = require("fs");
var token = fs.readFileSync("token.txt");
var Discord = require("discord.js");
var botClient = new Discord.Client({autoReconnect: true});

var spectatorID = "207396959789514752";
var newcomerID = "207396529386946560";
var crewID = "209692193785380864";

botClient.on("message" , function(message) {
    if (message.content.startsWith("!"))
    {
        if (message.content == "!join")
        {
            if (botClient.memberHasRole(message.author , newcomerID))
            {
                botClient.addMemberToRole(message.author , spectatorID , function(err){
                    if (err)
                    {
                        console.log("Unable to turn member " + message.author.name + " to a Spectator!");
                        console.log("Error: " , err);
                    }
                    else
                    {
                        console.log("Member turned! Now to remove the newcomer role...");
                        botClient.removeMemberFromRole(message.author , newcomerID , function(err){
                        if (err != null || err != undefined)
                        {
                            console.log("Unable to remove newcomer role");
                            console.log("Error: " , err);
                        }    
                        else
                        {
                            console.log("And it worked!");
                        }
                        });
                    }
                });
            }
        }
    }
    
    else if (message.content == "=logout")
    {
        botClient.destroy(function(err){
            console.log("Are you fucking kidding me");
        })
    }
    
    else if (message.content.startsWith("=getroleid"))
    {
        var something = message.content.split(" ");
        something = something.splice(-1,1);
        var x = "";
        for (var i = 0; i < something.length; i++)
        {
            x = x + something[i];
        }
        console.log(x);
        var role = message.channel.server.roles.get("name" , x);
        if (role != null)
            botClient.reply(message, role.id);
        else
            botClient.reply(message, "Role not found! (Role lookup is case sensitive!)");
    }
});

botClient.on("serverNewMember" , function(server , user){
    if (server.id == "207045717687009280")
    {
        botClient.addMemberToRole(user , "207396529386946560" , function(err){
            if (err)
            {
                console.log("Unable to turn member " + user.name + " to a newcomer!");
                console.log("Error: " , err);
            }
            else
            {
                console.log("NEW MEMBER!");
            }
        })
    }
})

botClient.loginWithToken(token , function (err) {
    if (err)
    {
        console.log("Bot login failed!");
        console.log("Error: " , err);
    }
    else
    {
        console.log("Bot login successful!");
    }
})