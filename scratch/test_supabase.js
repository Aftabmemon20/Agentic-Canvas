const { createClient } = require("@supabase/supabase-js");

async function testSupabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from("visuals")
      .select("*")
      .limit(1);
    
    if (error) {
      console.error("Supabase select error:", error);
    } else {
      console.log("Supabase select success:", data);
    }
  } catch (err) {
    console.error("Supabase catch error:", err);
  }
}

testSupabase();
