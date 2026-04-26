import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Ghost, 
  Settings, 
  Globe, 
  Package,
  Zap,
  ChevronRight,
  Pickaxe,
  Sun,
  Gem
} from 'lucide-react';
import { cn } from '../lib/utils';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';

export default function DashboardView() {
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    const key = localStorage.getItem('MMPCRAFTER_GEMINI_KEY');
    // Consider it missing if both localStorage and env (default placeholder) are not set correctly
    if (!key && (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY")) {
      setHasApiKey(false);
    }
  }, []);

  const tools = [
    { title: 'AI Chatbot', desc: 'Ask about Minecraft mechanics, redstone, or Burmese tips.', path: '/chat', icon: MessageSquare, color: 'bg-blue-500', edition: 'General' },
    { title: 'Photo Generator', desc: 'Generate amazing Minecraft-style scenery or blocks.', path: '/photo', icon: ImageIcon, color: 'bg-green-500', edition: 'Visual' },
    { title: 'Mod Generator', desc: 'Describe a mod idea and get technical concepts.', path: '/mod', icon: Ghost, color: 'bg-purple-500', edition: 'Java' },
    { title: 'Pack Creator', desc: 'Generate high-quality Resource and Texture Packs.', path: '/pack', icon: Zap, color: 'bg-yellow-500', edition: 'Both' },
    { title: 'Template Gen', desc: 'Get starting templates for your Minecraft projects.', path: '/template', icon: Pickaxe, color: 'bg-slate-700', edition: 'Both' },
    { title: 'Skin Generator', desc: 'Generate unique Minecraft skin textures and previews.', path: '/skin', icon: Settings, color: 'bg-pink-500', edition: 'Both' },
    { title: 'World Concept', desc: 'Get seeds, biome ideas, and structure designs.', path: '/world', icon: Globe, color: 'bg-orange-500', edition: 'Both' },
    { title: 'Shader Gen', desc: 'Design lighting, shadows, and engine effects.', path: '/shader', icon: Sun, color: 'bg-amber-400', edition: 'Both' },
    { title: 'Treasure Pack', desc: 'Generate custom loot tables and treasure chests.', path: '/treasure', icon: Gem, color: 'bg-rose-400', edition: 'Both' },
    { title: 'Add-on Generator', desc: 'Generate JSON files for Bedrock Add-ons/Behaviors.', path: '/addon', icon: Package, color: 'bg-cyan-500', edition: 'Bedrock' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-12">
      <section className="text-center space-y-6 pt-8">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
        >
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} /> Powered by Gemini 3.1 Pro
            </span>
            <div className="h-3 w-px bg-emerald-500/20" />
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", hasApiKey ? "bg-emerald-500" : "bg-rose-500")} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8b8b8b]">
                {!hasApiKey ? (
                  <Link to="/settings" className="text-rose-400 hover:underline">API Key Missing - Go to Settings</Link>
                ) : "System Active"}
              </span>
            </div>
          </div>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          CREATE <span className="text-emerald-400">BEYOND</span> BLOCKS
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          MMPCRAFTER AI Studio provides cutting-edge AI tools to simplify your Minecraft creativity. 
          From complex mods to beautiful world concepts – all available in English and Burmese.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/chat">
            <PixelButton>Start Chatting</PixelButton>
          </Link>
          <a href="#tools-grid">
            <PixelButton variant="secondary">Browse Tools</PixelButton>
          </a>
        </div>
      </section>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        id="tools-grid"
      >
        {tools.map((tool) => (
          <motion.div key={tool.path} variants={item}>
            <Link to={tool.path}>
              <PixelCard title={tool.title} className="h-full group cursor-pointer hover:scale-[1.02] active:scale-100 transition-all border border-transparent hover:border-emerald-500/30">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-current/20",
                      tool.color
                    )}>
                      <tool.icon className="text-white" size={24} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-1 rounded ring-1 ring-inset",
                      tool.edition === 'Java' ? "bg-red-500/10 text-red-400 ring-red-500/20" :
                      tool.edition === 'Bedrock' ? "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20" :
                      "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                    )}>
                      {tool.edition}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-6 flex-grow leading-relaxed">{tool.desc}</p>
                  <div className="flex items-center text-emerald-400 text-xs uppercase font-bold gap-2 group-hover:gap-4 transition-all">
                    Open Tool <ChevronRight size={14} />
                  </div>
                </div>
              </PixelCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <PixelCard className="bg-gradient-to-br from-slate-800 to-slate-900 border-dashed border-slate-700">
        <div className="flex flex-col md:flex-row items-center gap-8 py-4">
          <div className="p-6 bg-slate-950/50 rounded-2xl border border-slate-800 shadow-xl">
            <Pickaxe size={48} className="text-emerald-400" />
          </div>
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-xl font-bold text-emerald-400 uppercase tracking-tight">Community Support</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              ဤ App သည် မြန်မာ Minecraft Community အတွက် ရည်ရွယ်၍ ပြုလုပ်ထားခြင်း ဖြစ်ပါသည်။ 
              သိလိုသည်များကို Chatbot တွင် မြန်မာလို မေးမြန်းနိုင်ပါသည်။
            </p>
            <div className="pt-2">
              <a href="https://discord.gg/M2Tjs33PK" target="_blank" rel="noopener noreferrer">
                <PixelButton variant="success" className="text-xs px-8">Join our Discord</PixelButton>
              </a>
            </div>
          </div>
        </div>
      </PixelCard>
    </div>
  );
}
