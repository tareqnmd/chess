'use client';

const ErrorComponent = ({ reset }: { reset: () => void }) => {
  return (
    <div className="error-page">
      <h2 className="error-page-header">Something went wrong!</h2>
      <button className="error-page-button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
};

export default ErrorComponent;
