import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { members, donations, events } from '../services/api';
import toast from 'react-hot-toast';
import { C, Btn, Badge, Card, SectionHeading, Input, Textarea, Select, StatCard, OrthodoxCross } from './Layout';

// ─── MEMBER DASHBOARD ─────────────────────────────────────────────────────────

export function MemberDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalDonations: 0, prayerCount: 0, eventsRegistered: 0, unreadNotifications: 0 });
  const [recentDonations, setRecentDonations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [memberProfile, setMemberProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch member profile
        const profileRes = await members.getProfile();
        setMemberProfile(profileRes.data);

        // Fetch donations
        const donationRes = await donations.getMyDonations({ limit: 5 });
        setRecentDonations(donationRes.data || []);

        // Fetch upcoming events
        const eventRes = await events.getUpcoming();
        setUpcomingEvents(eventRes.data || []);

        // Calculate stats
        const allDonations = donationRes.data || [];
        const totalAmount = allDonations.reduce((sum, d) => sum + d.amount, 0);
        setStats({
          totalDonations: totalAmount,
          prayerCount: 0, // Prayer feature removed
          eventsRegistered: upcomingEvents.length,
          unreadNotifications: 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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

  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Welcome header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4" style={{ borderColor: C.gold }}>
            <div className="w-full h-full flex items-center justify-center text-3xl bg-blue-100" style={{ color: C.blue }}>
              {user?.fullName?.charAt(0) || 'M'}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: C.blue }}>Welcome back, {user?.fullName?.split(' ')[0] || 'Member'}! 🙏</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge color="gold">{memberProfile?.membershipId || 'Member'}</Badge>
              <p className="text-sm" style={{ color: C.gray600 }}>Joined {memberProfile?.joinedDate ? new Date(memberProfile.joinedDate).toLocaleDateString() : 'Recently'}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="💰" value={`ETB ${stats.totalDonations.toLocaleString()}`} label="Total Donated" color={C.gold} />
          <StatCard icon="🙏" value="0" label="Prayer Requests" color={C.blue} />
          <StatCard icon="📅" value={upcomingEvents.length} label="Events Registered" color={C.success} />
          <StatCard icon="🔔" value={stats.unreadNotifications} label="Notifications" color={C.warning} />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: '💳', label: 'Submit Donation', path: '/submit-donation' },
            { icon: '📅', label: 'View Events', path: '/events' },
            { icon: '📊', label: 'My Donations', path: '/my-donations' },
          ].map(q => (
            <a key={q.label} href={q.path}
              className="flex flex-col items-center gap-2 py-5 rounded-xl font-semibold text-sm transition-all hover:shadow-md"
              style={{ background: '#fff', border: `1px solid ${C.gray100}`, color: C.blue }}>
              <span className="text-2xl">{q.icon}</span>{q.label}
            </a>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent donations */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ color: C.blue }}>Recent Donations</h3>
              <a href="/my-donations" className="text-xs font-medium" style={{ color: C.gold }}>View All →</a>
            </div>
            {recentDonations.length > 0 ? (
              recentDonations.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: C.gray100 }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: C.blue }}>{d.donationType}</p>
                    <p className="text-xs" style={{ color: C.gray400 }}>{new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold" style={{ color: C.gold }}>ETB {d.amount}</p>
                    <Badge color={d.status === 'verified' ? 'green' : d.status === 'rejected' ? 'red' : 'yellow'}>{d.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-4" style={{ color: C.gray400 }}>No donations yet</p>
            )}
          </Card>

          {/* Upcoming events */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ color: C.blue }}>Upcoming Events</h3>
              <a href="/events" className="text-xs font-medium" style={{ color: C.gold }}>View All →</a>
            </div>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.slice(0, 3).map((e, i) => (
                <div key={i} className="flex gap-3 py-2.5 border-b last:border-0 items-center" style={{ borderColor: C.gray100 }}>
                  <div className="rounded-lg text-center py-1 px-2 shrink-0" style={{ background: C.blue, minWidth: '44px' }}>
                    <p className="text-xs font-bold" style={{ color: C.gold }}>{new Date(e.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: C.blue }}>{e.title}</p>
                    <p className="text-xs" style={{ color: C.gray400 }}>{e.eventType}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center py-4" style={{ color: C.gray400 }}>No upcoming events</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── MEMBER PROFILE ───────────────────────────────────────────────────────────

export function MemberProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    region: '',
    subCity: '',
    spiritualRole: '',
    baptismalName: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await members.getProfile();
        setProfile(response.data);
        setFormData({
          region: response.data.region || '',
          subCity: response.data.subCity || '',
          spiritualRole: response.data.spiritualRole || 'regular_member',
          baptismalName: response.data.baptismalName || '',
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await members.updateProfile(formData);
      setSaved(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error('Failed to update profile');
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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <SectionHeading eyebrow="Account" title="My Profile" />

        <form onSubmit={handleSubmit}>
          {/* Photo */}
          <Card className="mb-6 flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 flex items-center justify-center text-4xl bg-blue-100" style={{ borderColor: C.gold, color: C.blue }}>
                {user?.fullName?.charAt(0) || 'M'}
              </div>
            </div>
            <div>
              <p className="font-bold" style={{ color: C.blue }}>{user?.fullName}</p>
              <p className="text-sm" style={{ color: C.gray600 }}>{profile?.membershipId || 'Member'} · Joined {profile?.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : 'Recently'}</p>
              <Badge color="green">{profile?.membershipStatus || 'Active'}</Badge>
            </div>
          </Card>

          {/* Personal info */}
          <Card className="mb-6">
            <h3 className="font-bold mb-5" style={{ color: C.blue }}>Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" value={user?.fullName || ''} disabled />
              <Input label="Phone Number" value={user?.phoneNumber || ''} disabled />
              <Input label="Email" value={user?.email || ''} disabled />
              <Select label="Region" name="region" value={formData.region} onChange={handleChange}>
                <option value="">Select Region</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Oromia">Oromia</option>
                <option value="Amhara">Amhara</option>
                <option value="Tigray">Tigray</option>
                <option value="SNNPR">SNNPR</option>
                <option value="Other">Other</option>
              </Select>
              <Input label="Sub-City / Woreda" name="subCity" value={formData.subCity} onChange={handleChange} placeholder="e.g. Bole, Woreda 03" />
              <Select label="Spiritual Role" name="spiritualRole" value={formData.spiritualRole} onChange={handleChange}>
                <option value="regular_member">Regular Member</option>
                <option value="priest">Priest</option>
                <option value="deacon">Deacon</option>
                <option value="choir">Choir Member</option>
                <option value="youth_leader">Youth Leader</option>
                <option value="elder">Elder</option>
              </Select>
            </div>
          </Card>

          {/* Additional info */}
          <Card className="mb-6">
            <h3 className="font-bold mb-5" style={{ color: C.blue }}>Orthodox Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Baptismal Name" name="baptismalName" value={formData.baptismalName} onChange={handleChange} placeholder="Your Christian name" />
              <Input label="Date of Baptism" type="date" value={profile?.dateOfBaptism?.split('T')[0] || ''} disabled />
            </div>
          </Card>

          <div className="flex gap-3">
            <Btn type="submit" variant="primary" className="flex-1">
              {saved ? '✓ Saved!' : 'Save Changes'}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MY DONATIONS ─────────────────────────────────────────────────────────────

export function MyDonations() {
  const [tab, setTab] = useState('All');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, rejected: 0 });

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await donations.getMyDonations();
        const data = response.data || [];
        setDonations(data);
        setStats({
          total: data.reduce((sum, d) => sum + (d.status === 'verified' ? d.amount : 0), 0),
          pending: data.filter(d => d.status === 'pending').length,
          verified: data.filter(d => d.status === 'verified').length,
          rejected: data.filter(d => d.status === 'rejected').length,
        });
      } catch (error) {
        toast.error('Failed to load donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const tabs = ['All', 'Pending', 'Verified', 'Rejected'];
  const filtered = tab === 'All' ? donations : donations.filter(d => d.status === tab.toLowerCase());
  const totalDonated = donations.filter(d => d.status === 'verified').reduce((s, d) => s + d.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.gray50 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <SectionHeading eyebrow="Member Area" title="My Donations" />
          <a href="/submit-donation">
            <Btn variant="primary">+ Submit Donation</Btn>
          </a>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="💰" value={`ETB ${totalDonated.toLocaleString()}`} label="Total Donated" color={C.gold} />
          <StatCard icon="⏳" value={stats.pending} label="Pending" color={C.warning} />
          <StatCard icon="✅" value={stats.verified} label="Verified" color={C.success} />
          <StatCard icon="❌" value={stats.rejected} label="Rejected" color={C.error} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{ background: tab === t ? C.blue : '#fff', color: tab === t ? C.gold : C.gray600, border: `1px solid ${tab === t ? C.blue : C.gray100}` }}>
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.blue, color: C.gold }}>
                {['Date', 'Type', 'Amount (ETB)', 'Bank', 'Reference', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((d, i) => (
                  <tr key={d._id} className="border-b last:border-0 transition-colors hover:bg-blue-50" style={{ borderColor: C.gray100, background: i % 2 === 0 ? '#fff' : C.gray50 }}>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: C.blue }}>{d.donationType}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: C.gold }}>{d.amount.toLocaleString()}</td>
                    <td className="px-4 py-3" style={{ color: C.gray600 }}>{d.bankName}</td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: C.gray400 }}>{d.referenceNumber}</td>
                    <td className="px-4 py-3">
                      <Badge color={d.status === 'verified' ? 'green' : d.status === 'rejected' ? 'red' : 'yellow'}>
                        {d.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: C.gray400 }}>
                    No {tab.toLowerCase()} donations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ─── SUBMIT DONATION ──────────────────────────────────────────────────────────

