import { supabase } from '../config/supabase';

export class EnrollmentService {
  static async createAmbassadorEnrollment(enrollment: {
    type: 'ambassador';
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    church?: string;
    commitments: string[];
  }) {
    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('enrollments')
        .select('id')
        .eq('email', enrollment.email)
        .single();

      if (existing) {
        throw new Error('An enrollment with this email already exists');
      }

      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          type: enrollment.type,
          first_name: enrollment.firstName,
          last_name: enrollment.lastName,
          email: enrollment.email,
          phone: enrollment.phone,
          church: enrollment.church,
          commitments_accepted: enrollment.commitments.length === 4 // All 4 required commitments
        })
        .select()
        .single();

      if (error) {
        console.error('Enrollment error:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Failed to create ambassador enrollment:', err);
      throw err;
    }
  }

  static async getEnrollmentById(id: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}