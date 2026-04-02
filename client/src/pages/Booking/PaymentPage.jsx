import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useBooking, useAcknowledgePayment } from '@/hooks/useBooking';
import { UIContext } from '@/context/UIContext';
import { formatDate, truncateId } from '@/utils/formatters';

/**
 * PaymentPage
 * Allows a TRUCK_OWNER to acknowledge payment for a specific booking.
 * Direct URL: /bookings/:bookingId/payment
 */
export function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);

  const { data: booking, isLoading } = useBooking(bookingId);
  const { mutate: ackPayment, isPending } = useAcknowledgePayment();

  const [ref, setRef] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ref.trim()) { setErr('Payment reference is required'); return; }
    setErr('');

    ackPayment(
      { id: bookingId, paymentReference: ref.trim() },
      {
        onSuccess: () => {
          toast.success('Payment acknowledged!');
          navigate('/bookings');
        },
        onError: (error) => toast.error(error.message || 'Failed to acknowledge payment'),
      }
    );
  };

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;
  if (!booking) return <Layout><p className="p-8 text-gray-500">Booking not found.</p></Layout>;

  if (booking.paymentConfirmed) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-16 space-y-4">
          <span className="text-5xl">✅</span>
          <h2 className="text-xl font-bold text-gray-900">Payment Already Confirmed</h2>
          <p className="text-sm text-gray-500">Reference: <span className="font-mono">{booking.paymentReference}</span></p>
          <button onClick={() => navigate('/bookings')} className="btn-secondary">
            ← Back to Bookings
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Acknowledge Payment</h1>
          <p className="text-sm text-gray-500 mt-1">Confirm you have received payment for this booking</p>
        </div>

        {/* Booking summary */}
        <div className="card p-5 space-y-3">
          <p className="text-xs text-gray-400 font-mono">Booking #{truncateId(booking.id)}</p>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Weight', val: booking.allocatedWeight, unit: 'kg' },
              { label: 'Volume', val: booking.allocatedVolume, unit: 'm³' },
              { label: 'Length', val: booking.allocatedLength, unit: 'm' },
            ].map(({ label, val, unit }) => (
              <div key={label} className="bg-gray-50 rounded-xl py-3">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-bold text-gray-800 text-sm">{val?.toLocaleString()} {unit}</p>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-400">Created: {formatDate(booking.createdAt)}</div>
        </div>

        {/* Payment reference form */}
        <form onSubmit={handleSubmit} className="card p-5 space-y-4">
          <div>
            <label className="label">Payment Reference</label>
            <input
              type="text"
              className="input-field"
              placeholder="UPI ID, cheque no., transfer ID…"
              value={ref}
              onChange={(e) => { setRef(e.target.value); setErr(''); }}
            />
            {err && <p className="error-text">{err}</p>}
            <p className="text-xs text-gray-400 mt-1">
              Enter the reference from your payment provider so the business user can verify.
            </p>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={isPending} className="btn-primary flex-1 py-2.5">
              {isPending ? 'Confirming…' : '✓ Confirm Payment Received'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
