'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Nav } from '@/components/ui/Nav';
import { useTranslation } from '@/lib/translations';

export default function ProfilePage() {
  const router = useRouter();
  const { lang, user, setUser } = useStore();
  const t = useTranslation(lang);

  const [profile,  setProfile]  = useState(null);
  const [farms,    setFarms]     = useState([]);
  const [loading,  setLoading]   = useState(true);
  const [editing,  setEditing]   = useState(false);
  const [saving,   setSaving]    = useState(false);
  const [form,     setForm]      = useState({});

  useEffect(() => {
    if (!supabase) { router.replace('/login'); return; }
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.replace('/login'); return; }
      setUser(data.session.user);

      const [{ data: p }, { data: f }] = await Promise.all([
        supabase.from('farmer_profiles').select('*').eq('id', data.session.user.id).single(),
        supabase.from('farms').select('*').eq('user_id', data.session.user.id).order('created_at', { ascending: false }),
      ]);

      setProfile(p || {});
      setFarms(f || []);
      setForm(p || {});
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('farmer_profiles').upsert({
      ...form,
      id: user.id,
      updated_at: new Date().toISOString(),
    });
    if (!error) { setProfile(form); setEditing(false); }
    setSaving(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const TX = {
    title:    { en:'My Profile', hi:'मेरी प्रोफाइल', ta:'என் சுயவிவரம்', te:'నా ప్రొఫైల్' },
    name:     { en:'Full Name', hi:'पूरा नाम', ta:'முழு பெயர்', te:'పూర్తి పేరు' },
    phone:    { en:'Mobile', hi:'मोबाइल', ta:'மொபைல்', te:'మొబైల్' },
    village:  { en:'Village', hi:'गाँव', ta:'கிராமம்', te:'గ్రామం' },
    district: { en:'District', hi:'जिला', ta:'மாவட்டம்', te:'జిల్లా' },
    state:    { en:'State', hi:'राज्य', ta:'மாநிலம்', te:'రాష్ట్రం' },
    edit:     { en:'Edit Profile', hi:'प्रोफाइल संपादित करें', ta:'சுயவிவரத்தை திருத்து', te:'ప్రొఫైల్ సవరించు' },
    save:     { en:'Save Changes', hi:'परिवर्तन सहेजें', ta:'மாற்றங்களை சேமி', te:'మార్పులు సేవ్ చేయి' },
    cancel:   { en:'Cancel', hi:'रद्द करें', ta:'రద్దు', te:'రద్దు చేయి' },
    signout:  { en:'Sign Out', hi:'साइन आउट', ta:'வெளியேறு', te:'సైన్ అవుట్' },
    myFarms:  { en:'My Farm Analyses', hi:'मेरे खेत विश्लेषण', ta:'என் வயல் பகுப்பாய்வுகள்', te:'నా పొలం విశ్లేషణలు' },
    noFarms:  { en:'No analyses yet. Start by entering your farm details.', hi:'अभी कोई विश्लेषण नहीं। खेत की जानकारी डालें।', ta:'இன்னும் பகுப்பாய்வு இல்லை.', te:'ఇంకా విశ్లేషణలు లేవు.' },
    newAnalysis: { en:'+ New Analysis', hi:'+ नया विश्लेषण', ta:'+ புதிய பகுப்பாய்வு', te:'+ కొత్త విశ్లేషణ' },
  };
  const tl = (key) => TX[key]?.[lang] || TX[key]?.en || key;

  if (loading) return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#f0ece2] pt-16 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-sage/20 border-t-sage rounded-full animate-spin" />
      </div>
    </>
  );

  const initials = profile?.full_name?.slice(0,2).toUpperCase() || '👨‍🌾';

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#f0ece2] pt-16">

        {/* Hero */}
        <div className="relative px-6 py-10" style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}>
          <div className="max-w-2xl mx-auto flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-2xl font-bold text-forest flex-shrink-0 shadow-lg">
              {initials}
            </div>
            <div>
              <h1 className="font-serif text-2xl text-white">{profile?.full_name || 'Farmer'}</h1>
              <p className="text-white/60 text-sm mt-0.5">+91 {profile?.phone?.replace('+91','')}</p>
              {profile?.village && <p className="text-white/50 text-xs mt-1">📍 {[profile.village, profile.district, profile.state].filter(Boolean).join(', ')}</p>}
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-6 space-y-5">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-[rgba(26,51,40,0.10)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(26,51,40,0.07)]">
              <h2 className="font-serif text-lg text-forest">{tl('title')}</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="text-xs font-semibold text-sage hover:text-forest bg-sage/10 px-3 py-1.5 rounded-lg border-none cursor-pointer transition-all">
                  ✏️ {tl('edit')}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="text-xs font-semibold text-forest-light px-3 py-1.5 rounded-lg bg-parchment border-none cursor-pointer">{tl('cancel')}</button>
                  <button onClick={save} disabled={saving}
                    className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg border-none cursor-pointer disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}>
                    {saving ? '⏳' : tl('save')}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: 'full_name', label: tl('name'), icon: '👤' },
                { key: 'village',   label: tl('village'), icon: '🏡' },
                { key: 'district',  label: tl('district'), icon: '🗺️' },
                { key: 'state',     label: tl('state'), icon: '📍' },
              ].map(({ key, label, icon }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div className="flex-1">
                    <div className="text-[10px] text-forest-light uppercase tracking-wider mb-0.5">{label}</div>
                    {editing ? (
                      <input
                        className="w-full px-3 py-2 border border-[rgba(26,51,40,0.15)] rounded-lg text-sm text-forest bg-cream outline-none focus:border-sage transition-colors"
                        value={form[key] || ''}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      />
                    ) : (
                      <div className="text-sm text-forest font-medium">{profile?.[key] || '—'}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farm History */}
          <div className="bg-white rounded-2xl border border-[rgba(26,51,40,0.10)] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(26,51,40,0.07)]">
              <h2 className="font-serif text-lg text-forest">{tl('myFarms')}</h2>
              <button onClick={() => router.push('/form')}
                className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg border-none cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #d4852a, #e8a84e)' }}>
                {tl('newAnalysis')}
              </button>
            </div>
            <div className="p-6">
              {farms.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🌾</div>
                  <p className="text-sm text-forest-light">{tl('noFarms')}</p>
                  <button onClick={() => router.push('/form')}
                    className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-semibold border-none cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}>
                    Start Analysis →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {farms.map(farm => (
                    <div key={farm.id} className="flex items-center justify-between p-4 rounded-xl bg-parchment border border-[rgba(26,51,40,0.08)]">
                      <div>
                        <div className="font-semibold text-sm text-forest">{farm.location}</div>
                        <div className="text-xs text-forest-light mt-0.5">
                          {farm.land_size} acres · {farm.soil_type} · {new Date(farm.created_at).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <button onClick={() => router.push('/dashboard')}
                        className="text-xs font-semibold text-sage hover:text-forest bg-transparent border-none cursor-pointer">
                        View →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sign Out */}
          <button onClick={signOut}
            className="w-full py-3 rounded-xl text-red-600 font-semibold text-sm border border-red-200 bg-red-50 hover:bg-red-100 transition-all cursor-pointer">
            🚪 {tl('signout')}
          </button>
        </div>
      </div>
    </>
  );
}
