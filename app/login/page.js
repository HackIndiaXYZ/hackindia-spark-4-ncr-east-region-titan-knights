'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

// ── Translations ──────────────────────────────────────────────────────────────
const TX = {
  title:        { en:'Welcome to AgriSmart', hi:'AgriSmart में स्वागत है', ta:'AgriSmart-க்கு வரவேற்கிறோம்', te:'AgriSmart కి స్వాగతం' },
  subtitle:     { en:'Enter your mobile number to continue', hi:'जारी रखने के लिए मोबाइल नंबर दर्ज करें', ta:'தொடர மொபைல் எண் உள்ளிடவும்', te:'కొనసాగడానికి మొబైల్ నంబర్ నమోదు చేయండి' },
  phonePH:      { en:'10-digit mobile number', hi:'10 अंकों का मोबाइल नंबर', ta:'10 இலக்க மொபைல் எண்', te:'10 అంకెల మొబైల్ నంబర్' },
  sendOtp:      { en:'Send OTP', hi:'OTP भेजें', ta:'OTP அனுப்பு', te:'OTP పంపు' },
  sending:      { en:'Sending…', hi:'भेज रहे हैं…', ta:'அனுப்புகிறோம்…', te:'పంపుతున్నాం…' },
  otpTitle:     { en:'Enter the OTP', hi:'OTP दर्ज करें', ta:'OTP உள்ளிடுங்கள்', te:'OTP నమోదు చేయండి' },
  otpSent:      { en:'6-digit code sent to', hi:'6 अंकों का कोड भेजा गया', ta:'6 இலக்க குறியீடு அனுப்பப்பட்டது', te:'6 అంకెల కోడ్ పంపబడింది' },
  verify:       { en:'Verify & Continue', hi:'सत्यापित करें', ta:'சரிபார்க்கவும்', te:'ధృవీకరించండి' },
  verifying:    { en:'Verifying…', hi:'सत्यापन हो रहा है…', ta:'சரிபார்க்கிறது…', te:'ధృవీకరిస్తోంది…' },
  resend:       { en:'Resend OTP', hi:'OTP दोबारा भेजें', ta:'OTP மீண்டும் அனுப்பு', te:'OTP మళ్ళీ పంపు' },
  resendIn:     { en:'Resend in', hi:'दोबारा भेजें', ta:'மீண்டும் அனுப்பு', te:'మళ్ళీ పంపు' },
  changeNum:    { en:'← Change number', hi:'← नंबर बदलें', ta:'← எண்ணை மாற்று', te:'← నంబర్ మార్చు' },
  profileTitle: { en:'Your Profile', hi:'आपकी प्रोफाइल', ta:'உங்கள் சுயவிவரம்', te:'మీ ప్రొఫైల్' },
  profileSub:   { en:"Tell us your name so we can personalise your experience", hi:'अपना नाम बताएं', ta:'உங்கள் பெயர் சொல்லுங்கள்', te:'మీ పేరు చెప్పండి' },
  namePH:       { en:'Full name *', hi:'पूरा नाम *', ta:'முழு பெயர் *', te:'పూర్తి పేరు *' },
  villagePH:    { en:'Village / Town', hi:'गाँव / शहर', ta:'கிராமம் / நகரம்', te:'గ్రామం / పట్టణం' },
  districtPH:   { en:'District', hi:'जिला', ta:'மாவட்டம்', te:'జిల్లా' },
  statePH:      { en:'State', hi:'राज्य', ta:'மாநிலம்', te:'రాష్ట్రం' },
  saveBtn:      { en:'Save & Get Recommendations →', hi:'सहेजें और सिफारिशें पाएं →', ta:'சேமி & பரிந்துரைகள் பெறு →', te:'సేవ్ & సిఫార్సులు పొందు →' },
  saving:       { en:'Saving…', hi:'सहेज रहे हैं…', ta:'சேமிக்கிறோம்…', te:'సేవ్ చేస్తున్నాం…' },
  skip:         { en:'Skip — continue without account', hi:'बिना अकाउंट के जारी रखें', ta:'கணக்கு இல்லாமல் தொடரவும்', te:'ఖాతా లేకుండా కొనసాగండి' },
  noSupabase:   { en:'Supabase not configured. Add keys to .env.local', hi:'Supabase सेट नहीं है', ta:'Supabase அமைக்கப்படவில்லை', te:'Supabase కాన్ఫిగర్ చేయబడలేదు' },
};

