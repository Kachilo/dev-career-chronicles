// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fkizgtkjwkkbkjwovsra.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZraXpndGtqd2trYmtqd292c3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDM0MTIsImV4cCI6MjA2MTUxOTQxMn0.tv1N6fZsxaQ1-fZ6PBfSm2yJQKVPFR54UroCIuGg__g";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);