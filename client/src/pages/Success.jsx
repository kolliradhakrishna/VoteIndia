import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Confetti from '../components/Confetti';

const Success = () => {
  const { state } = useLocation();
  const voter = state?.voter;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A';

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Confetti />

      <div className="page-wrapper" style={{ padding: '88px 20px 40px', alignItems: 'flex-start' }}>
        <div className="page-bg" aria-hidden="true">
          <div className="page-bg-blob" style={{ background: 'radial-gradient(circle, rgba(19,136,8,0.1) 0%, transparent 70%)' }} />
        </div>

        <div className="container" style={{ maxWidth: '680px' }}>
          {/* Header */}
          <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '16px', animation: 'scaleIn 0.5s ease' }}>🎉</div>
            <div className="badge badge-green" style={{ marginBottom: '16px', fontSize: '0.9rem', padding: '8px 20px' }}>
              Registration Successful!
            </div>
            <h1 className="heading-xl" style={{ marginBottom: '12px' }}>
              Welcome to <span className="text-gradient">Democracy!</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Your voter registration has been submitted successfully. Your application is currently under review.
            </p>
            <div className="tricolor-stripe" style={{ maxWidth: '180px', margin: '20px auto 0' }} />
          </div>

          {/* Voter ID Card */}
          {voter && (
            <div className="animate-scaleIn animate-delay-2" id="voter-card">
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Your Voter ID Card
                </span>
              </div>

              <div className="voter-card">
                <div className="voter-card-tricolor" />
                <div className="voter-card-header">
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', opacity: 0.7, letterSpacing: '0.08em' }}>
                      ELECTION COMMISSION OF INDIA
                    </div>
                    <div className="voter-card-header-title">ELECTORAL PHOTO IDENTITY CARD</div>
                  </div>
                  <div style={{ fontSize: '1.8rem' }}>🇮🇳</div>
                </div>

                <div className="voter-card-body">
                  {voter.photoUrl ? (
                    <img
                      src={voter.photoUrl}
                      alt="Voter photo"
                      className="voter-card-photo"
                    />
                  ) : (
                    <div className="voter-card-photo-placeholder">👤</div>
                  )}

                  <div className="voter-id-number">{voter.voterIdNumber}</div>
                  <div className="voter-card-name">{voter.fullName}</div>

                  <div className="voter-card-detail">
                    Father / Guardian: <span>—</span>
                  </div>
                  <div className="voter-card-detail">
                    Date of Birth: <span>{formatDate(voter.dateOfBirth)}</span>
                  </div>
                  <div className="voter-card-detail">
                    Gender: <span>{voter.gender}</span>
                  </div>
                  <div className="voter-card-detail" style={{ marginTop: '10px' }}>
                    Address: <span style={{ display: 'block', lineHeight: '1.5' }}>
                      {voter.address}, {voter.city},<br />{voter.state} — {voter.pinCode}
                    </span>
                  </div>
                </div>

                <div className="voter-card-footer">
                  <div className="voter-card-status">
                    <div className="status-dot" />
                    Status: Pending Review
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(voter.registrationDate)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="animate-fadeInUp animate-delay-3" style={{ marginTop: '28px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              id="print-voter-card-btn"
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ flex: 1, minWidth: '160px' }}
            >
              🖨️ Print Voter Card
            </button>
            <Link
              to="/admin"
              id="view-registrations-btn"
              className="btn btn-ghost"
              style={{ flex: 1, minWidth: '160px' }}
            >
              📊 View All Registrations
            </Link>
            <Link
              to="/"
              id="register-another-btn"
              className="btn btn-outline-saffron"
              style={{ flex: 1, minWidth: '160px' }}
            >
              + Register Another
            </Link>
          </div>

          {/* Info box */}
          <div
            className="glass-card animate-fadeInUp animate-delay-4"
            style={{ padding: '24px', marginTop: '24px' }}
          >
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📋</span> What Happens Next?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { step: '01', text: 'Your application is under review by the Election Commission', time: '3–5 days' },
                { step: '02', text: 'You will receive a confirmation SMS and email', time: '5–7 days' },
                { step: '03', text: 'Physical voter card will be dispatched to your address', time: '15–30 days' },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}
                >
                  <div style={{
                    minWidth: '32px', height: '32px',
                    background: 'rgba(255,153,51,0.1)',
                    border: '1px solid rgba(255,153,51,0.3)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Outfit, sans-serif', fontWeight: '700',
                    fontSize: '0.75rem', color: 'var(--saffron)',
                  }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', marginBottom: '2px' }}>{item.text}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--saffron)' }}>⏱ {item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .navbar, .page-bg, .btn, .confetti-container, .glass-card { display: none !important; }
          .voter-card { box-shadow: none !important; max-width: 400px; margin: 0 auto; }
          body { background: white !important; }
        }
      `}</style>
    </>
  );
};

export default Success;
