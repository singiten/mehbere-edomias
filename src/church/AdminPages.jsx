import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { members, donations, events, blog, sermons, services, auth } from '../services/api';
import toast from 'react-hot-toast';
import { C, Btn, Badge, Card, SectionHeading, Input, Textarea, Select, StatCard, OrthodoxCross, Divider } from './Layout';
import ImageUpload from '../components/ImageUpload';
// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

export function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingDonations: 0,
    newMembersThisMonth: 0,
    donationsThisMonth: 0,
    totalServices: 0,
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [pendingDonations, setPendingDonations] = useState([]);
  const [donationTrend, setDonationTrend] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔵 Fetching dashboard data...');

        // Fetch member stats
        try {
          const response = await members.getStats();
          const memberData = response.data?.data || response.data || {};
          setStats(prev => ({
            ...prev,
            totalMembers: memberData.total || 0,
            newMembersThisMonth: memberData.newThisMonth || 0,
          }));
        } catch (err) {
          console.error('❌ Member stats error:', err);
        }

        // Fetch donation stats
        try {
          const response = await donations.getStats();
          const donationData = response.data?.data || response.data || {};
          setStats(prev => ({
            ...prev,
            pendingDonations: donationData.pending || 0,
            donationsThisMonth: donationData.thisMonth || 0,
          }));

          const trendData = [];
          if (donationData.byType && Array.isArray(donationData.byType)) {
            donationData.byType.forEach(item => {
              trendData.push({ label: item._id, value: item.total });
            });
          }
          setDonationTrend(trendData);
        } catch (err) {
          console.error('❌ Donation stats error:', err);
        }

        // Fetch services
        try {
          const response = await services.getAll();
          const servicesData = response.data?.data || response.data || [];
          setStats(prev => ({
            ...prev,
            totalServices: Array.isArray(servicesData) ? servicesData.length : 0,
          }));
          setRecentServices(Array.isArray(servicesData) ? servicesData.slice(0, 3) : []);
        } catch (err) {
          console.error('❌ Services error:', err);
        }

        // Fetch recent members
        try {
          const response = await members.getAll({ limit: 5 });
          const membersData = response.data?.data || response.data || [];
          setRecentMembers(Array.isArray(membersData) ? membersData : []);
        } catch (err) {
          console.error('❌ Recent members error:', err);
        }

        // Fetch pending donations
        try {
          const response = await donations.getPending();
          const pendingData = response.data?.data || response.data || [];
          setPendingDonations(Array.isArray(pendingData) ? pendingData : []);
        } catch (err) {
          console.error('❌ Pending donations error:', err);
        }

      } catch (error) {
        console.error('❌ Error fetching admin data:', error);
        setError(error.message);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-5xl mb-4">⚠️</p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.blue }}>Unable to Load Dashboard</h2>
          <p className="text-sm mb-6" style={{ color: C.gray600 }}>{error}</p>
          <Btn variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Btn>
        </div>
      </div>
    );
  }

  const statsDisplay = [
    { icon: '👥', value: stats.totalMembers, label: 'Total Members', color: C.blue },
    { icon: '⏳', value: stats.pendingDonations, label: 'Pending Donations', color: C.warning },
    { icon: '🌱', value: stats.newMembersThisMonth, label: 'New Members This Month', color: C.success },
    { icon: '💰', value: `ETB ${(stats.donationsThisMonth || 0).toLocaleString()}`, label: 'Donations This Month', color: C.gold },
    { icon: '⛪', value: stats.totalServices, label: 'Total Services', color: C.blue },
  ];

  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <OrthodoxCross size={32} color={C.gold} />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: C.blue }}>Admin Dashboard</h1>
            <p className="text-sm" style={{ color: C.gray600 }}>Mehbere Edomias Administration Panel</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statsDisplay.map((s, index) => (
            <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} color={s.color} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <Link to="/admin/members" className="flex flex-col items-center gap-2 py-4 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:scale-105" style={{ background: C.blue, color: C.gold }}>
            <span className="text-2xl">👤</span>Add Member
          </Link>
          <Link to="/admin/content" className="flex flex-col items-center gap-2 py-4 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:scale-105" style={{ background: C.blue, color: C.gold }}>
            <span className="text-2xl">📝</span>Create Blog
          </Link>
          <Link to="/admin/content" className="flex flex-col items-center gap-2 py-4 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:scale-105" style={{ background: C.blue, color: C.gold }}>
            <span className="text-2xl">📅</span>Create Event
          </Link>
          <Link to="/admin/donations" className="flex flex-col items-center gap-2 py-4 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:scale-105" style={{ background: C.blue, color: C.gold }}>
            <span className="text-2xl">💳</span>Verify Donations
          </Link>
          <Link to="/admin/services" className="flex flex-col items-center gap-2 py-4 rounded-xl text-sm font-medium transition-all hover:shadow-md hover:scale-105" style={{ background: C.blue, color: C.gold }}>
            <span className="text-2xl">⛪</span>Manage Services
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="font-bold mb-4 text-sm" style={{ color: C.blue }}>Donations by Type</h3>
            {donationTrend.length > 0 ? (
              donationTrend.map((item, i) => {
                const total = donationTrend.reduce((sum, d) => sum + d.value, 0);
                const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-xs mb-1" style={{ color: C.gray600 }}>
                      <span className="capitalize">{item.label}</span>
                      <span>ETB {item.value.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: C.gray100 }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: C.gold }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-center py-4" style={{ color: C.gray400 }}>No donation data available</p>
            )}
          </Card>

          <Card>
            <h3 className="font-bold mb-4 text-sm flex items-center justify-between" style={{ color: C.blue }}>
              Recent Services
              <Link to="/admin/services" className="text-xs font-medium hover:underline" style={{ color: C.gold }}>View All →</Link>
            </h3>
            {recentServices.length > 0 ? (
              recentServices.map((s, i) => (
                <div key={i} className="py-2.5 border-b last:border-0" style={{ borderColor: C.gray100 }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{s.icon || '⛪'}</span>
                    <div>
                      <p className="text-xs font-medium" style={{ color: C.blue }}>{s.title}</p>
                      <p className="text-xs" style={{ color: C.gray400 }}>{s.type || 'Service'} · {s.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-4" style={{ color: C.gray400 }}>No services created yet</p>
            )}
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: C.blue }}>
                Pending Donations <Badge color="yellow">{pendingDonations.length}</Badge>
              </h3>
              <Link to="/admin/donations" className="text-xs font-medium hover:underline" style={{ color: C.gold }}>View All →</Link>
            </div>
            {pendingDonations.length > 0 ? (
              pendingDonations.slice(0, 4).map((d, i) => (
                <div key={i} className="py-2.5 border-b last:border-0" style={{ borderColor: C.gray100 }}>
                  <div className="flex justify-between mb-1">
                    <p className="text-xs font-medium" style={{ color: C.blue }}>{d.memberId?.fullName || d.memberId?.userId?.fullName || 'Unknown'}</p>
                    <p className="text-xs font-semibold" style={{ color: C.gold }}>ETB {d.amount}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs" style={{ color: C.gray400 }}>{d.donationType}</p>
                    <p className="text-xs" style={{ color: C.gray400 }}>{new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-4" style={{ color: C.gray400 }}>No pending donations</p>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: C.blue }}>
                Recent Members <Badge color="green">{recentMembers.length}</Badge>
              </h3>
              <Link to="/admin/members" className="text-xs font-medium hover:underline" style={{ color: C.gold }}>View All →</Link>
            </div>
            {recentMembers.length > 0 ? (
              recentMembers.slice(0, 4).map((m, i) => (
                <div key={i} className="py-2.5 border-b last:border-0" style={{ borderColor: C.gray100 }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: C.blue }}>{m.userId?.fullName || 'Unknown'}</p>
                  <p className="text-xs" style={{ color: C.gray400 }}>{m.userId?.phoneNumber || 'No phone'} · {m.region} · {new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-4" style={{ color: C.gray400 }}>No recent members</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── MEMBER MANAGEMENT ────────────────────────────────────────────────────────

export function MemberManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [membersList, setMembersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    region: '',
    subCity: '',
    spiritualRole: 'regular_member',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching members...');
      const response = await members.getAll({ limit: 100 });
      console.log('👥 Members response:', response);
      const membersData = response.data?.data || response.data || [];
      setMembersList(Array.isArray(membersData) ? membersData : []);
    } catch (error) {
      console.error('❌ Failed to load members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.fullName || !formData.phoneNumber || !formData.region) {
        toast.error('Full Name, Phone Number, and Region are required');
        setSubmitting(false);
        return;
      }

      console.log('📝 Creating member with data:', formData);
      
      // ✅ Use the auth service to create a member
      const response = await auth.createMember(formData);
      console.log('✅ Member created:', response);
      
      toast.success('Member created successfully! A temporary password has been generated.');
      setShowModal(false);
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        region: '',
        subCity: '',
        spiritualRole: 'regular_member',
      });
      
      // Refresh the members list
      await fetchMembers();
      
    } catch (error) {
      console.error('❌ Failed to create member:', error);
      console.error('❌ Error response:', error.response?.data);
      
      // Extract error message
      let errorMessage = 'Failed to create member';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const statuses = ['All', 'Active', 'Inactive', 'Suspended'];
  const filtered = membersList
    .filter(m => statusFilter === 'All' || m.membershipStatus === statusFilter.toLowerCase())
    .filter(m => {
      const userName = m.userId?.fullName || '';
      const phone = m.userId?.phoneNumber || '';
      return !search || userName.toLowerCase().includes(search.toLowerCase()) || phone.includes(search) || m.membershipId?.includes(search);
    });

  const handleStatusUpdate = async (memberId, newStatus) => {
    try {
      await members.updateStatus(memberId, newStatus);
      toast.success(`Member status updated to ${newStatus}`);
      await fetchMembers();
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading eyebrow="Admin" title="Member Management" />
          <div className="flex gap-2">
            <Btn variant="outline">⬇ Export</Btn>
            <Btn variant="primary" onClick={() => setShowModal(true)}>
              + Add Member
            </Btn>
          </div>
        </div>

        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-48">
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, phone, ID…"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                style={{ borderColor: C.gray100, color: C.gray800 }} />
            </div>
            <div className="flex gap-2">
              {statuses.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: statusFilter === s ? C.blue : C.gray50, color: statusFilter === s ? C.gold : C.gray600, border: `1px solid ${statusFilter === s ? C.blue : C.gray100}` }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.blue, color: C.gold }}>
                {['ID', 'Name', 'Phone', 'Region', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((m, i) => (
                  <tr key={m._id} className="border-b last:border-0 transition-colors hover:bg-blue-50" style={{ borderColor: C.gray100, background: i % 2 === 0 ? '#fff' : C.gray50 }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: C.gray400 }}>{m.membershipId || 'N/A'}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: C.blue }}>{m.userId?.fullName || 'Unknown'}</td>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{m.userId?.phoneNumber || 'N/A'}</td>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{m.region || 'N/A'}</td>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{m.spiritualRole || 'regular_member'}</td>
                    <td className="px-4 py-3">
                      <Badge color={m.membershipStatus === 'active' ? 'green' : m.membershipStatus === 'inactive' ? 'gray' : 'red'}>
                        {m.membershipStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <select 
                          onChange={(e) => handleStatusUpdate(m._id, e.target.value)}
                          value={m.membershipStatus}
                          className="text-xs border rounded px-1 py-0.5"
                          style={{ borderColor: C.gray100 }}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center" style={{ color: C.gray400 }}>
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-4 py-3 flex items-center justify-between text-xs" style={{ borderTop: `1px solid ${C.gray100}`, color: C.gray400 }}>
            <span>Showing {filtered.length} of {membersList.length} members</span>
          </div>
        </Card>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,26,46,0.75)', backdropFilter: 'blur(4px)' }}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: C.blue }}>Add New Member</h3>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ color: C.gray400 }}
                className="hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                  placeholder="e.g., 0912345678"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>
                  Region *
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                  placeholder="e.g., Addis Ababa"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>
                  Sub City
                </label>
                <input
                  type="text"
                  name="subCity"
                  value={formData.subCity}
                  onChange={handleInputChange}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                  placeholder="e.g., Bole"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>
                  Spiritual Role
                </label>
                <select
                  name="spiritualRole"
                  value={formData.spiritualRole}
                  onChange={handleInputChange}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                >
                  <option value="regular_member">Regular Member</option>
                  <option value="priest">Priest</option>
                  <option value="deacon">Deacon</option>
                  <option value="choir">Choir</option>
                  <option value="youth_leader">Youth Leader</option>
                  <option value="elder">Elder</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3 border-t" style={{ borderColor: C.gray100 }}>
                <Btn 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setShowModal(false)}
                  type="button"
                >
                  Cancel
                </Btn>
                <Btn 
                  variant="primary" 
                  type="submit" 
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Member'}
                </Btn>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}


// ─── DONATION MANAGEMENT ──────────────────────────────────────────────────────

export function DonationManagement() {
  const [tab, setTab] = useState('All');
  const [donationsList, setDonationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyModal, setVerifyModal] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        console.log('💰 Fetching donations...');
        const response = await donations.getAll({ limit: 100 });
        console.log('💰 Donations response:', response);
        const donationsData = response.data?.data || response.data || [];
        setDonationsList(Array.isArray(donationsData) ? donationsData : []);
      } catch (error) {
        console.error('❌ Failed to load donations:', error);
        toast.error('Failed to load donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const tabs = ['All', 'Pending', 'Verified', 'Rejected'];
  const filtered = tab === 'All' ? donationsList :
    tab === 'Pending' ? donationsList.filter(d => d.status === 'pending') :
    tab === 'Verified' ? donationsList.filter(d => d.status === 'verified') :
    donationsList.filter(d => d.status === 'rejected');

  const handleVerify = async (id, action) => {
    try {
      if (action === 'verify') {
        await donations.verify(id, { adminNotes });
        toast.success('Donation verified successfully');
      } else {
        await donations.reject(id, { adminNotes: adminNotes || 'Rejected by admin' });
        toast.success('Donation rejected');
      }
      setVerifyModal(null);
      setAdminNotes('');
      const response = await donations.getAll({ limit: 100 });
      const donationsData = response.data?.data || response.data || [];
      setDonationsList(Array.isArray(donationsData) ? donationsData : []);
    } catch (error) {
      console.error('❌ Action failed:', error);
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const verifyDonation = donationsList.find(d => d._id === verifyModal);

  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <SectionHeading eyebrow="Admin" title="Donation Management" />
            <Badge color="yellow">{donationsList.filter(d => d.status === 'pending').length} pending</Badge>
          </div>
          <Btn variant="outline">⬇ Export Report</Btn>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{ background: tab === t ? C.blue : '#fff', color: tab === t ? C.gold : C.gray600, border: `1px solid ${tab === t ? C.blue : C.gray100}` }}>
              {t}
            </button>
          ))}
        </div>

        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.blue, color: C.gold }}>
                {['Date', 'Member', 'Type', 'Amount (ETB)', 'Bank', 'Reference', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((d, i) => (
                  <tr key={d._id} className="border-b last:border-0 hover:bg-blue-50 transition-colors" style={{ borderColor: C.gray100, background: i % 2 === 0 ? '#fff' : C.gray50 }}>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: C.blue }}>{d.memberId?.userId?.fullName || d.memberId?.fullName || 'Unknown'}</td>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{d.donationType}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: C.gold }}>{d.amount.toLocaleString()}</td>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{d.bankName}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: C.gray400 }}>{d.referenceNumber}</td>
                    <td className="px-4 py-3">
                      <Badge color={d.status === 'verified' ? 'green' : d.status === 'rejected' ? 'red' : 'yellow'}>{d.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {d.status === 'pending' && (
                          <>
                            <Btn variant="secondary" small onClick={() => setVerifyModal(d._id)}>Verify</Btn>
                            <Btn variant="danger" small onClick={() => {
                              setVerifyModal(d._id);
                              setAdminNotes('Rejected by admin');
                              handleVerify(d._id, 'reject');
                            }}>Reject</Btn>
                          </>
                        )}
                        {d.status !== 'pending' && (
                          <Btn variant="ghost" small>📄 Receipt</Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center" style={{ color: C.gray400 }}>
                    No {tab.toLowerCase()} donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {verifyModal && verifyDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,26,46,0.75)', backdropFilter: 'blur(4px)' }}>
          <Card className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: C.blue }}>Verify Donation</h3>
              <button onClick={() => setVerifyModal(null)} style={{ color: C.gray400 }}>✕</button>
            </div>

            <div className="rounded-xl p-4 mb-4" style={{ background: C.gray50 }}>
              {[
                ['Member', verifyDonation.memberId?.userId?.fullName || verifyDonation.memberId?.fullName || 'Unknown'],
                ['Amount', `ETB ${verifyDonation.amount.toLocaleString()}`],
                ['Type', verifyDonation.donationType],
                ['Bank', verifyDonation.bankName],
                ['Reference', verifyDonation.referenceNumber],
                ['Date', new Date(verifyDonation.createdAt).toLocaleDateString()],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between py-1.5 border-b last:border-0 text-sm" style={{ borderColor: C.gray100 }}>
                  <span style={{ color: C.gray600 }}>{l}</span>
                  <span className="font-medium" style={{ color: C.blue }}>{v}</span>
                </div>
              ))}
            </div>

            <Textarea 
              label="Admin Notes" 
              rows={2} 
              placeholder="Add any notes about this verification…" 
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              className="mb-4" 
            />

            <div className="flex gap-3">
              <Btn variant="danger" className="flex-1" onClick={() => handleVerify(verifyModal, 'reject')}>
                ✕ Reject
              </Btn>
              <Btn variant="primary" className="flex-1" onClick={() => handleVerify(verifyModal, 'verify')}>
                ✓ Approve
              </Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── CONTENT MANAGEMENT ───────────────────────────────────────────────────────


export function ContentManagement() {
  const [tab, setTab] = useState('Blog Posts');
  const [blogPosts, setBlogPosts] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [sermonsList, setSermonsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'spiritual_teaching',
    featuredImage: '',
    tags: '',
    status: 'draft',
    isFeatured: false,
    // Event fields
    description: '',
    date: '',
    endDate: '',
    time: '',
    location: {
      name: '',
      address: '',
    },
    eventType: 'other',
    isPublic: true,
    isVirtual: false,
    meetingLink: '',
    capacity: '',
    organizer: '',
    contactEmail: '',
    contactPhone: '',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      console.log('📝 Fetching content...');
      const [blogRes, eventRes, sermonRes] = await Promise.all([
        blog.getAll({ limit: 100 }),
        events.getAll({ limit: 100 }),
        sermons.getAll({ limit: 100 }),
      ]);
      
      const blogData = blogRes.data?.data || blogRes.data || [];
      const eventData = eventRes.data?.data || eventRes.data || [];
      const sermonData = sermonRes.data?.data || sermonRes.data || [];
      
      setBlogPosts(Array.isArray(blogData) ? blogData : []);
      setEventsList(Array.isArray(eventData) ? eventData : []);
      setSermonsList(Array.isArray(sermonData) ? sermonData : []);
    } catch (error) {
      console.error('❌ Failed to load content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested location fields
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, featuredImage: url }));
  };

  // ─── BLOG CRUD ──────────────────────────────────────────────────────────────

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!formData.title || !formData.content || !formData.category) {
        toast.error('Title, Content, and Category are required');
        setSubmitting(false);
        return;
      }

      const blogData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || '',
        category: formData.category,
        featuredImage: formData.featuredImage || '',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        status: formData.status || 'draft',
        isFeatured: formData.isFeatured || false,
      };

      console.log('📝 Creating/Updating blog post:', blogData);
      
      let response;
      if (editingItem) {
        response = await blog.update(editingItem._id, blogData);
        toast.success('Blog post updated successfully!');
      } else {
        response = await blog.create(blogData);
        toast.success('Blog post created successfully!');
      }
      
      console.log('✅ Blog post saved:', response);
      
      setShowModal(false);
      resetForm();
      await fetchContent();
      
    } catch (error) {
      console.error('❌ Failed to save blog post:', error);
      toast.error(error.response?.data?.message || 'Failed to save blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBlog = (post) => {
    setEditingItem(post);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || 'spiritual_teaching',
      featuredImage: post.featuredImage || '',
      tags: post.tags ? post.tags.join(', ') : '',
      status: post.status || 'draft',
      isFeatured: post.isFeatured || false,
      // Reset event fields
      description: '',
      date: '',
      endDate: '',
      time: '',
      location: { name: '', address: '' },
      eventType: 'other',
      isPublic: true,
      isVirtual: false,
      meetingLink: '',
      capacity: '',
      organizer: '',
      contactEmail: '',
      contactPhone: '',
    });
    setShowModal(true);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await blog.delete(id);
      toast.success('Blog post deleted successfully');
      await fetchContent();
    } catch (error) {
      console.error('❌ Failed to delete blog post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  // ─── EVENT CRUD ─────────────────────────────────────────────────────────────

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!formData.title || !formData.description || !formData.date) {
        toast.error('Title, Description, and Date are required');
        setSubmitting(false);
        return;
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        endDate: formData.endDate || undefined,
        time: formData.time || '',
        location: {
          name: formData.location.name || '',
          address: formData.location.address || '',
        },
        eventType: formData.eventType || 'other',
        status: formData.status || 'upcoming',
        isPublic: formData.isPublic !== undefined ? formData.isPublic : true,
        isVirtual: formData.isVirtual || false,
        meetingLink: formData.meetingLink || '',
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        organizer: formData.organizer || '',
        contactEmail: formData.contactEmail || '',
        contactPhone: formData.contactPhone || '',
        featuredImage: formData.featuredImage || '',
      };

      console.log('📅 Creating/Updating event:', eventData);
      
      let response;
      if (editingItem) {
        response = await events.update(editingItem._id, eventData);
        toast.success('Event updated successfully!');
      } else {
        response = await events.create(eventData);
        toast.success('Event created successfully!');
      }
      
      console.log('✅ Event saved:', response);
      
      setShowModal(false);
      resetForm();
      await fetchContent();
      
    } catch (error) {
      console.error('❌ Failed to save event:', error);
      toast.error(error.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = (event) => {
    setEditingItem(event);
    setFormData({
      title: event.title || '',
      content: '',
      excerpt: '',
      category: 'spiritual_teaching',
      featuredImage: event.featuredImage || '',
      tags: '',
      status: event.status || 'upcoming',
      isFeatured: false,
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
      time: event.time || '',
      location: {
        name: event.location?.name || '',
        address: event.location?.address || '',
      },
      eventType: event.eventType || 'other',
      isPublic: event.isPublic !== undefined ? event.isPublic : true,
      isVirtual: event.isVirtual || false,
      meetingLink: event.meetingLink || '',
      capacity: event.capacity || '',
      organizer: event.organizer || '',
      contactEmail: event.contactEmail || '',
      contactPhone: event.contactPhone || '',
    });
    setShowModal(true);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await events.delete(id);
      toast.success('Event deleted successfully');
      await fetchContent();
    } catch (error) {
      console.error('❌ Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'spiritual_teaching',
      featuredImage: '',
      tags: '',
      status: 'draft',
      isFeatured: false,
      description: '',
      date: '',
      endDate: '',
      time: '',
      location: {
        name: '',
        address: '',
      },
      eventType: 'other',
      isPublic: true,
      isVirtual: false,
      meetingLink: '',
      capacity: '',
      organizer: '',
      contactEmail: '',
      contactPhone: '',
    });
  };

  const handleOpenCreateModal = () => {
    resetForm();
    if (tab === 'Blog Posts') {
      setFormData(prev => ({
        ...prev,
        category: 'spiritual_teaching',
        status: 'draft',
        isFeatured: false,
      }));
    } else if (tab === 'Events') {
      setFormData(prev => ({
        ...prev,
        eventType: 'other',
        status: 'upcoming',
        isPublic: true,
        isVirtual: false,
      }));
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    if (tab === 'Blog Posts') {
      handleCreateBlog(e);
    } else if (tab === 'Events') {
      handleCreateEvent(e);
    }
  };

  const tabs = ['Blog Posts', 'Events', 'Sermons'];

  // Helper to get the form title
  const getFormTitle = () => {
    if (tab === 'Blog Posts') {
      return editingItem ? 'Edit Blog Post' : 'Create New Blog Post';
    } else if (tab === 'Events') {
      return editingItem ? 'Edit Event' : 'Create New Event';
    }
    return editingItem ? 'Edit Item' : 'Create New Item';
  };

  // Helper to get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'green';
      case 'upcoming': return 'green';
      case 'ongoing': return 'gold';
      case 'completed': return 'gray';
      case 'cancelled': return 'red';
      case 'draft': return 'gray';
      case 'archived': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading eyebrow="Admin" title="Content Management" />
          <Btn variant="primary" onClick={handleOpenCreateModal}>
            + Create New
          </Btn>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t} onClick={() => {
              setTab(t);
              resetForm();
            }}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{ background: tab === t ? C.blue : '#fff', color: tab === t ? C.gold : C.gray600, border: `1px solid ${tab === t ? C.blue : C.gray100}` }}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Blog Posts' && (
          <Card className="!p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: C.blue, color: C.gold }}>
                  {['Title', 'Category', 'Status', 'Date', 'Views', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {blogPosts.length > 0 ? (
                  blogPosts.map((p, i) => (
                    <tr key={p._id} className="border-b last:border-0 hover:bg-blue-50" style={{ borderColor: C.gray100, background: i % 2 === 0 ? '#fff' : C.gray50 }}>
                      <td className="px-4 py-3 font-medium" style={{ color: C.blue }}>{p.title}</td>
                      <td className="px-4 py-3"><Badge color="blue">{p.category?.replace('_', ' ')}</Badge></td>
                      <td className="px-4 py-3">
                        <Badge color={getStatusColor(p.status)}>{p.status}</Badge>
                      </td>
                      <td className="px-4 py-3" style={{ color: C.gray600 }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3" style={{ color: C.gray600 }}>{p.views || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Btn variant="ghost" small onClick={() => handleEditBlog(p)}>✏️ Edit</Btn>
                          <Btn variant="ghost" small onClick={() => handleDeleteBlog(p._id)}>🗑 Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center" style={{ color: C.gray400 }}>
                      No blog posts found. Click "Create New" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        {tab === 'Events' && (
          <Card className="!p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: C.blue, color: C.gold }}>
                  {['Title', 'Type', 'Date', 'Location', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {eventsList.length > 0 ? (
                  eventsList.map((e, i) => (
                    <tr key={e._id} className="border-b last:border-0 hover:bg-blue-50" style={{ borderColor: C.gray100, background: i % 2 === 0 ? '#fff' : C.gray50 }}>
                      <td className="px-4 py-3 font-medium" style={{ color: C.blue }}>{e.title}</td>
                      <td className="px-4 py-3"><Badge color="blue">{e.eventType?.replace('_', ' ')}</Badge></td>
                      <td className="px-4 py-3" style={{ color: C.gray600 }}>{new Date(e.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3" style={{ color: C.gray600 }}>{e.location?.name || 'TBD'}</td>
                      <td className="px-4 py-3">
                        <Badge color={getStatusColor(e.status)}>{e.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Btn variant="ghost" small onClick={() => handleEditEvent(e)}>✏️ Edit</Btn>
                          <Btn variant="ghost" small onClick={() => handleDeleteEvent(e._id)}>🗑 Delete</Btn>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center" style={{ color: C.gray400 }}>
                      No events found. Click "Create New" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        {tab === 'Sermons' && (
          <Card className="!p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: C.blue, color: C.gold }}>
                  {['Title', 'Type', 'Preacher', 'Date', 'Views', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sermonsList.length > 0 ? (
                  sermonsList.map((s, i) => (
                    <tr key={s._id} className="border-b last:border-0 hover:bg-blue-50" style={{ borderColor: C.gray100, background: i % 2 === 0 ? '#fff' : C.gray50 }}>
                      <td className="px-4 py-3 font-medium" style={{ color: C.blue }}>{s.title}</td>
                      <td className="px-4 py-3"><Badge color="blue">{s.sermonType}</Badge></td>
                      <td className="px-4 py-3" style={{ color: C.gray600 }}>{s.preacher}</td>
                      <td className="px-4 py-3" style={{ color: C.gray600 }}>{s.dateDelivered ? new Date(s.dateDelivered).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-3" style={{ color: C.gray600 }}>{s.views || 0}</td>
                      <td className="px-4 py-3"><div className="flex gap-1"><Btn variant="ghost" small>✏️ Edit</Btn><Btn variant="ghost" small>🗑 Delete</Btn></div></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="px-4 py-8 text-center" style={{ color: C.gray400 }}>No sermons found</td></tr>
                )}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,26,46,0.75)', backdropFilter: 'blur(4px)' }}>
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: C.blue }}>
                {getFormTitle()}
              </h3>
              <button 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }} 
                style={{ color: C.gray400 }}
                className="hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'Blog Posts' ? (
                // ─── BLOG POST FORM ────────────────────────────────────────
                <>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                      style={{ borderColor: C.gray100, color: C.gray800 }}
                      placeholder="Enter blog post title"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Content *</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                      style={{ borderColor: C.gray100, color: C.gray800 }}
                      placeholder="Write your blog post content here..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Excerpt</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                      style={{ borderColor: C.gray100, color: C.gray800 }}
                      placeholder="Brief summary of your blog post..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                      >
                        <option value="spiritual_teaching">Spiritual Teaching</option>
                        <option value="association_news">Association News</option>
                        <option value="event_recap">Event Recap</option>
                        <option value="announcement">Announcement</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Image Upload */}
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={formData.featuredImage}
                    label="Featured Image"
                    folder="blog"
                  />

                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                      style={{ borderColor: C.gray100, color: C.gray800 }}
                      placeholder="faith, community, prayer"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <label className="text-sm" style={{ color: C.gray600 }}>
                      Feature this post (will appear on homepage)
                    </label>
                  </div>
                </>
              ) : tab === 'Events' ? (
                // ─── EVENT FORM ─────────────────────────────────────────────
                <>
                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                      style={{ borderColor: C.gray100, color: C.gray800 }}
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                      style={{ borderColor: C.gray100, color: C.gray800 }}
                      placeholder="Describe the event..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Time</label>
                    <input
                      type="text"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                      style={{ borderColor: C.gray100, color: C.gray800 }}
                      placeholder="e.g., 6:00 AM - 9:00 AM"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Location Name</label>
                      <input
                        type="text"
                        name="location.name"
                        value={formData.location.name}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                        placeholder="e.g., Main Church Hall"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Location Address</label>
                      <input
                        type="text"
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                        placeholder="Full address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Event Type</label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                      >
                        <option value="liturgy">Liturgy</option>
                        <option value="fasting">Fasting</option>
                        <option value="feast">Feast</option>
                        <option value="seminar">Seminar</option>
                        <option value="conference">Conference</option>
                        <option value="community_service">Community Service</option>
                        <option value="fundraising">Fundraising</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Featured Image Upload for Events */}
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={formData.featuredImage}
                    label="Event Image"
                    folder="events"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Organizer</label>
                      <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                        placeholder="Organizer name"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                        placeholder="Max attendees"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Contact Email</label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                        placeholder="contact@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Contact Phone</label>
                      <input
                        type="text"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                        placeholder="+251 9XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isVirtual"
                      checked={formData.isVirtual}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <label className="text-sm" style={{ color: C.gray600 }}>
                      Virtual Event
                    </label>
                  </div>

                  {formData.isVirtual && (
                    <div>
                      <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Meeting Link</label>
                      <input
                        type="text"
                        name="meetingLink"
                        value={formData.meetingLink}
                        onChange={handleInputChange}
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                        style={{ borderColor: C.gray100, color: C.gray800 }}
                        placeholder="https://zoom.us/meeting-link"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <label className="text-sm" style={{ color: C.gray600 }}>
                      Make this event public
                    </label>
                  </div>
                </>
              ) : (
                // ─── SERMONS FORM (placeholder) ─────────────────────────────
                <div className="text-center py-8" style={{ color: C.gray400 }}>
                  Sermon management coming soon...
                </div>
              )}

              <div className="flex gap-3 pt-3 border-t" style={{ borderColor: C.gray100 }}>
                <Btn 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  type="button"
                >
                  Cancel
                </Btn>
                <Btn 
                  variant="primary" 
                  type="submit" 
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                </Btn>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}


// ─── SERVICE MANAGEMENT ──────────────────────────────────────────────────────

export function ServiceManagement() {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    schedule: '',
    icon: '⛪',
    type: 'Other',
    isActive: true,
    order: 0,
    images: [],  // ← Add this
  impact: {    // ← Add this
    peopleServed: 0,
    churchesSupported: 0,
    eventsHeld: 0,
  },
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('⛪ Fetching services for management...');
      const response = await services.getAll();
      console.log('⛪ Services response:', response);
      const servicesData = response.data?.data || response.data || [];
      setServicesList(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      console.error('❌ Failed to load services:', error);
      toast.error(error.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await services.update(editingService._id, formData);
        toast.success('Service updated successfully');
      } else {
        await services.create(formData);
        toast.success('Service created successfully');
      }
      setShowModal(false);
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        schedule: '',
        icon: '⛪',
        type: 'Other',
        isActive: true,
        order: 0,
        images: [],  // ← Add this
  impact: {    // ← Add this
    peopleServed: 0,
    churchesSupported: 0,
    eventsHeld: 0,
  },
      });
      fetchServices();
    } catch (error) {
      console.error('❌ Failed to save service:', error);
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await services.delete(id);
      toast.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('❌ Failed to delete service:', error);
      toast.error('Failed to delete service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      schedule: service.schedule || '',
      icon: service.icon || '⛪',
      type: service.type || 'Other',
      isActive: service.isActive !== undefined ? service.isActive : true,
      order: service.order || 0,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const typeOptions = ['Liturgy', 'Fasting', 'Feast Days', 'Education', 'Outreach', 'Other'];
  const iconOptions = ['⛪', '🕯️', '🎊', '📖', '🤲', '❤️', '🕊️', '🙏', '✨'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading eyebrow="Admin" title="Service Management" />
          <Btn variant="primary" onClick={() => {
            setEditingService(null);
            setFormData({
              title: '',
              description: '',
              schedule: '',
              icon: '⛪',
              type: 'Other',
              isActive: true,
              order: 0,
              images: [],  // ← Add this
  impact: {    // ← Add this
    peopleServed: 0,
    churchesSupported: 0,
    eventsHeld: 0,
  },
            });
            setShowModal(true);
          }}>
            + Add Service
          </Btn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.length > 0 ? (
            servicesList.map((s) => (
              <Card key={s._id} hover className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{s.icon || '⛪'}</span>
                    <div>
                      <h3 className="font-bold" style={{ color: C.blue }}>{s.title}</h3>
                      <Badge color={s.isActive ? 'green' : 'gray'}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Btn variant="ghost" small onClick={() => handleEdit(s)}>✏️</Btn>
                    <Btn variant="ghost" small onClick={() => handleDelete(s._id)}>🗑️</Btn>
                  </div>
                </div>
                <p className="text-sm mt-2" style={{ color: C.gray600 }}>{s.description}</p>
                {s.schedule && (
                  <p className="text-xs mt-2 font-medium" style={{ color: C.gold }}>
                    🕐 {s.schedule}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: C.gray400 }}>
                  <span>Type: {s.type || 'Other'}</span>
                  <span>·</span>
                  <span>Order: {s.order || 0}</span>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-4xl mb-4">⛪</p>
              <p className="text-gray-400">No services created yet. Click "Add Service" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,26,46,0.75)', backdropFilter: 'blur(4px)' }}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: C.blue }}>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ color: C.gray400 }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                  placeholder="Enter service title"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                  placeholder="Enter service description"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Schedule</label>
                <input
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{ borderColor: C.gray100, color: C.gray800 }}
                  placeholder="e.g., Every Sunday, 6:00 AM - 9:00 AM"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Icon</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                    style={{ borderColor: C.gray100, color: C.gray800 }}
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                    style={{ borderColor: C.gray100, color: C.gray800 }}
                  >
                    {typeOptions.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: C.gray600 }}>Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none border"
                    style={{ borderColor: C.gray100, color: C.gray800 }}
                    min="0"
                  />
                </div>

                <div className="flex items-center mt-5">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label className="text-sm" style={{ color: C.gray600 }}>Active</label>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t" style={{ borderColor: C.gray100 }}>
                <Btn variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Btn>
                <Btn variant="primary" type="submit" className="flex-1">
                  {editingService ? 'Update Service' : 'Create Service'}
                </Btn>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────

export function Reports() {
  const [period, setPeriod] = useState('Monthly');
  const [generated, setGenerated] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      console.log('📊 Generating report...');
      const statsRes = await donations.getStats();
      const membersRes = await members.getStats();
      setReportData({
        donations: statsRes.data?.data || statsRes.data || {},
        members: membersRes.data?.data || membersRes.data || {},
      });
      setGenerated(true);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('❌ Failed to generate report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <SectionHeading eyebrow="Admin" title="Financial & Activity Reports" />

        <Card className="mb-8">
          <h3 className="font-bold mb-4" style={{ color: C.blue }}>Report Filters</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: C.gray600 }}>Period</p>
              <div className="flex gap-2">
                {['Monthly', 'Yearly', 'Custom'].map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ background: period === p ? C.blue : C.gray50, color: period === p ? C.gold : C.gray600, border: `1px solid ${period === p ? C.blue : C.gray100}` }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Btn variant="primary" onClick={generateReport} disabled={loading}>
              {loading ? 'Generating...' : '📊 Generate Report'}
            </Btn>
          </div>
        </Card>

        {generated && reportData && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon="💰" value={`ETB ${(reportData.donations?.totalAmount || 0).toLocaleString()}`} label="Total Donations" color={C.gold} />
              <StatCard icon="👥" value={reportData.members?.total || 0} label="Total Members" color={C.blue} />
              <StatCard icon="📊" value={reportData.donations?.totalCount || 0} label="Total Donations Count" color={C.success} />
              <StatCard icon="⏳" value={reportData.donations?.pending || 0} label="Pending Verification" color={C.warning} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <h3 className="font-bold mb-5" style={{ color: C.blue }}>Donations by Type</h3>
                {reportData.donations?.byType && reportData.donations.byType.length > 0 ? (
                  reportData.donations.byType.map((item, i) => {
                    const total = reportData.donations.totalAmount || 1;
                    const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
                    return (
                      <div key={i} className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ color: C.gray600 }} className="capitalize">{item._id}</span>
                          <span className="font-semibold" style={{ color: C.blue }}>ETB {item.total.toLocaleString()} ({pct}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full" style={{ background: C.gray100 }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: C.gold }} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-center py-4" style={{ color: C.gray400 }}>No donation data available</p>
                )}
              </Card>

              <Card>
                <h3 className="font-bold mb-5" style={{ color: C.blue }}>Member Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm border-b pb-2" style={{ borderColor: C.gray100 }}>
                    <span style={{ color: C.gray600 }}>Total Members</span>
                    <span className="font-semibold" style={{ color: C.blue }}>{reportData.members?.total || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2" style={{ borderColor: C.gray100 }}>
                    <span style={{ color: C.gray600 }}>Active Members</span>
                    <span className="font-semibold" style={{ color: C.success }}>{reportData.members?.active || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2" style={{ borderColor: C.gray100 }}>
                    <span style={{ color: C.gray600 }}>Inactive Members</span>
                    <span className="font-semibold" style={{ color: C.warning }}>{reportData.members?.inactive || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b pb-2" style={{ borderColor: C.gray100 }}>
                    <span style={{ color: C.gray600 }}>Suspended Members</span>
                    <span className="font-semibold" style={{ color: C.error }}>{reportData.members?.suspended || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: C.gray600 }}>New This Month</span>
                    <span className="font-semibold" style={{ color: C.blue }}>{reportData.members?.newThisMonth || 0}</span>
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="font-bold mb-4" style={{ color: C.blue }}>Export Report</h3>
              <div className="flex gap-3 flex-wrap">
                <Btn variant="primary">📄 Export PDF</Btn>
                <Btn variant="secondary">📊 Export Excel</Btn>
                <Btn variant="outline">📋 Export CSV</Btn>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

