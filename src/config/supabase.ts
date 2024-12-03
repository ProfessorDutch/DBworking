import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

export async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('enrollments')
      .select('*')
      .limit(1);

    if (connectionError) {
      console.error('Database connection error:', connectionError);
      return { success: false, error: connectionError.message };
    }

    // Generate unique email for test
    const testEmail = `test${Date.now()}@example.com`;

    // Test insert with minimal required fields
    const testEnrollment = {
      type: 'ambassador',
      first_name: 'Test',
      last_name: 'User',
      email: testEmail,
      commitments_accepted: true
    };

    const { data: insertTest, error: insertError } = await supabase
      .from('enrollments')
      .insert(testEnrollment)
      .select()
      .single();

    if (insertError) {
      console.error('Insert test failed:', insertError);
      return { success: false, error: insertError.message };
    }

    // Clean up test data
    if (insertTest?.id) {
      await supabase
        .from('enrollments')
        .delete()
        .eq('id', insertTest.id);
    }

    return { success: true };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    };
  }
}