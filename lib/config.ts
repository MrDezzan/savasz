// API Configuration
export const config = {
    // Use env variable, fallback to production API
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://87.121.82.103:8081',
    discordUrl: 'https://discord.gg/sylvaire',
    telegramUrl: 'https://t.me/sylvaire',
    youtubeUrl: 'https://youtube.com/@sylvaire',
    shopUrl: 'https://shop.sylvaire.ru',
    serverIp: 'play.sylvaire.ru',
    updateInterval: 30000,
};
