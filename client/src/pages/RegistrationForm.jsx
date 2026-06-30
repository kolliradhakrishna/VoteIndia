import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import { saveVoter } from '../store/voterStore';

// ── Defined OUTSIDE component so it has a stable identity across re-renders ──
// If defined inside, React treats it as a new component on every render and
// unmounts/remounts the input, causing inputs to lose focus on every keystroke.
const Field = ({ label, name, type = 'text', placeholder, required, hint, form, errors, onChange, children }) => (
  <div className="form-group">
    <label className="form-label" htmlFor={`field-${name}`}>
      {label} {required && <span className="required">*</span>}
    </label>
    {children || (
      <input
        id={`field-${name}`}
        type={type}
        name={name}
        value={form[name]}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input${errors[name] ? ' error' : ''}`}
        aria-describedby={errors[name] ? `err-${name}` : undefined}
      />
    )}
    {errors[name] && <span id={`err-${name}`} className="form-error">⚠ {errors[name]}</span>}
    {hint && !errors[name] && <span className="form-hint">{hint}</span>}
  </div>
);

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
];

const RegistrationForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const dob = state?.dob ? new Date(state.dob) : null;
  const age = state?.age || 0;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    nationality: 'Indian',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    aadharNumber: '',
    panCard: '',
  });
  const [errors, setErrors] = useState({});

  const formatDob = (date) =>
    date ? date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // Convert photo to base64 for localStorage storage
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, photo: 'File size must be under 5MB' });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result);
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setErrors({ ...errors, photo: '' });
  };

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      else if (form.fullName.trim().length < 3) e.fullName = 'Name must be at least 3 characters';
      if (!form.gender) e.gender = 'Please select your gender';
      if (!form.nationality.trim()) e.nationality = 'Nationality is required';
    }
    if (step === 2) {
      if (!form.phone.trim()) e.phone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit Indian mobile number';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
      if (!form.address.trim()) e.address = 'Address is required';
      if (!form.city.trim()) e.city = 'City is required';
      if (!form.state) e.state = 'Please select your state';
      if (!form.pinCode.trim()) e.pinCode = 'PIN code is required';
      else if (!/^\d{6}$/.test(form.pinCode)) e.pinCode = 'PIN code must be 6 digits';
    }
    if (step === 3) {
      if (!form.aadharNumber.trim()) e.aadharNumber = 'Aadhar number is required';
      else if (!/^\d{12}$/.test(form.aadharNumber.replace(/\s/g, ''))) e.aadharNumber = 'Aadhar must be 12 digits';
      if (!form.panCard.trim()) e.panCard = 'PAN card number is required';
      else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panCard.toUpperCase())) e.panCard = 'Enter valid PAN (e.g. ABCDE1234F)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = () => {
    setLoading(true);
    setError('');

    // Small delay so spinner is visible
    setTimeout(() => {
      try {
        const voter = saveVoter({
          ...form,
          panCard: form.panCard.toUpperCase(),
          dateOfBirth: dob ? dob.toISOString() : '',
          age,
          photoUrl: photoBase64 || null,
        });
        navigate('/success', { state: { voter } });
      } catch (err) {
        if (err.code === 'DUPLICATE') {
          setError(`⚠️ A voter with this Aadhar number is already registered. (Voter ID: ${err.voterIdNumber})`);
        } else {
          setError('Submission failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }, 800);
  };



  return (
    <div className="page-wrapper" style={{ padding: '88px 20px 40px', alignItems: 'flex-start' }}>
      <div className="page-bg" aria-hidden="true"><div className="page-bg-blob" /></div>

      <div style={{ width: '100%', maxWidth: '760px', margin: '0 auto' }}>
        {/* Header */}
        <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="badge badge-green" style={{ marginBottom: '16px' }}>
            ✅ Age Verified — You're Eligible!
          </div>
          <h1 className="heading-xl" style={{ marginBottom: '10px' }}>
            Voter <span className="text-gradient">Registration</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Complete all 4 steps to register as a voter. All fields marked with <span style={{ color: 'var(--saffron)' }}>*</span> are required.
          </p>
          <div className="tricolor-stripe" style={{ maxWidth: '160px', margin: '20px auto 0' }} />
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Form Card */}
        <div className="glass-card animate-fadeInUp animate-delay-2" style={{ padding: '40px' }} id="registration-form-card">

          {/* ── STEP 1: Personal Info ── */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h2 className="heading-md" style={{ marginBottom: '6px' }}>👤 Personal Information</h2>
                <p className="text-muted" style={{ fontSize: '0.88rem' }}>Tell us about yourself</p>
              </div>

              {/* Pre-filled DOB */}
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Date of Birth (Verified)</label>
                <div
                  style={{
                    padding: '13px 16px',
                    background: 'rgba(19,136,8,0.08)',
                    border: '1px solid rgba(19,136,8,0.3)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--success)',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>🔒</span>
                  <span>{formatDob(dob)}</span>
                  <span style={{ marginLeft: 'auto', background: 'rgba(19,136,8,0.2)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem' }}>
                    Age: {age} yrs
                  </span>
                </div>
              </div>

              <Field label="Full Name" name="fullName" placeholder="Enter your full name as on Aadhar" required form={form} errors={errors} onChange={onChange} />
              <div style={{ height: '20px' }} />

              <div className="form-grid">
                <Field label="Gender" name="gender" required form={form} errors={errors} onChange={onChange}>
                  <select
                    id="field-gender"
                    name="gender"
                    value={form.gender}
                    onChange={onChange}
                    className={`form-select${errors.gender ? ' error' : ''}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="form-error">⚠ {errors.gender}</span>}
                </Field>
                <Field label="Nationality" name="nationality" placeholder="Indian" required form={form} errors={errors} onChange={onChange} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Contact Info ── */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h2 className="heading-md" style={{ marginBottom: '6px' }}>📞 Contact Information</h2>
                <p className="text-muted" style={{ fontSize: '0.88rem' }}>Your contact and address details</p>
              </div>

              <div className="form-grid">
                <Field label="Phone Number" name="phone" type="tel" placeholder="10-digit mobile number" required hint="Must be a valid Indian mobile number" form={form} errors={errors} onChange={onChange} />
                <Field label="Email Address" name="email" type="email" placeholder="your@email.com" required form={form} errors={errors} onChange={onChange} />
              </div>
              <div style={{ height: '20px' }} />
              <Field label="Full Address" name="address" placeholder="House/Flat No., Street, Locality" required form={form} errors={errors} onChange={onChange}>
                <textarea
                  id="field-address"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="House/Flat No., Street, Locality"
                  className={`form-textarea${errors.address ? ' error' : ''}`}
                  rows={3}
                />
                {errors.address && <span className="form-error">⚠ {errors.address}</span>}
              </Field>
              <div style={{ height: '20px' }} />
              <div className="form-grid-3">
                <Field label="City / Village" name="city" placeholder="City" required form={form} errors={errors} onChange={onChange} />
                <Field label="State" name="state" required form={form} errors={errors} onChange={onChange}>
                  <select
                    id="field-state"
                    name="state"
                    value={form.state}
                    onChange={onChange}
                    className={`form-select${errors.state ? ' error' : ''}`}
                  >
                    <option value="">Select State</option>
                    {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="form-error">⚠ {errors.state}</span>}
                </Field>
                <Field label="PIN Code" name="pinCode" placeholder="6-digit PIN" required hint="6 digits only" form={form} errors={errors} onChange={onChange} />
              </div>
            </div>
          )}

          {/* ── STEP 3: ID Proof ── */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h2 className="heading-md" style={{ marginBottom: '6px' }}>🪪 Identity Proof</h2>
                <p className="text-muted" style={{ fontSize: '0.88rem' }}>Your government-issued ID details</p>
              </div>

              <div className="form-grid">
                <Field
                  label="Aadhar Number"
                  name="aadharNumber"
                  placeholder="12-digit Aadhar number"
                  required
                  hint="Enter all 12 digits without spaces"
                  form={form} errors={errors} onChange={onChange}
                />
                <Field
                  label="PAN Card Number"
                  name="panCard"
                  placeholder="e.g. ABCDE1234F"
                  required
                  hint="Format: 5 letters, 4 digits, 1 letter"
                  form={form} errors={errors} onChange={onChange}
                />
              </div>
              <div style={{ height: '24px' }} />

              {/* Photo Upload */}
              <div className="form-group">
                <label className="form-label">Passport-size Photo (Optional)</label>
                <div
                  id="photo-upload-area"
                  className={`file-upload-area${photoPreview ? ' has-file' : ''}`}
                  onClick={() => fileRef.current?.click()}
                  role="button"
                  aria-label="Upload photo"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhoto}
                    style={{ display: 'none' }}
                    id="photo-file-input"
                  />
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Photo preview" className="file-preview" />
                      <p style={{ color: 'var(--success)', fontSize: '0.9rem' }}>✅ Photo selected. Click to change.</p>
                    </>
                  ) : (
                    <>
                      <div className="file-upload-icon">📷</div>
                      <p style={{ fontWeight: '600', marginBottom: '4px' }}>Click to upload your photo</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>JPG, PNG, WEBP up to 5MB</p>
                    </>
                  )}
                </div>
                {errors.photo && <span className="form-error">⚠ {errors.photo}</span>}
              </div>
            </div>
          )}

          {/* ── STEP 4: Review ── */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <h2 className="heading-md" style={{ marginBottom: '6px' }}>📋 Review Your Details</h2>
                <p className="text-muted" style={{ fontSize: '0.88rem' }}>Please verify all information before submitting</p>
              </div>

              {photoPreview && (
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <img
                    src={photoPreview}
                    alt="Voter photo"
                    style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', border: '3px solid var(--saffron)', boxShadow: 'var(--shadow-glow-saffron)' }}
                  />
                </div>
              )}

              {[
                {
                  title: '👤 Personal', items: [
                    { label: 'Full Name', value: form.fullName },
                    { label: 'Date of Birth', value: formatDob(dob) },
                    { label: 'Age', value: `${age} years` },
                    { label: 'Gender', value: form.gender },
                    { label: 'Nationality', value: form.nationality },
                  ],
                },
                {
                  title: '📞 Contact', items: [
                    { label: 'Phone', value: form.phone },
                    { label: 'Email', value: form.email },
                    { label: 'Address', value: form.address },
                    { label: 'City', value: form.city },
                    { label: 'State', value: form.state },
                    { label: 'PIN Code', value: form.pinCode },
                  ],
                },
                {
                  title: '🪪 Identity', items: [
                    { label: 'Aadhar', value: `XXXX XXXX ${form.aadharNumber.slice(-4)}` },
                    { label: 'PAN Card', value: form.panCard.toUpperCase() },
                  ],
                },
              ].map((section) => (
                <div className="review-section" key={section.title}>
                  <div className="review-section-title">{section.title}</div>
                  <div className="review-grid">
                    {section.items.map((item) => (
                      <div className="review-item" key={item.label}>
                        <div className="review-item-label">{item.label}</div>
                        <div className="review-item-value">{item.value || '—'}</div>
                      </div>
                    ))}
                  </div>
                  <div className="divider" />
                </div>
              ))}

              {error && (
                <div
                  id="submit-error"
                  style={{
                    background: 'rgba(255,71,87,0.1)',
                    border: '1px solid rgba(255,71,87,0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px 18px',
                    color: 'var(--danger-light)',
                    fontSize: '0.9rem',
                    marginBottom: '20px',
                  }}
                >
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            {step > 1 && (
              <button
                id="btn-prev"
                className="btn btn-ghost"
                onClick={prevStep}
                style={{ flex: 1 }}
                disabled={loading}
              >
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                id="btn-next"
                className="btn btn-primary"
                onClick={nextStep}
                style={{ flex: 2 }}
              >
                Next Step →
              </button>
            ) : (
              <button
                id="btn-submit"
                className="btn btn-green"
                onClick={handleSubmit}
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Submitting...
                  </>
                ) : (
                  '🗳️ Submit Registration'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div className="animate-fadeInUp animate-delay-5" style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            🔒 Your information is stored securely in your browser. By submitting, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
