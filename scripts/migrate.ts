import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  console.log('🔄 [BharatConnect] डेटाबेस माइग्रेशन शुरू हो रहा है (Idempotent Schema Sync)...');
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.warn('⚠️  DATABASE_URL सेट नहीं है। माइग्रेशन छोड़ दिया गया है।');
    console.log('💡 PostgreSQL से जोड़ने के लिए .env या Railway dashboard में DATABASE_URL सेट करें।');
    process.exit(0);
  }

  try {
    console.log('🔌 PostgreSQL डेटाबेस से जुड़ रहे हैं...');
    
    // Idempotent migration push with Prisma
    execSync('npx prisma db push --accept-data-loss --skip-generate', {
      stdio: 'inherit',
      env: { ...process.env }
    });

    console.log('✅ [BharatConnect] डेटाबेस स्कीमा माइग्रेशन सफलतापूर्वक संपन्न हुआ!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ डेटाबेस कनेक्शन विफल रहा! कृपया जाँचें कि DATABASE_URL सही है और PostgreSQL सर्वर चालू है।');
    console.error('विवरण (Details):', error?.message || error);
    // Exit with code 1 so build/deploy pipeline catches connection failure when DATABASE_URL is provided but invalid
    process.exit(1);
  }
}

runMigration();
