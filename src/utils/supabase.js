import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pgbhmrblebgerqcihldl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYmhtcmJsZWJnZXJxY2lobGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MDE0ODQsImV4cCI6MjA5MzQ3NzQ4NH0.8scQipAoGIfLQNGZg7Z05TIodvTmPc06CJb7hfWlkKo';

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
