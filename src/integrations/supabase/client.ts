// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ppptnrggqwfjsrauuvgy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcHRucmdncXdmanNyYXV1dmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMzIwODIsImV4cCI6MjA1ODkwODA4Mn0.YsWou_xgv_tII4tNmmsHrSuJ3a1bmDOV2A5JciB0UgA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);