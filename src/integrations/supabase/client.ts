
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://idwvelusdltqarivnnxu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkd3ZlbHVzZGx0cWFyaXZubnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NDY0ODcsImV4cCI6MjA1OTEyMjQ4N30.gFvEO-zVpBAMFn1xVTpzcwyJnZ67ToW6WCUWbwQggMk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
