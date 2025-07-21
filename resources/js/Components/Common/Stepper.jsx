import React from 'react';
 

const Stepper = ({ currentStep, steps}) => {
 

  return (
    <div className="w-100 d-flex justify-content-center">
      <div className="stepper-track d-flex align-items-center w-100 position-relative">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;

          return (
            <React.Fragment key={step}>
              {/* Dot */}
              <div
                className={`stepper-dot ${isCompleted || isActive ? 'filled' : ''} ${isActive ? 'active' : ''}`}
              ></div>

              {/* Line (only between dots) */}
              {index < steps.length - 1 && (
                <div className="stepper-line-wrapper">
                  <div className="stepper-line-bg" />
                  <div
                    className={`stepper-line-fill ${currentStep > step ? 'filled' : ''}`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
