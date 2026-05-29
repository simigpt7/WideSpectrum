import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GripVertical, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import type { Database } from '@/types/database';

type Service = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];

// Type guard for features array
function isFeaturesArray(features: unknown): features is string[] {
  return Array.isArray(features) && features.every(item => typeof item === 'string');
}

const iconOptions = [
  'Music', 'Mic', 'Volume2', 'Radio', 'Film', 'UserPlus', 'Headphones', 'Music2'
];

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<ServiceInsert>>({
    title: '',
    description: '',
    icon_name: 'Music',
    features: [],
    is_featured: false,
    display_order: 0,
    is_active: true,
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          } as Service)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert([formData as ServiceInsert]);

        if (error) throw error;
      }

      await fetchServices();
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title,
      description: service.description,
      icon_name: service.icon_name,
      features: service.features || [],
      is_featured: service.is_featured,
      display_order: service.display_order,
      is_active: service.is_active,
    });
    setShowForm(true);
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(((prev.features as string[]) || []) as string[]), newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: ((prev.features as string[]) || []).filter((_: string, i: number) => i !== index),
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      icon_name: 'Music',
      features: [],
      is_featured: false,
      display_order: 0,
      is_active: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-slate-400 mt-1">Manage your service offerings</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-teal-500/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-400">
                <GripVertical className="w-4 h-4 cursor-move" />
                <span className="text-sm">#{service.display_order}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
            <p className="text-sm text-slate-400 line-clamp-2">{service.description}</p>
            {service.features && isFeaturesArray(service.features) && service.features.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {service.features.slice(0, 3).map((feature: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
                {service.features.length > 3 && (
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                    +{service.features.length - 3} more
                  </span>
                )}
              </div>
            )}
            {service.is_featured && (
              <span className="inline-block mt-4 px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded">
                Featured
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Edit Service' : 'Add Service'}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="Service title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none min-h-[100px]"
                  placeholder="Service description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
                <select
                  value={formData.icon_name || 'Music'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon_name: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Features</label>
                <div className="space-y-2">
                  {((formData.features as string[]) || []).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...((formData.features as string[]) || [])]as string[];
                          newFeatures[idx] = e.target.value;
                          setFormData((prev) => ({ ...prev, features: newFeatures }));
                        }}
                        className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                      className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                      placeholder="Add feature"
                    />
                    <Button onClick={handleAddFeature} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-300">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-300">Active</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order || 0}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <Button onClick={resetForm} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
