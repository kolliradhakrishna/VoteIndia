const STEPS = [
  { label: 'Personal' },
  { label: 'Contact' },
  { label: 'ID Proof' },
  { label: 'Review' },
];

const StepIndicator = ({ currentStep }) => {
  return (
    <div className="step-indicator" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={4}>
      {STEPS.map((step, index) => {
        const stepNum = index + 1;
        const status =
          stepNum < currentStep ? 'completed' : stepNum === currentStep ? 'active' : 'inactive';

        return (
          <div key={step.label} className="step-item">
            <div className="step-wrapper">
              <div
                className={`step-circle ${status}`}
                id={`step-circle-${stepNum}`}
                aria-label={`Step ${stepNum}: ${step.label}`}
              >
                {status === 'completed' ? '✓' : stepNum}
              </div>
              <div className={`step-label ${status === 'active' ? 'active' : ''}`}>
                {step.label}
              </div>
            </div>

            {index < STEPS.length - 1 && (
              <div className="step-line-wrapper">
                <div className={`step-line ${status === 'completed' ? 'completed' : ''}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
