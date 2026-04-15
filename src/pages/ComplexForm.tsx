import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';
import { FileText, Upload } from 'lucide-react';

export function ComplexForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    jobTitle: '',
    experience: '',
    skills: [] as string[],
    agreeToTerms: false,
    newsletter: false,
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const skillOptions = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSubmittedData({
      ...formData,
      fileName: file?.name || 'No file uploaded',
    });

    setSubmitting(false);
    setShowModal(true);
    setToast({ message: 'Form submitted successfully!', type: 'success' });
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      jobTitle: '',
      experience: '',
      skills: [],
      agreeToTerms: false,
      newsletter: false,
    });
    setFile(null);
    setErrors({});
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Form Submitted">
        <div className="space-y-3">
          <p className="text-gray-600">Your form has been submitted successfully!</p>
          {submittedData && (
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p><strong>Name:</strong> {submittedData.firstName} {submittedData.lastName}</p>
              <p><strong>Email:</strong> {submittedData.email}</p>
              <p><strong>Phone:</strong> {submittedData.phone}</p>
              <p><strong>Country:</strong> {submittedData.country}</p>
              <p><strong>Job Title:</strong> {submittedData.jobTitle}</p>
              <p><strong>Experience:</strong> {submittedData.experience}</p>
              <p><strong>Skills:</strong> {submittedData.skills.join(', ')}</p>
              <p><strong>File:</strong> {submittedData.fileName}</p>
            </div>
          )}
        </div>
      </Modal>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 data-testid="form-title" className="text-3xl font-bold text-gray-800">Complex Form</h1>
        </div>
        <p className="text-gray-600">Fill out this form to test validation and error handling</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                data-testid="form-firstname"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="John"
              />
              {errors.firstName && (
                <p data-testid="error-firstname" className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                data-testid="form-lastname"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p data-testid="error-lastname" className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              data-testid="form-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p data-testid="error-email" className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                data-testid="form-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p data-testid="error-phone" className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                data-testid="form-country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a country</option>
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
              </select>
              {errors.country && (
                <p data-testid="error-country" className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              id="jobTitle"
              data-testid="form-jobtitle"
              type="text"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg ${errors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Software Engineer"
            />
            {errors.jobTitle && (
              <p data-testid="error-jobtitle" className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {['Junior', 'Mid-Level', 'Senior', 'Lead'].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    data-testid={`form-experience-${level.toLowerCase()}`}
                    type="radio"
                    name="experience"
                    value={level}
                    checked={formData.experience === level}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{level}</span>
                </label>
              ))}
            </div>
            {errors.experience && (
              <p data-testid="error-experience" className="text-red-500 text-sm mt-1">{errors.experience}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  data-testid={`form-skill-${skill.toLowerCase()}`}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.skills.includes(skill)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {errors.skills && (
              <p data-testid="error-skills" className="text-red-500 text-sm mt-1">{errors.skills}</p>
            )}
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="file"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Choose File</span>
              </label>
              <input
                id="file"
                data-testid="form-file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              <span data-testid="file-name" className="text-sm text-gray-600">
                {file ? file.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                data-testid="form-terms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                I agree to the terms and conditions <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p data-testid="error-terms" className="text-red-500 text-sm">{errors.agreeToTerms}</p>
            )}

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                data-testid="form-newsletter"
                type="checkbox"
                checked={formData.newsletter}
                onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                className="mt-1 w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                Subscribe to newsletter for updates
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              data-testid="form-login"
              isLoading={submitting}
              className="flex-1"
            >
              Login
            </Button>
            <Button
              type="button"
              data-testid="form-reset"
              variant="secondary"
              onClick={handleReset}
              disabled={submitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
