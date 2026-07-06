import { config } from 'dotenv';
import { existsSync } from 'fs';

const envPath = existsSync('.env.local') ? '.env.local' : '.env';
config({ path: envPath });

import '@/ai/flows/predict-turnover';
