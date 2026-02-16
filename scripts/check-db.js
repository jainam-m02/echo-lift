
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
let supabaseUrl = null;
let supabaseAnonKey = null;

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    supabaseUrl = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_URL='))?.split('=')[1]?.trim();
    supabaseAnonKey = lines.find(l => l.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY='))?.split('=')[1]?.trim();
} catch (err) {
    console.error("Error reading .env.local:", err.message);
    process.exit(1);
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDb() {
    console.log("Testing Supabase Connection...");
    console.log("URL:", supabaseUrl);

    // 1. Try simple select from 'workouts'
    console.log("1. Selecting from 'workouts'...");
    const { data: workouts, error: selectError } = await supabase
        .from('workouts')
        .select('*')
        .limit(1);

    if (selectError) {
        console.error("❌ Validating 'workouts' table failed:", selectError.message);
        console.log("Hint: Did you run the SQL script? Is RLS enabled without a policy?");
        return;
    }
    console.log("✅ 'workouts' table accessible. Row count:", workouts.length);

    // 2. Try select with join
    console.log("2. Selecting from 'workouts' with joined 'exercises'...");
    const { data: joined, error: joinError } = await supabase
        .from('workouts')
        .select('*, exercises(*)')
        .limit(1);

    if (joinError) {
        console.error("❌ Join query failed:", joinError.message);
        console.log("Hint: Foreign Key might be missing or named weirdly.");
    } else {
        console.log("✅ Join query successful.");
        console.log("Data:", JSON.stringify(joined, null, 2));
    }
}

checkDb();
