import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, X, Check, Shield, Phone, Building, Globe, Users, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RecruiterRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: ''
  });
  const [formError, setFormError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const { register, error, loading, user, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/recruiter/dashboard');
    }
    
    if (error) {
      setFormError(error);
    }
    
    return () => {
      clearError();
    };
  }, [user, error, navigate, clearError]);

  // Calculate password strength
  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[a-z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return '';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      case 5: return 'bg-green-600';
      default: return 'bg-gray-200';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate all required fields
    const requiredFields = ['name', 'email', 'mobile', 'password', 'companyName', 'companyWebsite', 'companySize', 'industry'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setFormError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }

    // Website validation
    const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!websiteRegex.test(formData.companyWebsite)) {
      setFormError('Please enter a valid website URL');
      return;
    }

    // Password validation
    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    // Terms validation
    if (!agreeToTerms) {
      setFormError('You must agree to the terms and conditions');
      return;
    }

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;

      // Attempt registration
      await register({
        ...registrationData,
        role: 'recruiter'
      });

      // Redirect to recruiter dashboard on success
      navigate('/recruiter/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setFormError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const dismissError = () => {
    setFormError('');
    clearError();
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div className="bg-white/10 backdrop-blur-md py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/20">
        {/* Error message */}
        {formError && (
          <div className="mb-6 bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg relative">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-200">{formError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={dismissError}
                  className="inline-flex rounded-md p-1.5 text-red-400 hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Personal Information</h3>
            
            {/* Name and Mobile Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Mobile Field */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-200">
                  Mobile Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="9876543210"
                    maxLength="10"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Company Information</h3>
            
            {/* Company Name and Website Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name Field */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-200">
                  Company Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Your Company Ltd."
                  />
                </div>
              </div>

              {/* Company Website Field */}
              <div>
                <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-200">
                  Company Website
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    required
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>

            {/* Company Size and Industry Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Size Field */}
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-200">
                  Company Size
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="companySize"
                    name="companySize"
                    required
                    value={formData.companySize}
                    onChange={handleChange}
                    className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              {/* Industry Field */}
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-200">
                  Industry
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-white">Security</h3>
            
            {/* Password and Confirm Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-gray-700/50 rounded-full h-2">
                        <div className={`h-2 rounded-full ${getPasswordStrengthColor()}`} style={{ width: `${passwordStrength * 20}%` }}></div>
                      </div>
                      <span className="ml-3 text-xs text-gray-300">{getPasswordStrengthText()}</span>
                    </div>
                    <ul className="mt-2 text-xs text-gray-400 grid grid-cols-2 gap-2">
                      <li className="flex items-center">
                        {formData.password.length >= 8 ? (
                          <Check className="h-3 w-3 text-green-400 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-400 mr-1" />
                        )}
                        At least 8 characters
                      </li>
                      <li className="flex items-center">
                        {/[A-Z]/.test(formData.password) ? (
                          <Check className="h-3 w-3 text-green-400 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-400 mr-1" />
                        )}
                        Uppercase letter
                      </li>
                      <li className="flex items-center">
                        {/[0-9]/.test(formData.password) ? (
                          <Check className="h-3 w-3 text-green-400 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-400 mr-1" />
                        )}
                        Number
                      </li>
                      <li className="flex items-center">
                        {/[^A-Za-z0-9]/.test(formData.password) ? (
                          <Check className="h-3 w-3 text-green-400 mr-1" />
                        ) : (
                          <X className="h-3 w-3 text-red-400 mr-1" />
                        )}
                        Special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 block w-full pr-3 py-3 border border-gray-600 rounded-lg leading-5 bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {formData.password && formData.confirmPassword && (
                  <div className="mt-1 flex items-center">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-xs text-green-400">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-400 mr-1" />
                        <span className="text-xs text-red-400">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-700/50"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agree" className="font-medium text-gray-200">
                I agree to the{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecruiterRegister; 