import { Config } from "./config";
import { GatewayIntentBits, Client } from 'discord.js';
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";

export class MyClient extends Client {
    public config: any;
}

console.log("Bot is starting...");

const client = new MyClient({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.config = Config;

ready(client);
interactionCreate(client);

client.login(client.config.app.token);