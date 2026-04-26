import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { 
  Sparkles, 
  Download, 
  Share2, 
  Loader2, 
  Code, 
  Box,
  Image as ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PixelCard from '../components/PixelCard';
import PixelButton from '../components/PixelButton';
import { FeatureType, GeneratedContent } from '../types';
import { generateMinecraftConcept } from '../services/geminiService';
import { cn } from '../lib/utils';

interface GeneratorViewProps {
  type: FeatureType;
}

export default function GeneratorView({ type }: GeneratorViewProps) {
  const [prompt, setPrompt] = useState('');
  const [targetEdition, setTargetEdition] = useState<'Java' | 'Bedrock'>('Java');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(() => {
    // Initial load from cache for "offline" persistence
    const cached = localStorage.getItem(`MMPCRAFTER_CACHE_${type}`);
    return cached ? JSON.parse(cached) : null;
  });

  const titles: Record<FeatureType, string> = {
    chat: 'AI Chat',
    photo: 'Photo Generator',
    mod: 'Mod Generator',
    pack: 'Pack Creator',
    template: 'Template Generator',
    skin: 'Skin Generator',
    world: 'World Generator',
    shader: 'Shader Generator',
    treasure: 'Treasure Pack',
    addon: 'Add-on Generator',
  };

  const placeholders: Record<FeatureType, string> = {
    chat: '',
    photo: 'Describe a Minecraft scene (e.g., "A huge obsidian castle in a lava ocean")',
    mod: 'Describe a mod idea (e.g., "Furniture mod with working TVs and chairs")',
    pack: 'Describe a pack (e.g., "Minimalist PvP pack with 16x textures")',
    template: 'Describe a project (e.g., "Survival spawn with basic starter gear")',
    skin: 'Describe a skin (e.g., "A cool cyborg ninja with glowing green details")',
    world: 'Describe a world (e.g., "A survival island with a hidden jungle temple")',
    shader: 'Describe shader effects (e.g., "Wavy water with realistic sun reflections")',
    treasure: 'Describe loot (e.g., "A desert temple chest with rare opal items")',
    addon: 'Describe a bedrock entity (e.g., "A pet dragon that flies and shoots fire")',
  };

  const handleDownload = async () => {
    if (!result) return;
    
    const useZip = ['mod', 'addon', 'world', 'shader', 'treasure'].includes(type) || prompt.toLowerCase().includes('hardcore');

    if (useZip) {
      const zip = new JSZip();
      const cleanName = result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      // Edition specific folder structure
      let folder;
      let zipExtension = '.zip';
      
      if (type === 'addon') {
        // Bedrock Add-on structure
        folder = zip.folder(`${cleanName}_bedrock`);
        zipExtension = '.mcaddon'; // Minecraft Bedrock Add-on extension
      } else if (type === 'mod') {
        // Java Mod structure
        folder = zip.folder(`${cleanName}_java_source`);
      } else {
        folder = zip.folder(cleanName);
      }

      if (folder) {
        folder.file("README.txt", `PROJECT: ${result.title}\nEDITION: ${type === 'addon' ? 'Bedrock' : type === 'mod' ? 'Java' : 'General'}\n\n${result.description}`);

        if (result.code) {
          if (typeof result.code === 'object') {
            // Multi-file support: Iterate over the object keys and add them as files
            Object.entries(result.code).forEach(([fileName, content]) => {
              const formattedName = fileName.replace(/_/g, '.'); // Convert manifest_json to manifest.json
              folder.file(formattedName, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
            });
          } else if (type === 'addon' || type === 'treasure') {
            // Bedrock or JSON-based logic
            folder.file(type === 'treasure' ? "loot_table.json" : "manifest.json", result.code);
          } else if (type === 'mod') {
            folder.file(`${result.title.replace(/\s+/g, '')}.java`, result.code);
          } else if (type === 'shader') {
            folder.file("shader_implementation.txt", result.code);
          } else {
            folder.file("implementation.txt", result.code);
          }
        }

        if (result.imageUrl) {
          const response = await fetch(result.imageUrl);
          const blob = await response.blob();
          folder.file("preview.png", blob);
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cleanName}${zipExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
    }

    // Standard download logic for simple assets
    if (result.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `mmcrafter-${type}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (result.code) {
      const codeText = typeof result.code === 'string' ? result.code : JSON.stringify(result.code, null, 2);
      const blob = new Blob([codeText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mmcrafter-${type}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([result.description], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mmcrafter-${type}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);

    try {
      // Pass targetEdition to the generator
      const data = await generateMinecraftConcept(type, `${targetEdition} Edition: ${prompt}`);
      setResult(data);
      // Cache the successful result
      localStorage.setItem(`MMPCRAFTER_CACHE_${type}`, JSON.stringify(data));
    } catch (error) {
      console.error(error);
      alert('Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 min-h-[70vh]">
      <section className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">{titles[type]}</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Use the power of AI to generate advanced {type} concepts for your Minecraft project.
        </p>
      </section>

      <div className="max-w-4xl mx-auto space-y-8">
        <PixelCard title="Prompt Engineering">
          <div className="space-y-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholders[type]}
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none text-slate-200"
              id="generator-prompt"
            />
            
            <div className="flex items-center gap-4 p-2 bg-slate-900/50 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-tighter">Target Edition:</span>
              <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button
                  onClick={() => setTargetEdition('Java')}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                    targetEdition === 'Java' ? "bg-red-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  JAVA
                </button>
                <button
                  onClick={() => setTargetEdition('Bedrock')}
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-bold rounded-md transition-all",
                    targetEdition === 'Bedrock' ? "bg-cyan-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  BEDROCK
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                MMPCRAFTER Intelligence Engine
              </span>
              <PixelButton 
                onClick={handleGenerate} 
                disabled={isLoading || !prompt.trim()}
                className="flex items-center gap-3 px-8"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Generate Now
              </PixelButton>
            </div>
          </div>
        </PixelCard>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <PixelCard title="Generation Result" className="border-emerald-500/20">
                <div className="space-y-6">
                  {result.imageUrl && (
                    <div className="relative group overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
                      <img 
                        src={result.imageUrl} 
                        alt={result.title} 
                        className="w-full h-auto object-contain bg-slate-950"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                         <div className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full shadow-xl">
                           EXPORT ASSET
                         </div>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-4 tracking-tight">
                      {result.title}
                    </h2>
                    <div className="text-slate-300 leading-relaxed max-w-none">
                      <ReactMarkdown>{result.description}</ReactMarkdown>
                    </div>
                  </div>

                  {result.code && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <Code size={12} /> Tech Implementation Details
                      </div>
                      <div className="relative group overflow-hidden rounded-xl border border-slate-800">
                         <pre className="bg-slate-950/80 p-5 font-mono text-[10px] md:text-sm overflow-x-auto text-emerald-300">
                          <code>{typeof result.code === 'string' ? result.code : JSON.stringify(result.code, null, 2)}</code>
                        </pre>
                        <button 
                          className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const codeText = typeof result.code === 'string' ? result.code : JSON.stringify(result.code, null, 2);
                            navigator.clipboard.writeText(codeText);
                            alert('Copied to clipboard!');
                          }}
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-800/50">
                    <PixelButton className="text-xs" variant="success" onClick={handleDownload}>
                      <Download size={14} className="mr-2" /> Download Asset
                    </PixelButton>
                    <PixelButton className="text-xs" variant="secondary">
                       <Share2 size={14} className="mr-2" /> Share Concept
                    </PixelButton>
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-20">
             <Box size={80} className="mb-4" />
             <p className="font-mono text-sm">Nothing generated yet.<br/>Input your prompt above to begin.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
             <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-sm animate-pulse text-emerald-400 font-bold uppercase tracking-widest">Synthesizing Asset...</p>
             <p className="text-[10px] text-slate-500 mt-2 font-mono italic">"Connecting to Minecraft Neural Network..."</p>
          </div>
        )}
      </div>
    </div>
  );
}
