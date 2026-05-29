import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import type { Database } from '@/types/database';

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];
type PortfolioInsert = Database['public']['Tables']['portfolio_items']['Insert'];

export function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioInsert>>({
    youtube_id: '',
    title: '',
    artist: '',
    description: '',
    category: 'music',
    display_order: 0,
    is_featured: false,
    is_active: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('portfolio_items')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          } as PortfolioItem)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('portfolio_items').insert([formData as PortfolioInsert]);

        if (error) throw error;
      }

      await fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
      await fetchItems();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setFormData({
      youtube_id: item.youtube_id,
      title: item.title,
      artist: item.artist,
      description: item.description || '',
      category: item.category,
      display_order: item.display_order,
      is_featured: item.is_featured,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      youtube_id: '',
      title: '',
      artist: '',
      description: '',
      category: 'music',
      display_order: 0,
      is_featured: false,
      is_active: true,
    });
  };

  const getThumbnailUrl = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  };

  const getYoutubeUrl = (youtubeId: string) => {
    return `https://www.youtube.com/watch?v=${youtubeId}`;
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
          <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-slate-400 mt-1">Manage your video portfolio</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Video
        </Button>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-teal-500/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-slate-700">
              <img
                src={getThumbnailUrl(item.youtube_id)}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <a
                href={getYoutubeUrl(item.youtube_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </a>
              {item.is_featured && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-teal-500 text-white text-xs rounded">
                  Featured
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-teal-400">{item.artist}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <a
                    href={getYoutubeUrl(item.youtube_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <p className="text-xs text-slate-500">YouTube ID: {item.youtube_id}</p>
              <p className="text-xs text-slate-500">Views: {item.view_count || 0}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Edit Video' : 'Add Video'}
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
                <label className="block text-sm font-medium text-slate-300 mb-2">YouTube Video ID</label>
                <input
                  type="text"
                  value={formData.youtube_id || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, youtube_id: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="e.g., dQw4w9WgXcQ"
                />
                <p className="text-xs text-slate-500 mt-1">
                  The ID from youtube.com/watch?v=<strong>VIDEO_ID</strong>
                </p>
              </div>
              {formData.youtube_id && (
                <div className="aspect-video bg-slate-700 rounded-lg overflow-hidden">
                  <img
                    src={getThumbnailUrl(formData.youtube_id)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="Video title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Artist</label>
                <input
                  type="text"
                  value={formData.artist || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, artist: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="Artist name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none min-h-[80px]"
                  placeholder="Video description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                <select
                  value={formData.category || 'music'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="music">Music</option>
                  <option value="film">Film</option>
                  <option value="commercial">Commercial</option>
                  <option value="other">Other</option>
                </select>
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
