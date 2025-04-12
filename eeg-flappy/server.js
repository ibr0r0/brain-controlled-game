const dgram = require('dgram');
const WebSocket = require('ws');

const udpServer = dgram.createSocket('udp4');
const wss = new WebSocket.Server({ port: 8080 });

udpServer.on('message', (msg) => {
  const data = msg.toString();
  console.log('UDP Data:', data); // تتبع الإشارة القادمة من OpenBCI

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data); // نرسلها للمتصفح
    }
  });
});

udpServer.bind(12345, () => {
  console.log('✅ UDP server listening on port 12345');
});
