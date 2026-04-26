import { useState, useEffect } from 'react';
import { Key, Save, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { motion } from 'motion/react';

export default function SettingsView() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('MMPCRAFTER_GEMINI_KEY');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('MMPCRAFTER_GEMINI_KEY', apiKey);
    setIsSaved(true);
    alert('API Key saved successfully! (API Key ကို သိမ်းဆည်းပြီးပါပြီ)');
  };

  const handleClear = () => {
    localStorage.removeItem('MMPCRAFTER_GEMINI_KEY');
    setApiKey('');
    setIsSaved(false);
    alert('API Key cleared. (API Key ကို ပယ်ဖျက်လိုက်ပါပြီ)');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase flex items-center justify-center gap-4">
          <Key className="text-emerald-400" size={32} />
          Settings <span className="text-emerald-400">/ API KEY</span>
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
          MMPCRAFTER Studio ကို အသုံးပြုရန် သင်၏ Gemini API Key ကို ဤနေရာတွင် ထည့်သွင်းပေးပါ။ 
          Shared link ဖြင့် ဝင်ရောက်ကြည့်ရှုသူများအတွက် လိုအပ်ပါသည်။
        </p>
      </motion.div>

      <PixelCard title="Gemini Infrastructure Configuration">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              Google Gemini API Key
            </label>
            <div className="relative group">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API Key here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl py-4 px-6 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm text-slate-200 pr-24"
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-md transition-colors"
                id="toggle-key-visibility"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Your key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800/50">
            <PixelButton 
              onClick={handleSave} 
              disabled={!apiKey.trim()}
              className="flex items-center gap-2"
            >
              <Save size={18} /> Save Configuration
            </PixelButton>
            {isSaved && (
              <PixelButton 
                variant="danger" 
                onClick={handleClear}
                className="flex items-center gap-2"
              >
                <Trash2 size={18} /> Clear Data
              </PixelButton>
            )}
          </div>
        </div>
      </PixelCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-5 rounded-2xl border border-slate-800 space-y-3">
          <ShieldCheck className="text-emerald-400" size={24} />
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">Security Protocol</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            API Key သည် browser ၏ localStorage တွင်သာ ရှိနေမည်ဖြစ်ပြီး တခြားနေရာသို့ ပေးပို့မည် မဟုတ်ပါ။
          </p>
        </div>
        <div className="glass p-5 rounded-2xl border border-slate-800 space-y-3">
          <AlertCircle className="text-rose-400" size={24} />
          <h3 className="text-sm font-bold text-white uppercase tracking-tight">Need a Key?</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            API Key မရှိသေးပါက <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Google AI Studio</a> တွင် အခမဲ့ ရယူနိုင်ပါသည်။
          </p>
        </div>
      </div>
    </div>
  );
}
