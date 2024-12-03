import { supabase } from '../../config/supabase';

export async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection first
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