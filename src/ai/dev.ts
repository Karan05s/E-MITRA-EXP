import { config } from 'dotenv';
config();

import '@/ai/flows/generate-safety-suggestions.ts';
import '@/ai/flows/context-aware-safety-tips.ts';
import '@/ai/flows/chat.ts';
