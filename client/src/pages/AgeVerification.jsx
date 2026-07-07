import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarPicker from '../components/CalendarPicker';

const calculateAge = (dob) => {
  const today = new Date();
  const birth = new Date(dob);
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
};

const AgeVerification = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [ageInfo, setAgeInfo] = useState(null);
  const navigate = useNavigate();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const age = calculateAge(date);
    setAgeInfo(age);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getEligibilityDate = (dob) => {
    const d = new Date(dob);
    d.setFullYear(d.getFullYear() + 18);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const handleCheckEligibility = () => {
    if (!ageInfo) return;
    if (ageInfo.years >= 18) {
      navigate('/register', { state: { dob: selectedDate.toISOString(), age: ageInfo.years } });
    } else {
      navigate('/not-eligible', {
        state: {
          dob: selectedDate.toISOString(),
          age: ageInfo,
          eligibleDate: getEligibilityDate(selectedDate),
        },
      });
    }
  };

  const eligible = ageInfo && ageInfo.years >= 18;
  const ineligible = ageInfo && ageInfo.years < 18;

  return (
    <div className="page-wrapper" style={{ padding: '88px 20px 40px', alignItems: 'flex-start' }}>
      <div className="page-bg" aria-hidden="true">
        <div className="page-bg-blob" />
      </div>

      <div className="container-xl" style={{ maxWidth: '1000px' }}>
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }} className="animate-fadeInUp">
          <div className="badge badge-saffron" style={{ marginBottom: '20px' }}>
            <span>🇮🇳</span> Official Voter Registration Portal
          </div>
          <h1 className="heading-xl" style={{ marginBottom: '16px' }}>
            Your Vote,{' '}
            <span className="text-gradient">Your Voice</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto', lineHeight: '1.7' }}>
            Begin your voter registration by verifying your age. You must be <strong style={{ color: 'var(--saffron)' }}>18 years or older</strong> as of today's date to be eligible.
          </p>
          <div className="tricolor-stripe" style={{ maxWidth: '200px', margin: '24px auto 0' }} />
        </div>

        <div className="row g-4 align-items-start">
          {/* Calendar Section */}
          <div className="col-md-6">
            <div className="glass-card animate-fadeInUp animate-delay-2" style={{ padding: '28px', minHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 10 }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 className="heading-md" style={{ marginBottom: '6px' }}>Select Date of Birth</h2>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Choose your birth date from the date picker below</p>
              </div>
              <CalendarPicker selectedDate={selectedDate} onSelect={handleDateSelect} />
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-md-6">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fadeInUp animate-delay-3">
              {/* Selected Date Display */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Selected Date of Birth
              </div>
              {selectedDate ? (
                <div style={{ fontSize: '1.3rem', fontFamily: 'Outfit, sans-serif', fontWeight: '700', color: 'var(--white)' }}>
                  📅 {formatDate(selectedDate)}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  No date selected yet...
                </div>
              )}
            </div>

            {/* Age Display */}
            {ageInfo && (
              <div
                className={`age-display animate-scaleIn ${eligible ? 'eligible' : 'ineligible'}`}
                id="age-result-card"
              >
                <div className="age-number">{ageInfo.years}</div>
                <div className="age-label" style={{ fontSize: '0.95rem', fontWeight: '500' }}>Years Old</div>

                <div className="age-units">
                  <div className="age-unit">
                    <div className="age-unit-value">{ageInfo.months}</div>
                    <div className="age-unit-label">Months</div>
                  </div>
                  <div style={{ width: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />
                  <div className="age-unit">
                    <div className="age-unit-value">{ageInfo.days}</div>
                    <div className="age-unit-label">Days</div>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  {eligible ? (
                    <div className="badge badge-green" style={{ fontSize: '0.9rem', padding: '8px 18px' }}>
                      ✅ Eligible to Vote
                    </div>
                  ) : (
                    <div className="badge badge-danger" style={{ fontSize: '0.9rem', padding: '8px 18px' }}>
                      ❌ Not Yet Eligible
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Eligibility Requirements */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Voter Eligibility Criteria
              </div>
              {[
                { icon: '🎂', text: 'Must be 18 years or older' },
                { icon: '🇮🇳', text: 'Indian citizen by birth or naturalization' },
                { icon: '🏡', text: 'Ordinary resident of constituency' },
                { icon: '📋', text: 'Valid Aadhar & PAN card required' },
              ].map((req) => (
                <div key={req.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <span>{req.icon}</span>
                  <span>{req.text}</span>
                </div>
              ))}
            </div>

            {/* Info card when no date selected */}
            {!ageInfo && (
              <div className="glass-card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>📋</div>
                <div className="heading-md" style={{ marginBottom: '8px' }}>Please Note These Points</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>
                  <p>1️⃣ Select your date of birth</p>
                  <p>2️⃣ We calculate your exact age</p>
                  <p>3️⃣ Age ≥ 18 → Registration form</p>
                  <p>4️⃣ Age &lt; 18 → Eligibility info</p>
                </div>
              </div>
            )}


            {/* CTA Button */}
            <button
              id="check-eligibility-btn"
              className={`btn btn-lg btn-full ${eligible ? 'btn-green' : ineligible ? 'btn-danger' : 'btn-primary'}`}
              onClick={handleCheckEligibility}
              disabled={!selectedDate}
              aria-label="Check voter eligibility"
              style={{ opacity: selectedDate ? 1 : 0.5 }}
            >
              {!selectedDate && '🗳️ Select Your Date of Birth First'}
              {eligible && '✅ Proceed to Registration →'}
              {ineligible && '❌ View Eligibility Details →'}
            </button>
          </div>
          </div>
        </div>

        {/* Bottom info strip */}
        <div className="animate-fadeInUp animate-delay-5" style={{ marginTop: '40px', textAlign: 'center' }}>
          <div className="divider" />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔒 Your data is secure. We follow Election Commission of India guidelines. | Powered by VoteIndia Platform
          </p>
        </div>
      </div>

    </div>
  );
};

export default AgeVerification;
