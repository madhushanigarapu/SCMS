/**
 * ConfirmModal — replaces window.confirm with a styled dialog.
 *
 * Usage:
 *   const [pending, setPending] = useState(null);
 *
 *   <ConfirmModal
 *     open={pending !== null}
 *     title="Delete course?"
 *     message="This cannot be undone."
 *     confirmLabel="Delete"
 *     danger
 *     onConfirm={() => { doDelete(pending); setPending(null); }}
 *     onCancel={() => setPending(null)}
 *   />
 */
const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className={`modal-icon-wrap ${danger ? "modal-icon-wrap--danger" : "modal-icon-wrap--info"}`}>
          <span className="modal-icon">{danger ? "🗑️" : "❓"}</span>
        </div>

        <h2 id="modal-title" className="modal-title">{title}</h2>

        {message && <p className="modal-message">{message}</p>}

        <div className="modal-actions">
          <button
            className="secondary-button modal-cancel"
            onClick={onCancel}
            autoFocus
          >
            {cancelLabel}
          </button>
          <button
            className={danger ? "modal-confirm-danger" : "primary-button"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
