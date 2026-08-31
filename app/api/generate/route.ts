import { NextRequest, NextResponse } from "next/server";
import { generateVisual } from "@/lib/gemini";
import { generateLocalFallbackVisual } from "@/lib/local-generator";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "No topic provided" }, { status: 400 });
    }

    // Normalize topic for consistent cache keys & keyword matching
    const normalized = topic
      .toLowerCase()
      .trim()
      .replace(/^(explain|show me|what is|how does|how do|how to|how|what are)\s+/i, "")
      .replace(/\s+(works|working|explained|problem|question)$/i, "")
      .trim();

    // 1. Check Supabase cache first — zero AI tokens
    try {
      const { data: cached, error: cacheError } = await supabase
        .from("visuals")
        .select("data")
        .eq("topic", normalized)
        .single();

      if (cached && !cacheError) {
        console.log(`Cache hit for: "${normalized}"`);
        const cachedVisual = Array.isArray(cached.data) ? cached.data[0] : cached.data;
        return NextResponse.json({ ...cachedVisual, cached: true });
      }
    } catch (e) {
      console.warn("Supabase cache check exception:", e);
    }

    // 2. Try generating fresh visual with Gemini
    let visual;
    try {
      console.log(`Generating new visual with Gemini for: "${normalized}"`);
      visual = await generateVisual(normalized);
      if (Array.isArray(visual)) visual = visual[0];
    } catch (aiErr: any) {
      console.warn(`Gemini API failed or exhausted tokens (${aiErr.message}). Falling back to local logic engine!`);
      visual = generateLocalFallbackVisual(normalized);
    }

    // 3. Save to cache for future users
    try {
      await supabase.from("visuals").insert({
        topic: normalized,
        data: visual,
      });
    } catch (e) {
      console.warn("Supabase cache insert exception:", e);
    }

    const finalVisual = Array.isArray(visual) ? visual[0] : visual;
    return NextResponse.json({ ...finalVisual, cached: false });
  } catch (err: any) {
    console.error("Generate error:", err);
    // Ultimate local fallback
    const fallback = generateLocalFallbackVisual("concept");
    return NextResponse.json({ ...fallback, cached: false });
  }
}
