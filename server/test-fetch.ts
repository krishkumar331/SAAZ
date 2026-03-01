import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function testFetch() {
  console.log("Starting RAW Fetch upload test...");
  
  const dummyContent = 'Hello world';
  const url = `${supabaseUrl}/storage/v1/object/uploads/testraw-${Date.now()}.txt`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'text/plain'
      },
      body: dummyContent
    });
    
    console.log("STATUS CODE:", res.status);
    const text = await res.text();
    console.log("RESPONSE BODY:");
    console.log(text);
  } catch (error) {
    console.error("RAW FETCH ERROR:", error);
  }
}

testFetch();
