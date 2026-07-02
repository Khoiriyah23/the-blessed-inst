import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://strvozynpgryohddxxse.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0cnZvenlucGdyeW9oZGR4eHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MzU5NTEsImV4cCI6MjA5ODQxMTk1MX0.PQI8AZme74zdPxaxn6DK67eNtJ8oqNa7o-CFSu1xlo0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "tbi-admin-auth",
  },
});
