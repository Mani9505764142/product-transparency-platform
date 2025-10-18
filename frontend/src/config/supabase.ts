import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkedzxuzisohgngkfgas.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZWR6eHV6aXNvaGduZ2tmZ2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk5MDYsImV4cCI6MjA3NjIwNTkwNn0.O_gDqU2TRkMm4SVYR2Sox4JPz0gonj6ufEhfrIsSxv4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