export function SubmitDonation() {
  const { user } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    donationType: 'general',
    amount: '',
    bankName: '',
    referenceNumber: '',
    receiptPhotoUrl: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // For now, we'll use a placeholder URL since Cloudinary is not fully set up
      setFormData({ ...formData, receiptPhotoUrl: 'https://via.placeholder.com/300x200?text=Receipt+Uploaded' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || !formData.amount || !formData.referenceNumber) {
      toast.error('Please fill all required fields and agree to the terms');
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, you'd upload the file to Cloudinary first
      // For now, we'll use the placeholder URL
      const donationData = {
        donationType: formData.donationType,
        amount: parseFloat(formData.amount),
        bankName: formData.bankName,
        referenceNumber: formData.referenceNumber,
        receiptPhotoUrl: formData.receiptPhotoUrl,
      };

      await donations.submit(donationData);
      setSubmitted(true);
      toast.success('Donation submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit donation');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: C.gray50 }}>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Card className="text-center py-12">
            <OrthodoxCross size={48} color={C.gold} />
            <h3 className="text-xl font-bold mt-4 mb-2" style={{ color: C.blue }}>Donation Submitted!</h3>
            <p className="text-sm mb-6" style={{ color: C.gray600 }}>Your donation receipt has been submitted for verification. Our team will review it within 1–3 business days.</p>
            <div className="flex gap-3 justify-center">
              <a href="/my-donations">
                <Btn variant="outline">View My Donations</Btn>
              </a>
              <a href="/dashboard">
                <Btn variant="primary">Back to Dashboard</Btn>
              </a>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: C.gray50 }}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <SectionHeading eyebrow="Member Area" title="Submit a Donation" />

        <form onSubmit={handleSubmit}>
          {/* Bank details */}
          <Card className="mb-6" style={{ border: `2px solid ${C.gold}` }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: C.gold }}>Bank Account Details</p>
            {[
              ['Bank', 'Commercial Bank of Ethiopia'],
              ['Account Name', 'Mehbere Edomias Spiritual Association'],
              ['Account Number', '1000-XXXX-XXXX-XX'],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5 border-b last:border-0 text-sm" style={{ borderColor: C.gray100 }}>
                <span style={{ color: C.gray600 }}>{l}</span>
                <span className="font-semibold" style={{ color: C.blue }}>{v}</span>
              </div>
            ))}
            <Btn variant="gold" small className="mt-3" type="button">📋 Copy Details</Btn>
          </Card>

          {/* Form */}
          <Card className="mb-6">
            <h3 className="font-bold mb-5" style={{ color: C.blue }}>Donation Details</h3>
            <div className="flex flex-col gap-4">
              <Select label="Donation Type" name="donationType" value={formData.donationType} onChange={handleChange} required>
                <option value="general">General Fund</option>
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="building_fund">Building Fund</option>
                <option value="social_service">Social Service</option>
                <option value="other">Other</option>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Amount (ETB)" name="amount" type="number" required placeholder="500" value={formData.amount} onChange={handleChange} />
                <Input label="Bank Name" name="bankName" required placeholder="e.g. CBE, Awash" value={formData.bankName} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Transaction Reference" name="referenceNumber" required placeholder="TXN-..." value={formData.referenceNumber} onChange={handleChange} />
                <Input label="Donation Date" type="date" value={new Date().toISOString().split('T')[0]} disabled />
              </div>

              {/* Upload */}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: C.gray600 }}>Upload Receipt <span className="text-red-500">*</span></label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragOver(false);
                    const droppedFile = e.dataTransfer.files[0];
                    if (droppedFile) {
                      setFile(droppedFile);
                      setFormData({ ...formData, receiptPhotoUrl: 'https://via.placeholder.com/300x200?text=Receipt+Uploaded' });
                    }
                  }}
                  onClick={() => document.getElementById('fileInput').click()}
                  className="border-2 border-dashed rounded-xl py-10 text-center cursor-pointer transition-all"
                  style={{ borderColor: dragOver ? C.gold : file ? C.success : C.gray100, background: dragOver ? `${C.goldLight}30` : file ? '#f0fff4' : C.gray50 }}>
                  <input id="fileInput" type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                  {file ? (
                    <>
                      <p className="text-2xl mb-2">✅</p>
                      <p className="text-sm font-medium" style={{ color: C.success }}>{file.name}</p>
                      <p className="text-xs" style={{ color: C.gray400 }}>Click to replace</p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl mb-2">📷</p>
                      <p className="text-sm font-medium" style={{ color: C.blue }}>Drag & drop or click to upload</p>
                      <p className="text-xs" style={{ color: C.gray400 }}>PNG, JPG, PDF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5" />
                <span className="text-sm" style={{ color: C.gray600 }}>
                  I confirm that the information I have provided is accurate and that this receipt corresponds to a genuine donation to Mehbere Edomias.
                </span>
              </label>
            </div>
          </Card>

          <div className="flex gap-3">
            <a href="/my-donations" className="flex-1">
              <Btn variant="outline" className="w-full">Cancel</Btn>
            </a>
            <Btn type="submit" variant="primary" className="flex-1" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Donation'}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}