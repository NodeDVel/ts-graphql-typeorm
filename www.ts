import * as http from 'http';

import app from './app';

const normalizePort = (val: string): number => {
  const port: number = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return 0;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return 0;
};

const httpServer: http.Server = http.createServer(app);
const port: number = normalizePort(process.env.PORT);

httpServer.listen(port, (): void => {
  console.log(`Server started on ${port}`);
});