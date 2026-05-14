import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toPng } from 'html-to-image';
import './App.css';

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://woqqlxfpihyjhemnaqup.supabase.co';
const supabaseKey = 'sb_publishable_NIboCJIwZsIb2FbwZYRUWQ_SL_lP7WP';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // User Profile State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    address: ''
  });

  // Prayer Request Form State
  const [prayerForm, setPrayerForm] = useState({
    name: '',
    contact: '',
    address: '',
    modality: 'Online Prayer',
    verse_request: '',
    intent: ''
  });

  // Verse Card State
  const [searchQuery, setSearchQuery] = useState('');
  const [verseData, setVerseData] = useState({ 
    text: "Be still, and know that I am God.", 
    reference: "Psalm 46:10" 
  });
  
  const [cardBg, setCardBg] = useState('https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1000');
  const cardRef = useRef(null);

  const cardPresets = [
    { name: 'Mist', value: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=500' },
    { name: 'Charcoal', value: '#121212' },
    { name: 'Forest', value: '#344e41' },
    { name: 'Midnight', value: '#1b263b' },
    { name: 'Sage', value: '#84a59d' },
    { name: 'Clay', value: '#a44a3f' },
    { name: 'Gold', value: '#9c6644' }
  ];

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // --- SUBMIT PRAYER TO SUPABASE ---
  const handleSubmitPrayer = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('prayer_requests')
      .insert([
        { 
          full_name: prayerForm.name, 
          contact: prayerForm.contact, 
          address: prayerForm.address,
          modality: prayerForm.modality,
          verse_request: prayerForm.verse_request,
          intent: prayerForm.intent 
        }
      ]);

    if (error) {
      alert("Submission Error: " + error.message);
    } else {
      alert("Prayer request sent successfully.");
      setPrayerForm({ ...prayerForm, intent: '', verse_request: '' });
    }
    setLoading(false);
  };

  // --- BIBLE API SEARCH ---
  const searchVerse = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(`https://bible-api.com/${searchQuery}`);
      const data = await res.json();
      if (data.text) {
        setVerseData({ text: data.text, reference: data.reference });
      } else {
        alert("Verse not found. Try 'Genesis 1:1' or 'John 3:16'");
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const downloadCard = () => {
    if (cardRef.current === null) return;
    toPng(cardRef.current, { cacheBust: true }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `Sacred-Space-${verseData.reference}.png`;
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <main data-theme={theme} className="fit-screen relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700" 
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=2000')`, opacity: theme === 'dark' ? 0.3 : 0.1 }} />
      <div className="noise-overlay" />
      
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl">
          <div className="glass-panel p-10 w-full max-w-md text-center">
            <h2 className="text-4xl font-serif mb-2 italic">{isRegistering ? "Join Us" : "Sacred Space"}</h2>
            <p className="text-[10px] tracking-widest uppercase opacity-60 mb-8">{isRegistering ? "Create your sanctuary account" : "Welcome back to your sanctuary"}</p>
            
            <div className="space-y-4 mb-6">
              {isRegistering && <input type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" onChange={(e) => setProfile({...profile, name: e.target.value})} />}
              <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" onChange={(e) => setProfile({...profile, email: e.target.value})} />
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">{showPassword ? "Hide" : "Show"}</button>
              </div>
            </div>
            <button onClick={() => {setUser(true); setShowLogin(false);}} className="w-full py-4 bg-[#A3B18A] text-[#121212] rounded-xl font-bold uppercase tracking-widest">
              {isRegistering ? "Create Account" : "Enter Space"}
            </button>
            <p className="mt-6 text-xs opacity-50 cursor-pointer underline" onClick={() => {setIsRegistering(!isRegistering); setShowPassword(false);}}>
              {isRegistering ? "Already have an account? Login" : "New here? Create Account"}
            </p>
          </div>
        </div>
      )}

      {!showLogin && (
        <div className="flex-1 flex flex-col p-8 md:p-12 relative z-10 h-full">
          <nav className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              <button onClick={() => setView('dashboard')} className={`text-[10px] tracking-[.3em] uppercase ${view === 'dashboard' ? 'text-[#A3B18A]' : 'opacity-40'}`}>Dashboard</button>
              <button onClick={() => setView('settings')} className={`text-[10px] tracking-[.3em] uppercase ${view === 'settings' ? 'text-[#A3B18A]' : 'opacity-40'}`}>Profile Settings</button>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={toggleTheme} className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</button>
              <button onClick={() => {setShowLogin(true); setUser(null);}} className="text-[10px] tracking-[.3em] uppercase text-red-400">Logout</button>
            </div>
          </nav>

          {view === 'dashboard' ? (
            <div className="flex flex-col h-full overflow-hidden">
              <header className="text-center mb-4">
                <h1 className="text-5xl md:text-6xl font-serif italic mb-2">A Quiet Place for Your Heart.</h1>
                <p className="text-[#A3B18A] tracking-[0.5em] uppercase text-xs">Shared burdens. Timeless truth.</p>
              </header>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
                <section className="lg:col-span-7 glass-panel p-8 flex flex-col h-full overflow-hidden">
                  <form onSubmit={handleSubmitPrayer} className="h-full flex flex-col justify-between overflow-hidden">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 ml-1">Full Name</label>
                        <input type="text" value={prayerForm.name} onChange={(e) => setPrayerForm({...prayerForm, name: e.target.value})} className="p-3 rounded-xl outline-none" required />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 ml-1">Contact</label>
                        <input type="text" value={prayerForm.contact} onChange={(e) => setPrayerForm({...prayerForm, contact: e.target.value})} className="p-3 rounded-xl outline-none" required />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase tracking-widest opacity-40 ml-1">Home Address</label>
                      <input type="text" value={prayerForm.address} onChange={(e) => setPrayerForm({...prayerForm, address: e.target.value})} className="w-full p-3 rounded-xl outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 ml-1">Modality</label>
                        <select value={prayerForm.modality} onChange={(e) => setPrayerForm({...prayerForm, modality: e.target.value})} className="bg-transparent border border-white/10 p-3 rounded-xl outline-none">
                          <option value="Online Prayer">Online Prayer</option>
                          <option value="Face-to-Face">Face-to-Face</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase tracking-widest opacity-40 ml-1">Verse Request</label>
                        <input type="text" value={prayerForm.verse_request} onChange={(e) => setPrayerForm({...prayerForm, verse_request: e.target.value})} className="p-3 rounded-xl outline-none italic" placeholder="e.g. Proverbs 3:5" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 min-h-[100px] flex-grow">
                      <label className="text-[9px] uppercase tracking-widest opacity-40 ml-1">Prayer Intent</label>
                      <textarea value={prayerForm.intent} onChange={(e) => setPrayerForm({...prayerForm, intent: e.target.value})} className="w-full h-full p-4 rounded-2xl outline-none resize-none" placeholder="Speak your heart..." required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-5 bg-[#F2E9E4] text-[#121212] font-bold rounded-2xl uppercase tracking-[0.4em] text-[10px] mt-4">
                      {loading ? 'Processing...' : 'Request Prayer'}
                    </button>
                  </form>
                </section>

                <section className="lg:col-span-5 flex flex-col gap-6 overflow-hidden h-full">
                  <div className="glass-panel p-8 flex-1 flex flex-col items-center justify-between overflow-hidden h-full">
                    <div className="w-full flex gap-2">
                      <input type="text" placeholder="Search Verse..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && searchVerse()} className="flex-1 p-3 rounded-xl outline-none italic" />
                      <button onClick={searchVerse} className="bg-white/10 px-4 rounded-xl">🔍</button>
                    </div>

                    <div className="w-full space-y-2">
                       <p className="text-[9px] uppercase tracking-widest opacity-40">Customize Card Background</p>
                       <div className="flex flex-wrap gap-2">
                          {cardPresets.map((preset) => (
                            <button key={preset.name} onClick={() => setCardBg(preset.value)} className={`w-7 h-7 rounded-full border-2 ${cardBg === preset.value ? 'border-white' : 'border-white/20'}`} style={{ background: preset.value.startsWith('http') ? `url(${preset.value}) center/cover` : preset.value }} />
                          ))}
                       </div>
                    </div>
                    
                    <div ref={cardRef} className="relative w-full aspect-square max-h-[260px] rounded-2xl overflow-hidden flex items-center justify-center p-8 shadow-2xl">
                       <div className="absolute inset-0 z-0" style={{ background: cardBg.startsWith('http') ? `url(${cardBg}) center/cover` : cardBg }} />
                       <div className="absolute inset-0 bg-black/50 z-[1]" />
                       <div className="relative z-[2] text-center">
                          <p className="font-serif italic text-lg leading-relaxed text-white">"{verseData.text}"</p>
                          <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-[#A3B18A] font-bold">{verseData.reference}</p>
                       </div>
                    </div>
                    
                    <button onClick={downloadCard} className="w-full text-[10px] font-bold uppercase tracking-widest border border-white/20 py-4 rounded-full hover:bg-white/10 transition-all">Download Card</button>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center overflow-hidden h-full">
              <div className="glass-panel p-12 w-full max-w-xl text-center">
                <h2 className="text-3xl font-serif italic mb-8">Personal Information</h2>
                <div className="space-y-6 text-left">
                  {['name', 'email', 'contact', 'address'].map(key => (
                    <div key={key}>
                      <label className="text-[9px] uppercase tracking-[0.4em] opacity-40">{key}</label>
                      {isEditing ? <input className="w-full bg-white/5 border-b border-white/20 p-2 outline-none" value={profile[key]} onChange={(e) => setProfile({...profile, [key]: e.target.value})} /> : <p className="text-xl font-serif border-b border-transparent p-2">{profile[key] || 'Not provided'}</p>}
                    </div>
                  ))}
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className="mt-10 px-10 py-3 bg-[#A3B18A] text-[#121212] rounded-full uppercase text-[10px] tracking-widest font-bold">
                  {isEditing ? "Save Changes" : "Edit Information"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default App;