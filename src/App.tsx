/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Cpu, 
  Gauge, 
  Wrench, 
  ChevronRight, 
  Menu, 
  X, 
  ShoppingCart, 
  User,
  Bookmark,
  Heart,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Truck,
  MapPin,
  Store,
  Navigation,
  Camera,
  History,
  TrendingUp,
  PackageCheck,
  BarChart3,
  Activity,
  Network,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
  Volume2,
  Upload,
  HardDrive,
  Star,
  Zap
} from 'lucide-react';
import { ChatBot } from './components/ChatBot';
import { SHOPS_DATA } from './data/shops';
import { translations, Language } from './data/translations';
import { TechGlobe } from './components/TechGlobe';
import { Globe } from './components/Globe';
import { BentoGrid, BentoItem } from './components/BentoGrid';
import { HardwareIntegrations } from './components/HardwareIntegrations';
import { 
  EngineIcon, 
  BrakesIcon, 
  ElectricalIcon, 
  SuspensionIcon, 
  BodyPartsIcon, 
  TyresIcon,
  SpareGridLogo
} from './components/CustomIcons';
import { NeonButton } from './components/ui/neon-button';
import { SpotlightCard } from './components/ui/spotlight-card';
import { PromptInputBox } from './components/ui/ai-prompt-box';
import { AnimatedStateIcon } from './components/ui/animated-state-icons';
import { GoogleMapsView } from './components/ui/google-maps-view';
import { GoogleGenAI, Modality } from "@google/genai";
import { UserProfile } from './components/UserProfile';
import { LimelightNav, NavItem } from './components/ui/limelight-nav';
import { SignInCard } from './components/ui/sign-in-card-2';
import ToastBasic, { toaster } from './components/ui/basic-toast';
import { supabase } from './lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { IntroSequence } from './components/IntroSequence';
import { QuickStrikeResult, SearchPageView } from './components/SearchViews';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell
} from 'recharts';

const DISTRICTS = ["Coimbatore", "Tiruppur", "Erode", "Gobi", "Salem"];

const DASHBOARD_DATA = {
  sales: [
    { name: 'CBE', value: 4500, growth: 12 },
    { name: 'TPR', value: 3200, growth: 8 },
    { name: 'ERD', value: 2800, growth: -2 },
    { name: 'GBI', value: 1500, growth: 15 },
    { name: 'SLM', value: 3900, growth: 5 },
  ],
  inventory: [
    { time: '08:00', count: 120 },
    { time: '10:00', count: 450 },
    { time: '12:00', count: 890 },
    { time: '14:00', count: 1240 },
    { time: '16:00', count: 1100 },
    { time: '18:00', count: 950 },
  ],
  topMechanics: [
    { name: 'Arun Auto Works', location: 'Peelamedu', orders: 142, rating: 4.9 },
    { name: 'Siva Garage', location: 'Palladam', orders: 98, rating: 4.7 },
    { name: 'Royal Motors', location: 'Steel Plant Rd', orders: 85, rating: 4.8 },
  ],
  recentTransactions: [
    { id: 'TX-901', part: 'Clutch Plate Set', shop: 'Karthick Spares', amount: '₹4,200', time: '2m ago' },
    { id: 'TX-902', part: 'Headlight Assembly', shop: 'City Auto', amount: '₹2,850', time: '5m ago' },
    { id: 'TX-903', part: 'Engine Oil 5L', shop: 'Salem Mart', amount: '₹3,400', time: '12m ago' },
  ]
};

