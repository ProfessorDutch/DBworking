import { reloadSchema } from './schema';
import { testConnection } from '../../config/supabase';

async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // First reload the schema
    console.log('Reloading schema...');
    const schemaResult = await reloadSchema();
    if (!schemaResult.success) {
      throw new Error(`Schema reload failed: ${schemaResult.error}`);
    }

    // Then test the connection
    console.log('Testing connection...');
    const connectionResult = await testConnection();
    if (!connectionResult.success) {
      throw new Error(`Connection test failed: ${connectionResult.error}`);
    }

    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Database setup failed:', err);
    process.exit(1);
  }
}

setupDatabase();