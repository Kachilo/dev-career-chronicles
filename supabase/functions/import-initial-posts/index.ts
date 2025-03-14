
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { pin, posts } = await req.json();
    
    if (!pin || !posts || !Array.isArray(posts)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Verify admin PIN
    const { data: verificationResult, error: verificationError } = await supabaseAdmin
      .rpc('verify_admin_pin', { input_pin: pin });
    
    if (verificationError || !verificationResult) {
      return new Response(
        JSON.stringify({ error: 'Invalid admin PIN' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    
    // Process posts
    const processedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featuredImage,
      category: post.category,
      tags: post.tags,
      author: post.author,
      published_date: post.publishedDate
    }));
    
    // Insert posts
    const { error: postsError } = await supabaseAdmin
      .from('posts')
      .upsert(processedPosts, { onConflict: 'id' });
    
    if (postsError) {
      throw postsError;
    }
    
    // Process comments
    const comments = posts.flatMap((post: any) => 
      post.comments.map((comment: any) => ({
        post_id: post.id,
        name: comment.name,
        content: comment.content,
        date: comment.date,
        id: comment.id
      }))
    );
    
    if (comments.length > 0) {
      const { error: commentsError } = await supabaseAdmin
        .from('comments')
        .upsert(comments, { onConflict: 'id' });
      
      if (commentsError) {
        throw commentsError;
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Data imported successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error processing import:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Failed to import data',
        details: error.message
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
