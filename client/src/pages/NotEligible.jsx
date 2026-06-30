import { useLocation, Link } from 'react-router-dom';

const NotEligible = () => {
  const { state } = useLocation();
  const age = state?.age || { years: 0, months: 0, days: 0 };
  const eligibleDate = state?.eligibleDate || 'N/A';
  const dob = state?.dob ? new Date(state.dob) : null;

  // Calculate days remaining until 18th birthday
  const daysRemaining = () => {
    if (!dob) return null;
    const today = new Date();
    const eighteenth = new Date(dob);
    eighteenth.setFullYear(dob.getFullYear() + 18);
    if (eighteenth <= today) return 0;
    const diff = eighteenth - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const remaining = daysRemaining();
  const yearsLeft = 18 - age.years - (age.months > 0 || age.days > 0 ? 0 : 0);
  const monthsLeft = age.months > 0 ? 12 - age.months : 0;

  return (
    <div className="page-wrapper" style={{ padding: '88px 20px 40px', alignItems: 'flex-start' }}>
      <div className="page-bg" aria-hidden="true">
        <div className="page-bg-blob" style={{ background: 'radial-gradient(circle, rgba(255,71,87,0.08) 0%, transparent 70%)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto' }}>
        {/* Illustration */}
        <div className="not-eligible-illustration animate-fadeInUp">
          <span className="not-eligible-icon">🚫</span>
          <div className="badge badge-danger" style={{ marginBottom: '20px', fontSize: '0.85rem', padding: '8px 20px' }}>
            Age Verification Failed
          </div>
        </div>

        {/* Main Card */}
        <div
          className="glass-card animate-fadeInUp animate-delay-1"
          style={{
            padding: '40px',
            textAlign: 'center',
            borderColor: 'rgba(255,71,87,0.2)',
            background: 'linear-gradient(135deg, rgba(255,71,87,0.05), rgba(10,14,39,0.8))',
          }}
          id="not-eligible-card"
        >
          <h1 className="heading-xl" style={{ marginBottom: '16px', color: 'var(--danger-light)' }}>
            Not Eligible Yet
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '32px', fontSize: '1rem' }}>
            We're sorry! You must be at least <strong style={{ color: 'var(--white)' }}>18 years old</strong> to register as a voter in India.
            Don't worry — your time will come! 🗳️
          </p>

          {/* Age display */}
          <div className="age-display ineligible" style={{ marginBottom: '24px' }}>
            <div className="age-number" style={{ background: 'linear-gradient(135deg, #ff4757, #ff6b78)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {age.years}
            </div>
            <div className="age-label" style={{ marginBottom: '12px' }}>Current Age (Years)</div>
            <div className="age-units">
              <div className="age-unit">
                <div className="age-unit-value">{age.months}</div>
                <div className="age-unit-label">Months</div>
              </div>
              <div style={{ width: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
              <div className="age-unit">
                <div className="age-unit-value">{age.days}</div>
                <div className="age-unit-label">Days</div>
              </div>
            </div>
          </div>

          {/* Countdown to eligibility */}
          <div className="countdown-card animate-fadeInUp animate-delay-2" style={{ marginBottom: '28px' }}>
            <div className="countdown-label">You will be eligible to vote on</div>
            <div className="countdown-value" style={{ fontSize: '1.5rem', margin: '8px 0' }}>
              📅 {eligibleDate}
            </div>
            {remaining !== null && (
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '1.8rem', color: 'var(--saffron)' }}>{remaining}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Days Left</div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Message */}
          <div
            style={{
              background: 'rgba(255,153,51,0.06)',
              border: '1px solid rgba(255,153,51,0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              marginBottom: '28px',
              textAlign: 'left',
            }}
          >
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '600', marginBottom: '8px', color: 'var(--saffron)' }}>
              💡 What you can do now:
            </div>
            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', lineHeight: '2', fontSize: '0.9rem' }}>
              <li>✦ Bookmark this page and return on your 18th birthday</li>
              <li>✦ Learn about your voting rights at <strong style={{ color: 'var(--white)' }}>eci.gov.in</strong></li>
              <li>✦ Keep your Aadhar & PAN card ready</li>
              <li>✦ Spread voter awareness in your community</li>
            </ul>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              to="/"
              className="btn btn-primary"
              id="back-to-home-btn"
              style={{ flex: 1, minWidth: '180px' }}
            >
              ← Try Again
            </Link>
            <a
              href="https://eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              id="eci-link"
              style={{ flex: 1, minWidth: '180px' }}
            >
              🌐 Visit ECI Portal
            </a>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="animate-fadeInUp animate-delay-4" style={{ marginTop: '32px', textAlign: 'center' }}>
          <blockquote style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', lineHeight: '1.8' }}>
            "Every vote counts. Your voice matters in shaping the future of India."
            <br />
            <strong style={{ color: 'var(--saffron)', fontStyle: 'normal' }}>— Election Commission of India</strong>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default NotEligible;
