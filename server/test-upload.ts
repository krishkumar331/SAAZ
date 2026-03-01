import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  const dummyContent = Buffer.from('Hello world');
  console.log("Attempting upload...");
  
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(`test-${Date.now()}.txt`, dummyContent, {
      contentType: 'text/plain',
      upsert: false
    });

  if (error) {
    console.error("UPLOAD ERROR:");
    console.error(JSON.stringify(error, null, 2));
  } else {
    console.log("UPLOAD SUCCESS:", data);
  }
}

testUpload();
