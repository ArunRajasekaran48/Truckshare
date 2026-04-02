import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/Common/Layout';
import { TruckForm } from '@/components/Truck/TruckForm';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { useTruck, useUpdateTruck } from '@/hooks/useTruck';
import { UIContext } from '@/context/UIContext';

export function EditTruckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useContext(UIContext);
  const { data: truck, isLoading } = useTruck(id);
  const { mutate: updateTruck, isPending } = useUpdateTruck();

  const handleSubmit = (data) => {
    const points = (data.points || [])
      .filter((p) => p.name?.trim())
      .map(({ id: pid, name, type, address, scheduledTime }) => ({
        ...(pid ? { id: pid } : {}),
        name: name.trim(),
        type,
        address: address?.trim() || undefined,
        scheduledTime: scheduledTime?.trim() || undefined,
      }));
    updateTruck(
      { id, data: { ...data, points } },
      {
        onSuccess: () => {
          toast.success('Truck updated!');
          navigate(`/trucks/${id}`);
        },
        onError: (err) => toast.error(err.message || 'Update failed'),
      }
    );
  };

  if (isLoading) return <Layout><LoadingSpinner fullPage /></Layout>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
            ← Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">Edit Truck</h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">{truck?.licensePlate}</p>
        </div>

        <div className="card p-6">
          <TruckForm
            defaultValues={{ ...truck, points: truck.points ?? [] }}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/trucks/${id}`)}
            isLoading={isPending}
          />
        </div>
      </div>
    </Layout>
  );
}
