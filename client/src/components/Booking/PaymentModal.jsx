import { useState } from 'react';
import { Modal } from '@/components/Common/Modal';
import { truncateId } from '@/utils/formatters';

export function PaymentModal({ isOpen, onClose, booking, onConfirm, isLoading }) {
  const [ref, setRef] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = () => {
    if (!ref.trim()) { setErr('Payment reference is required'); return; }
    setErr('');
    onConfirm(booking.id, ref.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Acknowledge Payment" size="sm">
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-3 text-sm">
          <p className="text-gray-500">Booking</p>
          <p className="font-mono font-semibold text-gray-800">#{truncateId(booking?.id)}</p>
        </div>

        <div>
          <label className="label">Payment Reference</label>
          <input
            type="text"
            placeholder="UPI ID, cheque no., transfer ref…"
            value={ref}
            onChange={(e) => { setRef(e.target.value); setErr(''); }}
            className="input-field"
          />
          {err && <p className="error-text">{err}</p>}
          <p className="text-xs text-gray-400 mt-1">Enter the reference from your payment provider.</p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSubmit} disabled={isLoading} className="btn-primary flex-1">
            {isLoading ? 'Confirming…' : '✓ Confirm Payment'}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
