// API Configuration
export const config = {
    // Empty string means same domain - Nginx will proxy /api/* to Minecraft server
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
    discordUrl: 'https://discord.gg/sylvaire',
    telegramUrl: 'https://t.me/sylvaire',
    youtubeUrl: 'https://youtube.com/@sylvaire',
    shopUrl: 'https://shop.sylvaire.ru',
    serverIp: 'play.sylvaire.ru',
    updateInterval: 30000,
};
