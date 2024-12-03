export interface Database {
  public: {
    Tables: {
      enrollments: {
        Row: {
          id: string;
          created_at: string;
          type: 'ambassador' | 'business' | 'subscriber';
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          church?: string;
          status: 'pending' | 'approved' | 'rejected';
          commitments_accepted: boolean;
          commitments: string[];
          business_name?: string;
          website?: string;
          address?: string;
          description?: string;
          support_type?: string[];
          subscription_tier?: string;
          payment_method?: string;
          billing_address?: {
            street: string;
            city: string;
            state: string;
            zip: string;
          };
        };
        Insert: Omit<Database['public']['Tables']['enrollments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['enrollments']['Insert']>;
      };
    };
  };
}