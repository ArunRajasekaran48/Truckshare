import { Modal } from './Modal';

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size=\
sm\>
      <div className=\space-y-4\>
        <p className=\text-sm
text-gray-600\>{message}</p>
        <div className=\flex
justify-end
gap-3
pt-2\>
          <button onClick={onClose} className=\btn-secondary\>
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={isDanger ? 'btn-danger' : 'btn-primary'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
