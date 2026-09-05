import React from 'react';

export const HorizontalStepper = ({ steps = [], currentStepIndex = 0 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '16px 0' }}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;

        let circleBg = '#334155';
        let circleColor = '#94a3b8';
        let labelColor = '#64748b';

        if (isCompleted) {
          circleBg = '#10b981';
          circleColor = '#ffffff';
          labelColor = '#34d399';
        } else if (isCurrent) {
          circleBg = '#0284c7';
          circleColor = '#ffffff';
          labelColor = '#38bdf8';
        }

        return (
          <React.Fragment key={idx}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: circleBg,
                  color: circleColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: isCurrent ? '0 0 12px rgba(2, 132, 199, 0.5)' : 'none',
                }}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  fontWeight: isCurrent ? '600' : '400',
                  color: labelColor,
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label || step}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: idx < currentStepIndex ? '#10b981' : '#334155',
                  margin: '0 12px',
                  marginBottom: '20px',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default HorizontalStepper;
