const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner" />
      {message && <p>{message}</p>}
    </div>
  );
};

export default Loading;
