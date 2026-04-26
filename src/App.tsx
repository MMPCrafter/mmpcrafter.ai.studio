/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pickaxe, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  Ghost, 
  Globe, 
  Package, 
  Zap,
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from './lib/utils';
import ChatView from './views/ChatView';
import GeneratorView from './views/GeneratorView';
import DashboardView from './views/DashboardView';
import SettingsView from './views/SettingsView';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Pickaxe },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Photo', path: '/photo', icon: ImageIcon },
    { name: 'Mod', path: '/mod', icon: Ghost },
    { name: 'Pack', path: '/pack', icon: Zap },
    { name: 'Template', path: '/template', icon: Pickaxe },
    { name: 'Skin', path: '/skin', icon: Settings },
    { name: 'World', path: '/world', icon: Globe },
    { name: 'Add-on', path: '/addon', icon: Package },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-800 px-4 py-3" id="main-nav">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <Pickaxe className="text-slate-900" size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white">MMPCRAFTER <span className="text-emerald-400">AI Studio</span></h1>
            <p className="text-[10px] uppercase tracking-widest opacity-60 text-slate-400 leading-none">Creative Hub for Minecraft</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "px-3 py-1.5 text-sm font-medium tracking-tight transition-all rounded-md flex items-center gap-2",
                location.pathname === item.path 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50"
              )}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-emerald-400 p-2 hover:bg-slate-800 rounded-full transition-colors" onClick={() => setIsOpen(!isOpen)} id="sidebar-toggle">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass shadow-2xl z-40 p-4 md:hidden border-t border-slate-800"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "p-3 rounded-xl flex items-center justify-between group transition-colors",
                    location.pathname === item.path ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-slate-800 text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight size={18} className="opacity-40" />
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-400">
        <Navbar />
        
        <main className="max-w-7xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/chat" element={<ChatView />} />
            <Route path="/photo" element={<GeneratorView type="photo" />} />
            <Route path="/mod" element={<GeneratorView type="mod" />} />
            <Route path="/pack" element={<GeneratorView type="pack" />} />
            <Route path="/template" element={<GeneratorView type="template" />} />
            <Route path="/skin" element={<GeneratorView type="skin" />} />
            <Route path="/world" element={<GeneratorView type="world" />} />
            <Route path="/shader" element={<GeneratorView type="shader" />} />
            <Route path="/treasure" element={<GeneratorView type="treasure" />} />
            <Route path="/addon" element={<GeneratorView type="addon" />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-800 bg-slate-900/50 p-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-emerald-400 font-bold text-lg">MMPCRAFTER AI STUDIO</h2>
              <p className="text-slate-400 text-sm max-w-md">
                The ultimate AI companion for Myanmar Minecrafters. Generate anything, anytime.
                <br />
                မြန်မာနိုင်ငံမှ Minecraft player များအတွက် အစွမ်းထက်သော AI Studio။
              </p>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Globe className="text-slate-400" size={18} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <Pickaxe className="text-slate-400" size={18} />
              </div>
            </div>
          </div>
          <div className="text-center mt-8 text-slate-600 text-[10px] uppercase font-bold tracking-widest">
            © 2026 MMPCRAFTER AI Studio - Powered by Antigravity
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

