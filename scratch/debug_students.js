const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debug() {
  console.log("Signing in as instructor...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'instruktur@excel.com',
    password: 'instruktur123'
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }

  console.log("Successfully signed in as:", authData.user.email);

  console.log("Querying user_progress directly...");
  const { data, error } = await supabase
    .from('user_progress')
    .select('*');

  if (error) {
    console.error("Error querying user_progress:", error);
  } else {
    console.log("All visible rows in user_progress:", JSON.stringify(data, null, 2));
  }
}

debug();
