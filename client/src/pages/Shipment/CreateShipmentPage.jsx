import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { ShipmentForm } from '@/components/Shipment/ShipmentForm';
import { useCreateShipment } from '@/hooks/useShipment';
import { UIContext } from '@/context/UIContext';

export function CreateShipmentPage() {
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);
  const { mutate: createShipment, isPending } = useCreateShipment();

  const handleSubmit = (data) => {
    createShipment(data, {
      onSuccess: (newShipment) => {
        toast.success('Shipment created successfully!');
        navigate(`/shipments/${newShipment.id}`);
      },
      onError: (err) => toast.error(err.message || 'Failed to create shipment'),
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Create Shipment</h1>
          <p className="text-sm text-gray-500 mt-1">Fill in your shipment details to find available trucks</p>
        </div>

        <div className="card p-6">
          <ShipmentForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard/business')}
            isLoading={isPending}
          />
        </div>
      </div>
    </Layout>
  );
}
