import 'dotenv/config';
import { createServer } from './server.js';

const PORT = Number(process.env.PORT) || 3001;

const app = createServer();

app.listen(PORT, () => {
  console.log(`[api] Aurea API running on http://localhost:${PORT}`);
  console.log(`[api] ENV: ${process.env.NODE_ENV ?? 'development'}`);
});
