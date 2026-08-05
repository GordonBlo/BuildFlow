type LoadingStateProps = {
  message?: string;
};

function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status">
      <span className="loading-state__indicator" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;
