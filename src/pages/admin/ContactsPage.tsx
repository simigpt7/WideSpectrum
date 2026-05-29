import { useEffect, useState } from 'react';
import { Mail, Phone, Calendar, Eye, Archive, Send, Search, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import type { Database } from '@/types/database';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

export function ContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: ContactSubmission['status']) => {
    try {
      const updateData: Partial<ContactSubmission> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'replied') {
        updateData.replied_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('contact_submissions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      await fetchContacts();
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, ...updateData });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredContacts = contacts.filter((contact) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.message.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status: ContactSubmission['status']) => {
    const colors: Record<string, string> = {
      new: 'bg-teal-500/20 text-teal-400',
      read: 'bg-blue-500/20 text-blue-400',
      replied: 'bg-green-500/20 text-green-400',
      archived: 'bg-slate-500/20 text-slate-400',
    };
    return colors[status] || colors.new;
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
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
        <p className="text-slate-400 mt-1">Manage incoming contact requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none"
            placeholder="Search contacts..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts Table */}
        <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-white">
              {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
            </h3>
          </div>
          <div className="divide-y divide-slate-700 max-h-[600px] overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No contacts found</div>
            ) : (
              filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    if (contact.status === 'new') {
                      handleUpdateStatus(contact.id, 'read');
                    }
                  }}
                  className={`w-full p-4 text-left hover:bg-slate-700/50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-slate-700/50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-white">{contact.name}</p>
                      <p className="text-sm text-slate-400">{contact.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(contact.status)}`}
                    >
                      {contact.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{contact.message}</p>
                  <p className="text-xs text-slate-600 mt-2">{formatDate(contact.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          {selectedContact ? (
            <div>
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedContact.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${selectedContact.email}`} className="hover:text-teal-400">
                          {selectedContact.email}
                        </a>
                      </div>
                      {selectedContact.phone && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${selectedContact.phone}`} className="hover:text-teal-400">
                            {selectedContact.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedContact.status)}`}
                  >
                    {selectedContact.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedContact.created_at)}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {selectedContact.service && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Service Interest
                    </label>
                    <p className="text-white">{selectedContact.service}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                  <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {selectedContact.notes && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Notes</label>
                    <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                      <p className="text-white whitespace-pre-wrap">{selectedContact.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-700">
                  <Button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'new')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Mark as New
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'replied')}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Mark as Replied
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'archived')}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </Button>
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: Your Inquiry - Wide Spectrum Productions`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors ml-auto"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              Select a contact to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