export default function App() {
  const [lang, setLang] = useState<Language>('EN');
  const t = translations[lang];
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Coimbatore');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [quickStrikeQuery, setQuickStrikeQuery] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showHardware, setShowHardware] = useState(false);
  const [hardwareTab, setHardwareTab] = useState<'camera' | 'upload' | 'drive'>('camera');
  const [showLogin, setShowLogin] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isGlobeHovered, setIsGlobeHovered] = useState(false);
  const scrollContainerRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);

  useEffect(() => {
    console.log("App: Auth state check - user:", user?.email, "isAuthLoading:", isAuthLoading);
  }, [user, isAuthLoading]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset scroll position when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          displayName: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
          email: session.user.email,
          photoURL: session.user.user_metadata.avatar_url || `https://avatar.vercel.sh/${session.user.id}`
        });
      }
      setIsAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          displayName: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
          email: session.user.email,
          photoURL: session.user.user_metadata.avatar_url || `https://avatar.vercel.sh/${session.user.id}`
        });
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    });

    // Safety timeout for auth loading
    const timeout = setTimeout(() => {
      setIsAuthLoading(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    console.log("handleShowLogin called, setting showLogin to true");
    toaster.create({ title: "Sign In", description: "Opening sign-in..." });
    setShowLogin(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toaster.create({
      title: "Signed Out",
      description: "You have been signed out successfully.",
      type: "info",
    });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const contextData = SHOPS_DATA.filter(s => s.district === selectedDistrict).map(s => `${s.name} in ${s.address}`).join(', ');
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As an automotive expert for the ${selectedDistrict} region, identify parts or diagnose issues for: "${searchQuery}". 
        Use the following verified local shop data for recommendations: ${contextData}.
        Include advice on MRP transparency and local sourcing. Be direct and technical. 
        Respond in ${lang === 'TA' ? 'Tamil' : 'English'}.`,
      });
      const text = response.text || "No local data found. Try a different part name.";
      setAiResponse(text);

      // Voice Output
      try {
        setIsSpeaking(true);
        const voiceResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text: text.slice(0, 300) }] }], // Truncate for speed
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: lang === 'TA' ? 'Fenrir' : 'Kore' },
              },
            },
          },
        });
        const base64Audio = voiceResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
          audio.play();
          audio.onended = () => setIsSpeaking(false);
        } else {
          setIsSpeaking(false);
        }
      } catch (vErr) {
        console.error("Voice Error:", vErr);
        setIsSpeaking(false);
      }

    } catch (error) {
      console.error("AI Search Error:", error);
      setAiResponse("Local AI Node is busy. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const CommandCenterView = useMemo(() => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20 relative"
    >
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] pointer-events-none opacity-20 md:opacity-40 scale-75 md:scale-100 origin-top-right">
        <TechGlobe />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
        <div>
          <h1 className="text-3xl md:text-5xl italic mb-2">{t.commandCenter.split(' ')[0]} <span className="text-brand-orange">{t.commandCenter.split(' ').slice(1).join(' ')}</span></h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-bold">{t.monitoring}</p>
        </div>
        <div className="flex gap-3 md:gap-4 w-full md:w-auto">
          <div className="glass-card px-3 py-2 flex items-center gap-2 flex-1 md:flex-none justify-center">
            <div className="status-pulse">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-success"></span>
            </div>
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest">{t.networkLive}</span>
          </div>
          <button className="bg-brand-orange text-white px-4 py-2 rounded-lg font-bold text-[8px] md:text-[10px] uppercase tracking-widest hover:scale-105 transition-transform flex-1 md:flex-none">
            {t.export}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 relative z-10">
        {[
          { label: t.totalRevenue, value: '₹12.4M', icon: DollarSign, trend: '+14%', color: 'text-brand-orange', glow: 'rgba(255,77,0,0.2)' },
          { label: t.activeShops, value: '1,240', icon: Store, trend: '+5%', color: 'text-brand-accent', glow: 'rgba(0,184,212,0.2)' },
          { label: t.dailyOrders, value: '842', icon: Activity, trend: '+22%', color: 'text-success', glow: 'rgba(0,230,118,0.2)' },
          { label: t.networkHealth, value: '98.2%', icon: Gauge, trend: t.stable, color: 'text-white', glow: 'rgba(255,255,255,0.1)' },
        ].map((stat, i) => (
          <SpotlightCard 
            key={i} 
            glowColor="orange"
            className="border-white/5 hover:border-brand-orange/30 transition-all h-auto"
            customSize
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-success' : 'text-white/40'}`}>
                {stat.trend}
              </span>
            </div>
            <div className="text-3xl font-display font-black italic mb-1 tracking-tighter">{stat.value}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</div>
          </SpotlightCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12 relative z-10">
        {/* Sales Chart */}
        <div className="lg:col-span-2 glass-card p-8 bg-brand-charcoal/40 backdrop-blur-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm tracking-widest uppercase font-bold text-white/60">{t.districtPerformance}</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-orange rounded-full shadow-[0_0_10px_#FF4D00]" />
                <span className="text-[10px] font-bold text-white/40 uppercase">{t.salesVolume}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-white/10 rounded-full" />
                <span className="text-[10px] font-bold text-white/40 uppercase">Baseline</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DASHBOARD_DATA.sales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 'bold' }} 
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#FF4D00', fontWeight: 'bold' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {DASHBOARD_DATA.sales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#FF4D00' : '#ffffff10'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Transactions */}
        <div className="glass-card p-8">
          <h3 className="text-sm tracking-widest uppercase font-bold text-white/60 mb-8">{t.liveTransactions}</h3>
          <div className="space-y-6">
            {DASHBOARD_DATA.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
                    <PackageCheck size={18} className="text-white/40 group-hover:text-brand-orange" />
                  </div>
                  <div>
                    <div className="text-xs font-bold group-hover:text-brand-orange transition-colors">{tx.part}</div>
                    <div className="text-[10px] text-white/30">{tx.shop}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-brand-orange">{tx.amount}</div>
                  <div className="text-[10px] text-white/20">{tx.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
            {t.viewAllTransactions}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inventory Area Chart */}
        <div className="lg:col-span-1 glass-card p-8">
          <h3 className="text-sm tracking-widest uppercase font-bold text-white/60 mb-8">{t.inventoryFlux}</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DASHBOARD_DATA.inventory}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4D00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF4D00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="count" stroke="#FF4D00" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <div className="text-xl font-display font-black italic">8,420</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{t.totalSkus}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-display font-black italic text-success">92%</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{t.turnoverRate}</div>
            </div>
          </div>
        </div>

        {/* Mechanic Leaderboard */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-sm tracking-widest uppercase font-bold text-white/60 mb-8">{t.topPerformingGarages}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-white/20 border-b border-white/5">
                  <th className="pb-4 font-bold">{t.garageName}</th>
                  <th className="pb-4 font-bold">{t.region}</th>
                  <th className="pb-4 font-bold">{t.totalOrders}</th>
                  <th className="pb-4 font-bold">{t.rating}</th>
                  <th className="pb-4 font-bold text-right">{t.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {DASHBOARD_DATA.topMechanics.map((mech, i) => (
                  <tr key={i} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="text-xs font-bold group-hover:text-brand-orange transition-colors">{mech.name}</div>
                    </td>
                    <td className="py-4 text-xs text-white/40">{mech.location}</td>
                    <td className="py-4 text-xs font-mono font-bold">{mech.orders}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-brand-orange" />
                        <span className="text-xs font-bold">{mech.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-brand-orange hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  ), [lang]);

  const SavedView = useMemo(() => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-display font-black italic tracking-tighter uppercase mb-2">{t.saved} <span className="text-brand-orange">Shops</span></h1>
        <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Your Curated Automotive Network</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOPS_DATA.slice(0, 3).map((shop) => (
          <SpotlightCard key={shop.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                <Navigation className="text-brand-orange" size={24} />
              </div>
              <button className="text-brand-orange">
                <Heart className="fill-brand-orange" size={20} />
              </button>
            </div>
            <h3 className="text-xl font-display font-black italic mb-1">{shop.name}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">{shop.address}</p>
          </SpotlightCard>
        ))}
      </div>
    </motion.div>
  ), [t.saved]);

  const HomeView = useMemo(() => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      {/* Hero Section */}
      <section className="relative py-10 md:py-24 overflow-hidden rounded-2xl md:rounded-3xl bg-brand-charcoal border border-white/5 group">
        {/* Cinematic 3D Background - Positioned to the right */}
        <div 
          onMouseEnter={() => setIsGlobeHovered(true)}
          onMouseLeave={() => setIsGlobeHovered(false)}
          className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-90 md:opacity-30 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none scale-75 md:scale-100 origin-top-right"
        >
          <TechGlobe glow={isMobile || isGlobeHovered} />
        </div>
        
        <div className="relative z-10 px-5 md:px-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-lg text-brand-orange text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-4 md:mb-8 backdrop-blur-md">
              <Cpu size={10} className={isAiLoading ? 'animate-pulse' : ''} />
              <span>{lang === 'EN' ? 'AI-Powered HyperLocal Network' : 'AI-மூலம் இயங்கும் உள்ளூர் நெட்வொர்க்'}</span>
            </div>
            <h1 className="text-3xl sm:text-6xl md:text-8xl leading-[1] md:leading-[0.85] mb-4 md:mb-8 italic font-black tracking-tighter">
              {t.findParts} <br />
              <span className="text-brand-orange drop-shadow-[0_0_20px_rgba(255,77,0,0.5)]">{t.instantly}</span>
            </h1>
            
            <p className="text-xs md:text-lg text-white/50 mb-6 md:mb-10 leading-relaxed max-w-lg">
              {t.heroSubtitle.replace('{district}', t.districts[selectedDistrict as keyof typeof t.districts])}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <PromptInputBox 
                onSend={(q) => setQuickStrikeQuery(q)} 
                placeholder={t.searchPlaceholder}
                user={user}
                isAuthLoading={isAuthLoading}
                onShowLogin={handleShowLogin}
                onCameraClick={() => {
                  setHardwareTab('camera');
                  setShowHardware(true);
                }}
                onDriveClick={() => {
                  setHardwareTab('drive');
                  setShowHardware(true);
                }}
              />
            </div>

            <AnimatePresence>
              {quickStrikeQuery && (
                <QuickStrikeResult 
                  query={quickStrikeQuery} 
                  onClose={() => setQuickStrikeQuery(null)} 
                />
              )}
            </AnimatePresence>

            {aiResponse && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 p-6 glass-card border-brand-orange/30 bg-brand-orange/5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <AnimatedStateIcon 
                    state={isAiLoading ? 'loading' : (isSpeaking ? 'playing' : 'success')} 
                    size={16} 
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">AI Diagnostic Node</span>
                </div>
                <p className="text-sm leading-relaxed text-white/80 italic">{aiResponse}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Decorative Atmospheric Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-brand-charcoal via-transparent to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/10 blur-[150px] rounded-full animate-pulse" />
        </div>
      </section>

      {/* Categories */}
      <BentoGrid>
        {[
          { name: t.categories.engine, icon: EngineIcon, color: 'text-brand-orange', glowColor: 'orange' as const },
          { name: t.categories.brakes, icon: BrakesIcon, color: 'text-brand-accent', glowColor: 'blue' as const },
          { name: t.categories.electrical, icon: ElectricalIcon, color: 'text-success', glowColor: 'green' as const },
          { name: t.categories.suspension, icon: SuspensionIcon, color: 'text-white', glowColor: 'purple' as const },
          { name: t.categories.bodyParts, icon: BodyPartsIcon, color: 'text-brand-orange', glowColor: 'red' as const },
          { name: t.categories.tyres, icon: TyresIcon, color: 'text-brand-accent', glowColor: 'orange' as const },
        ].map((cat, i) => (
          <BentoItem key={i} {...cat} />
        ))}
      </BentoGrid>

      {/* Promo Banner */}
      <div className="relative h-40 md:h-48 rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer">
        <img 
          src="https://picsum.photos/seed/auto-parts/1200/400" 
          alt="Promo" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal via-brand-charcoal/60 to-transparent p-6 md:p-10 flex flex-col justify-center">
          <div className="text-brand-orange font-bold text-[8px] md:text-[10px] uppercase tracking-widest mb-1 md:mb-2">{lang === 'EN' ? 'Limited Time Offer' : 'குறைந்த கால சலுகை'}</div>
          <h2 className="text-xl md:text-3xl font-black italic mb-2 md:mb-4">{t.promoTitle} <br /> <span className="text-brand-orange">{t.promoDiscount}</span></h2>
          <button className="w-fit bg-white text-brand-charcoal px-4 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl font-bold text-[8px] md:text-[10px] uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all">
            {t.claimNow}
          </button>
        </div>
      </div>

      {/* Shops Near You */}
      <section className="relative mb-8 md:mb-12 overflow-hidden rounded-2xl md:rounded-3xl glass-card p-6 md:p-12 bg-brand-charcoal/40 backdrop-blur-2xl border-white/5">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-20 md:opacity-30 pointer-events-none">
          <Globe />
        </div>
        
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand-orange rounded-full animate-pulse shadow-[0_0_10px_#FF4D00]" />
            <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-orange">{t.shopsNearYou}</h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-display font-black italic mb-4 md:mb-8 tracking-tighter leading-none">
            CONNECTING YOU TO THE <br />
            <span className="text-brand-orange">BEST HUBS</span> IN TAMIL NADU
          </h3>
          <p className="text-xs md:text-sm text-white/40 font-medium mb-6 md:mb-10 leading-relaxed max-w-md">
            Real-time access to authorized spare parts dealers across the Coimbatore-Salem corridor. 
            Verified inventory, instant quotes, and local delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <NeonButton variant="neon" glowColor="255, 77, 0" className="px-6 md:px-8 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl">
              EXPLORE NETWORK
            </NeonButton>
            <NeonButton variant="outline" className="px-6 md:px-8 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-xl">
              {t.viewMap}
            </NeonButton>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
        {SHOPS_DATA.filter(s => s.district === selectedDistrict).slice(0, 4).map((shop) => (
          <SpotlightCard 
            key={shop.id} 
            glowColor="orange"
            className="p-5 md:p-6 group cursor-pointer border-white/5 hover:border-brand-orange/30 transition-all h-auto"
            customSize
          >
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                <Store className="w-[18px] h-[18px] md:w-5 md:h-5 text-white/40 group-hover:text-brand-orange" />
              </div>
              <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                <Star size={10} /> {shop.rating}
              </div>
            </div>
            <h3 className="text-sm md:text-base font-bold mb-1 group-hover:text-brand-orange transition-colors line-clamp-1">{shop.name}</h3>
            <p className="text-[9px] md:text-[10px] text-white/40 mb-3 md:mb-4 flex items-center gap-1 line-clamp-2">
              <MapPin size={10} className="text-brand-orange" /> {shop.address}
            </p>
            <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/5">
              <span className="text-[9px] md:text-[10px] font-bold text-white/20 uppercase tracking-widest">{shop.phone ? t.verified : t.local}</span>
              <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${shop.status === 'Open' ? 'text-success' : 'text-error'}`}>
                {shop.status === 'Open' ? t.openNow : t.closedNow}
              </span>
            </div>
          </SpotlightCard>
        ))}
      </div>
      
    </motion.div>
  ), [selectedDistrict, searchQuery, lang, quickStrikeQuery]);

  if (showIntro) {
    return <IntroSequence onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen font-sans bg-brand-charcoal text-white selection:bg-brand-orange flex overflow-hidden relative">
      {/* Cinematic Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      {/* Sidebar - Hidden on mobile, shown on md+ */}
      <aside className="hidden md:flex w-20 lg:w-64 border-r border-white/5 flex-col bg-brand-charcoal/50 backdrop-blur-xl z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.3)] shrink-0">
            <SpareGridLogo className="text-white w-6 h-6" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <span className="text-xl font-display font-black tracking-tighter italic block leading-none">SPAREGRID</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-brand-orange font-bold whitespace-nowrap">HyperLocal Network</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: 'home', label: t.home, icon: Gauge },
            { id: 'search', label: t.searchParts, icon: Search },
            { id: 'map', label: t.shopsMap, icon: Navigation },
            { id: 'saved', label: t.saved, icon: Heart },
            { id: 'cart', label: t.cart, icon: ShoppingCart },
            { id: 'dashboard', label: t.dashboard, icon: Network },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-brand-orange text-white shadow-[0_10px_20px_rgba(255,77,0,0.2)]' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-white' : 'group-hover:text-brand-orange'} />
              <span className="hidden lg:block text-[11px] uppercase tracking-[0.2em] font-black">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          {user ? (
            <UserProfile user={user} onSignOut={handleSignOut}>
              <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white transition-all group">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="hidden lg:block text-[11px] uppercase tracking-[0.2em] font-black">{t.profile}</span>
              </button>
            </UserProfile>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white transition-all group"
            >
              <User size={22} className="group-hover:text-brand-orange" />
              <span className="hidden lg:block text-[11px] uppercase tracking-[0.2em] font-black">{t.profile}</span>
            </button>
          )}
        </div>
      </aside>

      {/* Bottom Navigation - Shown only on mobile */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-lg">
        <LimelightNav 
          items={[
            { id: 'home', icon: <Gauge />, label: t.home, onClick: () => setActiveTab('home') },
            { id: 'search', icon: <Search />, label: t.searchParts, onClick: () => setActiveTab('search') },
            { id: 'map', icon: <Navigation />, label: t.shopsMap, onClick: () => setActiveTab('map') },
            { id: 'saved', icon: <Heart />, label: t.saved, onClick: () => setActiveTab('saved') },
            { id: 'dashboard', icon: <Network />, label: (t as any).network, onClick: () => setActiveTab('dashboard') },
          ]} 
          defaultActiveIndex={[
            'home', 'search', 'map', 'saved', 'dashboard'
          ].indexOf(activeTab)}
          className="w-full bg-brand-charcoal/80 backdrop-blur-xl border-white/5 px-1"
          iconContainerClassName="p-3"
          limelightClassName="bg-brand-orange shadow-[0_0_20px_rgba(255,77,0,0.5)]"
        />
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-sm">
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute -top-12 right-0 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <SignInCard onLoginSuccess={handleLoginSuccess} />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast System */}
      <ToastBasic />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 md:h-20 flex items-center justify-between px-2 md:px-8 bg-brand-charcoal/30 backdrop-blur-md shrink-0 relative z-50">
          <div className="flex items-center gap-1.5 md:gap-8 overflow-x-auto scrollbar-hide pr-2">
            <div className="flex items-center gap-1.5 md:gap-3 bg-white/5 px-2 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl border border-white/10 shrink-0">
              <MapPin className="w-3 md:w-4 h-3 md:h-4 text-brand-orange" />
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-[10px] md:text-[13px] font-black uppercase tracking-[0.05em] md:tracking-[0.15em] focus:outline-none cursor-pointer max-w-[100px] md:max-w-none truncate"
              >
                {DISTRICTS.map(d => <option key={d} value={d} className="bg-brand-charcoal">{t.districts[d as keyof typeof t.districts]}</option>)}
              </select>
            </div>
            
            {/* Language Selector - Visible on mobile as a compact toggle */}
            <div className="flex items-center gap-1.5 md:gap-3 text-[10px] md:text-[13px] font-black text-white/60 uppercase tracking-[0.05em] md:tracking-[0.2em] shrink-0">
              <span className="hidden sm:inline">{t.language}:</span>
              <div className="flex bg-white/5 p-0.5 md:p-1 rounded-lg border border-white/10">
                <button 
                  onClick={() => setLang('EN')}
                  className={`transition-all px-1.5 md:px-2 py-0.5 md:py-1 rounded-md ${lang === 'EN' ? 'bg-brand-orange text-white' : 'hover:text-brand-orange'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang('TA')}
                  className={`transition-all px-1.5 md:px-2 py-0.5 md:py-1 rounded-md ${lang === 'TA' ? 'bg-brand-orange text-white' : 'hover:text-brand-orange'}`}
                >
                  TA
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border transition-all duration-300 group ${
                isChatOpen 
                  ? 'bg-brand-orange/20 border-brand-orange/50 text-brand-orange shadow-[0_0_15px_rgba(255,77,0,0.2)]' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:border-brand-orange/30 hover:text-white'
              }`}
            >
              <Zap size={14} className={isChatOpen ? 'text-brand-orange' : 'group-hover:text-brand-orange'} />
              <span className="text-[11px] md:text-[13px] font-black uppercase tracking-widest">{(t as any).aiAssist}</span>
              {isChatOpen && <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-orange rounded-full border border-brand-charcoal shadow-[0_0_10px_rgba(255,77,0,0.5)]"></span>}
            </button>
            <div 
              className="flex items-center gap-1.5 md:gap-4 cursor-pointer"
              onClick={() => !user && setShowLogin(true)}
            >
              {user ? (
                <UserProfile user={user} onSignOut={handleSignOut} />
              ) : (
                <div className="flex items-center gap-1.5 md:gap-3">
                  <div className="text-right hidden xs:block">
                    <div className="text-[9px] md:text-[12px] font-bold uppercase tracking-widest text-white/60">{t.guestUser}</div>
                    <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-tighter text-brand-orange">{lang === 'EN' ? 'Login' : 'உள்நுழைய'}</div>
                  </div>
                  <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-brand-orange to-brand-accent p-[1px] shadow-[0_0_15px_rgba(255,77,0,0.2)]">
                    <div className="w-full h-full rounded-lg md:rounded-xl bg-brand-charcoal flex items-center justify-center">
                      <User size={14} className="text-brand-orange md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Content */}
        <div 
          ref={(el) => { scrollContainerRef.current = el; }}
          className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-8 pb-24 md:pb-8"
        >
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && HomeView}
              {activeTab === 'dashboard' && CommandCenterView}
              {activeTab === 'saved' && SavedView}
              {activeTab === 'search' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <SearchPageView />
                </motion.div>
              )}
              {activeTab === 'map' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <h1 className="text-4xl font-display font-black italic tracking-tighter uppercase mb-2">Shops <span className="text-brand-orange">Map</span></h1>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Hyperlocal Spare Parts Network</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="glass-card px-4 py-2 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Real-time Tracking</span>
                      </div>
                    </div>
                  </div>
                  <GoogleMapsView className="h-[70vh] rounded-3xl overflow-hidden border border-white/5" />
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-card p-6">
                      <div className="text-brand-orange font-bold text-[10px] uppercase tracking-widest mb-2">Verified Shops</div>
                      <div className="text-3xl font-display font-black italic">{SHOPS_DATA.length}</div>
                    </div>
                    <div className="glass-card p-6">
                      <div className="text-brand-orange font-bold text-[10px] uppercase tracking-widest mb-2">Active Districts</div>
                      <div className="text-3xl font-display font-black italic">{DISTRICTS.length}</div>
                    </div>
                    <div className="glass-card p-6">
                      <div className="text-brand-orange font-bold text-[10px] uppercase tracking-widest mb-2">Avg. Delivery</div>
                      <div className="text-3xl font-display font-black italic">45 MIN</div>
                    </div>
                  </div>
                </motion.div>
              )}
              {activeTab !== 'home' && activeTab !== 'dashboard' && activeTab !== 'map' && activeTab !== 'saved' && activeTab !== 'search' && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-[60vh] text-center"
                >
                  <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-white/20">
                    <BarChart3 size={40} />
                  </div>
                  <h2 className="text-2xl italic font-black mb-2 uppercase tracking-tighter">{activeTab} View</h2>
                  <p className="text-white/40 text-sm uppercase tracking-widest font-bold">{t.underDeployment}</p>
                </motion.div>
              )}
            </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 md:py-20 border-t border-white/5 mt-12 md:mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 pt-6 md:pt-8">
          <div className="flex items-center gap-3">
            <SpareGridLogo className="text-brand-orange w-5 h-5 md:w-6 md:h-6" />
            <span className="text-lg md:text-xl font-display font-black tracking-tighter italic">SPAREGRID</span>
          </div>
          <div className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/20 font-bold text-center">
            {t.allRightsReserved}
          </div>
          <div className="flex gap-4 md:gap-6 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/40">
            <a href="#" className="hover:text-white transition-colors">{t.privacy}</a>
            <a href="#" className="hover:text-white transition-colors">{t.terms}</a>
            <a href="#" className="hover:text-white transition-colors">{t.contact}</a>
          </div>
        </div>
      </footer>
          </div>
        </div>
      </main>
      <AnimatePresence>
        {showHardware && (
          <HardwareIntegrations 
            onClose={() => setShowHardware(false)} 
            initialTab={hardwareTab}
          />
        )}
      </AnimatePresence>

      <ChatBot lang={lang} isOpen={isChatOpen} onOpenChange={setIsChatOpen} hideToggle={true} />
    </div>
  );
}
