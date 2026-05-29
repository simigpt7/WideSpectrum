import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Video, MessageSquare, Users, Mail, TrendingUp, Clock, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];

interface Stats {
  services: number;
  portfolio: number;
  testimonials: number;
  contacts: number;
  unreadContacts: number;
}

interface RecentContact extends ContactSubmission {
  created_ago: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    services: 0,
    portfolio: 0,
    testimonials: 0,
    contacts: 0,
    unreadContacts: 0,
  });
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch counts
      const [servicesRes, portfolioRes, testimonialsRes, contactsRes] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('portfolio_items').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('testimonials').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('contact_submissions').select('id', { count: 'exact' }),
      ]);

      // Fetch unread contacts
      const unreadRes = await supabase
        .from('contact_submissions')
        .select('id', { count: 'exact' })
        .eq('status', 'new');

      // Fetch recent contacts
      const recentRes = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        services: servicesRes.count || 0,
        portfolio: portfolioRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        contacts: contactsRes.count || 0,
        unreadContacts: unreadRes.count || 0,
      });

      if (recentRes.data) {
        const processedContacts = recentRes.data.map((contact) => ({
          ...contact,
          created_ago: getTimeAgo(new Date(contact.created_at)),
        }));
        setRecentContacts(processedContacts);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  const statCards = [
    { name: 'Services', value: stats.services, icon: Briefcase, href: '/admin/services', color: 'teal' },
    { name: 'Portfolio Items', value: stats.portfolio, icon: Video, href: '/admin/portfolio', color: 'cyan' },
    { name: 'Testimonials', value: stats.testimonials, icon: MessageSquare, href: '/admin/testimonials', color: 'purple' },
    { name: 'Total Contacts', value: stats.contacts, icon: Users, href: '/admin/contacts', color: 'amber' },
  ];

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
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const colors = {
            teal: 'from-teal-500/10 to-teal-500/5 border-teal-500/20',
            cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20',
            purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
            amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
          };
          const iconColors = {
            teal: 'text-teal-400',
            cyan: 'text-cyan-400',
            purple: 'text-purple-400',
            amber: 'text-amber-400',
          };
          return (
            <Link
              key={stat.name}
              to={stat.href}
              className={`bg-gradient-to-br ${colors[stat.color as keyof typeof colors]} border rounded-xl p-6 hover:scale-105 transition-transform`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${iconColors[stat.color as keyof typeof iconColors]}`} />
                <TrendingUp className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.name}</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions & Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unread Contacts Alert */}
        {stats.unreadContacts > 0 && (
          <div className="lg:col-span-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Mail className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">New Contact Submissions</p>
                  <p className="text-slate-400 text-sm">
                    You have {stats.unreadContacts} unread message{stats.unreadContacts > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Link
                to="/admin/contacts"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
              >
                View Contacts
              </Link>
            </div>
          </div>
        )}

        {/* Recent Contacts */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Contacts</h2>
            <Link to="/admin/contacts" className="text-sm text-teal-400 hover:text-teal-300">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentContacts.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No contacts yet</p>
            ) : (
              recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">{contact.name}</p>
                      {contact.status === 'new' && (
                        <span className="px-2 py-0.5 bg-teal-500/20 text-teal-400 text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 truncate">{contact.email}</p>
                    <p className="text-sm text-slate-500 truncate mt-1">{contact.message}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    {contact.created_ago}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">Total Portfolio Views</span>
              </div>
              <span className="text-white font-semibold">-</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">Response Rate</span>
              </div>
              <span className="text-white font-semibold">-</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">Avg. Contacts/Month</span>
              </div>
              <span className="text-white font-semibold">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
