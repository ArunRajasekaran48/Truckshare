import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { TruckForm } from '@/components/Truck/TruckForm';
import { useAddTruck } from '@/hooks/useTruck';
import { UIContext } from '@/context/UIContext';

export function AddTruckPage() {
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);
  const { mutate: addTruck, isPending } = useAddTruck();

  const handleSubmit = (data) => {
    const points = (data.points || [])
      .filter((p) => p.name?.trim())
      .map(({ id, name, type, address, scheduledTime }) => ({
        ...(id ? { id } : {}),
        name: name.trim(),
        type,
        address: address?.trim() || undefined,
        scheduledTime: scheduledTime?.trim() || undefined,
      }));
    // Mirror available = total on creation
    const payload = {
      ...data,
      availableWeight: data.availableWeight || data.capacityWeight,
      availableVolume: data.availableVolume || data.capacityVolume,
      availableLength: data.availableLength || data.capacityLength,
      points,
    };
    addTruck(payload, {
      onSuccess: () => {
        toast.success('Truck added successfully!');
        navigate('/dashboard/owner');
      },
      onError: (err) => toast.error(err.message || 'Failed to add truck'),
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Add New Truck</h1>
          <p className="text-sm text-gray-500 mt-1">Register a truck to start accepting shipments</p>
        </div>

        <div className="card p-6">
          <TruckForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard/owner')}
            isLoading={isPending}
          />
        </div>
      </div>
    </Layout>
  );
}
