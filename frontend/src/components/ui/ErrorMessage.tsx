type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-message" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button
          className="button button--secondary button--compact"
          type="button"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