export default function LoginPage() {
  const router  = useRouter();
  const { lang, setUser } = useStore();
  const tl = (k) => TX[k]?.[lang] || TX[k]?.en || k;

  const [phase,   setPhase]   = useState('phone');  // phone|otp|profile|loading
  const [phone,   setPhone]   = useState('');
  const [digits,  setDigits]  = useState(['','','','','','']);
  const [error,   setError]   = useState('');
  const [timer,   setTimer]   = useState(0);
  const [busy,    setBusy]    = useState(false);

  // Profile state
  const [pName,   setPName]   = useState('');
  const [pVillage,setPVillage]= useState('');
  const [pDistrict,setPDistrict] = useState('');
  const [pState,  setPState]  = useState('');

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer]);

  // Redirect if already logged in
  useEffect(() => {
    supabase?.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setUser(data.session.user);
        router.replace('/dashboard');
      }
    });
  }, []);

  // Format phone to E.164 with +91
  const e164 = (raw) => {
    const d = raw.replace(/\D/g, '');
    return d.startsWith('91') ? `+${d}` : `+91${d}`;
  };

  // ── Send OTP via Supabase → Twilio ────────────────────────────────────────
  const sendOtp = useCallback(async () => {
    if (phone.replace(/\D/g,'').length < 10) {
      setError('Enter a valid 10-digit number'); return;
    }
    setError(''); setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: e164(phone),
        options: { channel: 'sms' },
      });
      if (error) throw error;
      setDigits(['','','','','','']);
      setPhase('otp');
      setTimer(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Check your number.');
    } finally { setBusy(false); }
  }, [phone]);

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const verifyOtp = useCallback(async (codeOverride) => {
    const code = codeOverride || digits.join('');
    if (code.length < 6) { setError('Enter the full 6-digit OTP'); return; }
    setError(''); setBusy(true); setPhase('loading');
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: e164(phone),
        token: code,
        type: 'sms',
      });
      if (error) throw error;

      setUser(data.user);

      // Check if profile already exists
      const { data: profile } = await supabase
        .from('farmer_profiles')
        .select('full_name')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile?.full_name) {
        router.replace('/dashboard');
      } else {
        setPhase('profile');
        setBusy(false);
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      setPhase('otp');
      setBusy(false);
    }
  }, [digits, phone]);

  // ── OTP digit input handler ───────────────────────────────────────────────
  const handleDigit = (i, val, isBackspace) => {
    if (isBackspace) {
      const next = [...digits]; next[i] = '';
      setDigits(next);
      if (i > 0) otpRefs.current[i - 1]?.focus();
      return;
    }
    const clean = val.replace(/\D/g, '').slice(-1);
    if (!clean) return;
    const next = [...digits]; next[i] = clean;
    setDigits(next);
    if (i < 5) {
      otpRefs.current[i + 1]?.focus();
    }
    // Auto-submit when all 6 filled
    if (next.filter(Boolean).length === 6) {
      verifyOtp(next.join(''));
    }
  };

  // ── Save profile ──────────────────────────────────────────────────────────
  const saveProfile = useCallback(async () => {
    if (!pName.trim()) { setError('Name is required'); return; }
    setError(''); setBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('farmer_profiles').upsert({
        id:             user.id,
        phone:          e164(phone) || user.phone,
        full_name:      pName.trim(),
        village:        pVillage.trim() || null,
        district:       pDistrict.trim() || null,
        state:          pState.trim() || null,
        preferred_lang: lang,
        avatar_seed:    pName.trim().slice(0, 2).toUpperCase(),
        updated_at:     new Date().toISOString(),
      });
      if (error) throw error;
      router.replace('/form');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }, [pName, pVillage, pDistrict, pState, phone, lang]);

  // ── No Supabase configured ────────────────────────────────────────────────
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0ece2] px-6">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-xl border border-[rgba(26,51,40,0.1)]">
          <div className="text-4xl mb-4">⚙️</div>
          <h2 className="font-serif text-xl text-forest mb-2">Supabase Not Configured</h2>
          <p className="text-sm text-forest-light mb-1">Add to <code className="bg-parchment px-1 rounded text-xs">.env.local</code>:</p>
          <div className="bg-parchment rounded-lg p-3 text-xs font-mono text-forest text-left mb-5 space-y-1">
            <div>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</div>
          </div>
          <button onClick={() => router.push('/form')}
            className="w-full py-3 rounded-xl bg-forest text-white font-bold text-sm border-none cursor-pointer hover:opacity-90">
            Continue without login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(155deg, #1a3328 0%, #2d6650 50%, #1a3328 100%)' }}>

      {/* Background grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'180px' }} />

      {/* Decorative circles */}
      <div className="absolute w-[500px] h-[500px] rounded-full border-[60px] border-white/[0.025] -top-40 -right-40 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full border-[40px] border-white/[0.03] -bottom-20 -left-20 pointer-events-none" />

      {/* Logo */}
      <div className="relative text-center mb-8">
        <button onClick={() => router.push('/')} className="inline-flex items-center gap-3 bg-transparent border-none cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #d4852a, #e8a84e)' }}>🌱</div>
          <span className="font-serif text-3xl text-white">AgriSmart</span>
        </button>
        <p className="text-white/45 text-sm mt-2">{tl('subtitle')}</p>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Progress bar */}
        <div className="h-1 bg-parchment">
          <div className="h-full bg-sage transition-all duration-500 rounded-full"
            style={{ width: phase === 'phone' ? '33%' : phase === 'otp' ? '66%' : '100%' }} />
        </div>

        <div className="p-8">

          {/* ── PHONE ENTRY ── */}
          {phase === 'phone' && (
            <>
              <h2 className="font-serif text-2xl text-forest mb-1">{tl('title')}</h2>
              <p className="text-sm text-forest-light mb-7">{tl('subtitle')}</p>

              <label className="block text-xs font-semibold text-forest-light uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="flex items-stretch border-[1.5px] rounded-xl overflow-hidden transition-colors focus-within:border-sage"
                style={{ borderColor: 'rgba(26,51,40,0.2)' }}>
                <span className="flex items-center px-4 bg-parchment border-r text-forest font-bold text-sm flex-shrink-0"
                  style={{ borderColor: 'rgba(26,51,40,0.12)' }}>
                  🇮🇳 +91
                </span>
                <input
                  type="tel" inputMode="numeric" maxLength={10}
                  autoFocus
                  className="flex-1 px-4 py-4 bg-transparent text-forest text-base outline-none font-mono tracking-widest"
                  placeholder={tl('phonePH')}
                  value={phone}
                  onChange={e => { setError(''); setPhone(e.target.value.replace(/\D/g,'').slice(0,10)); }}
                  onKeyDown={e => e.key === 'Enter' && sendOtp()}
                />
              </div>

              {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><span>⚠</span>{error}</p>}

              <button
                onClick={sendOtp}
                disabled={busy || phone.replace(/\D/g,'').length < 10}
                className="w-full mt-5 py-4 rounded-xl text-white font-bold text-base border-none cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-40 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}
              >
                {busy ? tl('sending') : `${tl('sendOtp')} →`}
              </button>

              <div className="mt-4 pt-4 border-t border-[rgba(26,51,40,0.07)] text-center">
                <button onClick={() => router.push('/form')}
                  className="text-xs text-forest-light hover:text-forest bg-transparent border-none cursor-pointer transition-colors">
                  {tl('skip')}
                </button>
              </div>
            </>
          )}

          {/* ── OTP ENTRY ── */}
          {phase === 'otp' && (
            <>
              <button onClick={() => { setPhase('phone'); setError(''); }}
                className="text-xs text-forest-light hover:text-forest bg-transparent border-none cursor-pointer mb-5 flex items-center gap-1 transition-colors">
                {tl('changeNum')}
              </button>

              <h2 className="font-serif text-2xl text-forest mb-1">{tl('otpTitle')}</h2>
              <p className="text-sm text-forest-light mb-7">
                {tl('otpSent')} <span className="font-mono font-bold text-forest">+91 {phone}</span>
              </p>

              {/* 6-box OTP input */}
              <div className="flex gap-2.5 justify-between mb-6">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="tel" inputMode="numeric" maxLength={1}
                    className="flex-1 h-14 text-center text-xl font-bold font-mono rounded-xl border-[1.5px] outline-none transition-all"
                    style={{
                      borderColor: d ? '#4a8a72' : 'rgba(26,51,40,0.18)',
                      background: d ? 'rgba(74,138,114,0.06)' : '#faf8f4',
                      color: '#1a3328',
                    }}
                    value={d}
                    onChange={e => handleDigit(i, e.target.value, false)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace') handleDigit(i, '', true);
                    }}
                    onPaste={e => {
                      // Handle pasting full OTP
                      const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
                      if (pasted.length === 6) {
                        const arr = pasted.split('');
                        setDigits(arr);
                        otpRefs.current[5]?.focus();
                        verifyOtp(pasted);
                      }
                      e.preventDefault();
                    }}
                    onFocus={e => e.target.select()}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-xs mb-4 flex items-center gap-1"><span>⚠</span>{error}</p>}

              <button
                onClick={() => verifyOtp()}
                disabled={busy || digits.filter(Boolean).length < 6}
                className="w-full py-4 rounded-xl text-white font-bold text-base border-none cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-40 disabled:translate-y-0 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}
              >
                {busy ? tl('verifying') : `${tl('verify')} →`}
              </button>

              <div className="text-center mt-5">
                {timer > 0 ? (
                  <p className="text-xs text-forest-light">
                    {tl('resendIn')} <span className="font-mono font-bold text-forest">{timer}s</span>
                  </p>
                ) : (
                  <button onClick={sendOtp}
                    className="text-xs text-sage hover:text-forest underline bg-transparent border-none cursor-pointer font-semibold transition-colors">
                    {tl('resend')}
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── PROFILE SETUP ── */}
          {phase === 'profile' && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-forest flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {pName.slice(0,1).toUpperCase() || '👨‍🌾'}
                </div>
                <div>
                  <h2 className="font-serif text-xl text-forest">{tl('profileTitle')}</h2>
                  <p className="text-xs text-forest-light mt-0.5">{tl('profileSub')}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { val: pName,     set: setPName,     ph: tl('namePH'),     req: true  },
                  { val: pVillage,  set: setPVillage,  ph: tl('villagePH'),  req: false },
                  { val: pDistrict, set: setPDistrict, ph: tl('districtPH'), req: false },
                  { val: pState,    set: setPState,    ph: tl('statePH'),    req: false },
                ].map(({ val, set, ph, req }) => (
                  <input
                    key={ph}
                    className="w-full px-4 py-3.5 border-[1.5px] rounded-xl text-sm outline-none transition-colors font-sans"
                    style={{
                      borderColor: 'rgba(26,51,40,0.15)',
                      background: '#faf8f4',
                      color: '#1a3328',
                    }}
                    placeholder={ph}
                    value={val}
                    onChange={e => { setError(''); set(e.target.value); }}
                    onKeyDown={e => e.key === 'Enter' && req && saveProfile()}
                    onFocus={e => e.target.style.borderColor = '#4a8a72'}
                    onBlur={e => e.target.style.borderColor = 'rgba(26,51,40,0.15)'}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><span>⚠</span>{error}</p>}

              <button
                onClick={saveProfile}
                disabled={busy || !pName.trim()}
                className="w-full mt-5 py-4 rounded-xl text-white font-bold text-sm border-none cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg disabled:opacity-40 disabled:translate-y-0 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #d4852a, #e8a84e)' }}
              >
                {busy ? tl('saving') : tl('saveBtn')}
              </button>
            </>
          )}

          {/* ── LOADING ── */}
          {phase === 'loading' && (
            <div className="py-12 text-center">
              <div className="w-12 h-12 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto mb-5" />
              <p className="text-sm text-forest-light font-medium">
                {busy ? tl('verifying') : 'One moment…'}
              </p>
            </div>
          )}

        </div>
      </div>

      <p className="relative text-white/25 text-xs mt-6 text-center">
        🔒 Your data is private and never sold
      </p>
    </div>
  );
}
