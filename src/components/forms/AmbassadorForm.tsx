import React, { useState } from 'react';
import { Heart, ArrowRight, X, Star } from 'lucide-react';
import { EnrollmentService } from '../../services/enrollments';
import { useFormErrors } from '../../hooks/useFormErrors';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  church: string;
  commitments: string[];
}

const REQUIRED_COMMITMENTS = [
  'Spread awareness',
  'Engage with community',
  'Support values',
  'Be active'
];

export default function AmbassadorForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    church: '',
    commitments: []
  });
  const [loading, setLoading] = useState(false);
  const { errors, setError, clearError, clearAllErrors } = useFormErrors();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleCommitmentToggle = (commitment: string) => {
    setFormData(prev => ({
      ...prev,
      commitments: prev.commitments.includes(commitment)
        ? prev.commitments.filter(c => c !== commitment)
        : [...prev.commitments, commitment]
    }));
    clearError('commitments');
  };

  const validateForm = () => {
    let isValid = true;
    clearAllErrors();

    if (!formData.firstName.trim()) {
      setError('firstName', 'First name is required');
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      setError('lastName', 'Last name is required');
      isValid = false;
    }
    if (!formData.email.trim()) {
      setError('email', 'Email is required');
      isValid = false;
    }

    const missingCommitments = REQUIRED_COMMITMENTS.filter(
      commitment => !formData.commitments.includes(commitment)
    );

    if (missingCommitments.length > 0) {
      setError('commitments', 'Please accept all commitments to continue');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await EnrollmentService.createAmbassadorEnrollment({
        type: 'ambassador',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        church: formData.church,
        commitments: formData.commitments
      });

      setShowSuccess(true);
    } catch (err) {
      console.error('Enrollment error:', err);
      setError('submit', err instanceof Error ? err.message : 'Failed to submit enrollment');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto p-8">
          <div className="text-center">
            <Star className="w-12 h-12 text-patriot-red mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-patriot-navy mb-4">
              Welcome to The Mustard Seed Movement!
            </h3>
            <p className="text-patriot-blue mb-6">
              Thank you for becoming an Ambassador. Together, we'll make a difference in young lives through faith, purpose, and opportunity.
            </p>
            <button
              onClick={onClose}
              className="bg-patriot-red text-white px-8 py-3 rounded-full hover:bg-patriot-crimson transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-patriot-navy">Become an Ambassador</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-patriot-red focus:border-transparent`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-patriot-red focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Church (Optional)
            </label>
            <input
              type="text"
              name="church"
              value={formData.church}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-patriot-red focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ambassador Commitments
            </label>
            <div className="space-y-3">
              {REQUIRED_COMMITMENTS.map((commitment, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleCommitmentToggle(commitment)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                    formData.commitments.includes(commitment)
                      ? 'border-patriot-red bg-patriot-cream'
                      : 'border-gray-200 hover:border-patriot-red hover:bg-patriot-cream/50'
                  }`}
                >
                  <span className="text-patriot-navy">{commitment}</span>
                  {formData.commitments.includes(commitment) && (
                    <Star className="w-5 h-5 text-patriot-red" />
                  )}
                </button>
              ))}
            </div>
            {errors.commitments && (
              <p className="mt-2 text-sm text-red-600">{errors.commitments}</p>
            )}
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-patriot-red text-white py-3 rounded-full font-semibold hover:bg-patriot-crimson transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>Complete Registration <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}