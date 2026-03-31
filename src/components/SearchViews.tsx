import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Filter, 
  Car, 
  Settings, 
  ArrowRight,
  Star,
  Zap,
  CheckCircle2,
  Info,
  Layers,
  Search,
  History,
  TrendingUp,
  Tag,
  X,
  Wind,
  Droplets
} from 'lucide-react';
import { SHOPS_DATA } from '../data/shops';

// --- Quick Strike Result (Home Page) ---
export const QuickStrikeResult = ({ query, onClose }: { query: string; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="w-full max-w-2xl mx-auto mt-8 glass-card overflow-hidden border-brand-orange/20"
    >
      <div className="p-4 bg-brand-orange/10 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-orange">Quick Strike Result</div>
            <div className="text-xs text-white/60">Best match for "{query}"</div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
          <Info size={16} />
        </button>
      </div>

      <div className="p-6 flex flex-col md:flex-row gap-8 items-center">
        <div className="w-32 h-32 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
          <Settings size={48} className="text-brand-orange/40" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-display font-black italic uppercase tracking-tight">Premium Brake Pads</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Compatible with Maruti Suzuki Swift (2018+)</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-display font-black text-brand-orange">₹1,250</div>
              <div className="text-[9px] text-success font-bold uppercase tracking-widest">In Stock</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-white/60">
              <MapPin size={14} className="text-brand-orange" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Arun Auto Works (1.2km)</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Clock size={14} className="text-brand-orange" />
              <span className="text-[10px] font-bold uppercase tracking-widest">15 Mins Away</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-brand-orange text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-orange/80 transition-all shadow-[0_10px_20px_rgba(255,77,0,0.2)]">
              Reserve Now
            </button>
            <button className="px-6 border border-white/10 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
              Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Full Search Page View ---
export const SearchPageView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'compare'>('grid');
  const [searchStep, setSearchStep] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [selection, setSelection] = useState({
    maker: '',
    model: '',
    year: '',
    modification: ''
  });

  const makers = [
    'MARUTI SUZUKI', 'HYUNDAI', 'TATA', 'MAHINDRA', 'TOYOTA', 'HONDA', 'KIA', 'MG', 
    'SKODA', 'VOLKSWAGEN', 'RENAULT', 'NISSAN', 'JEEP', 'FORD', 'CHEVROLET', 'FIAT', 
    'ASHOK LEYLAND', 'AUDI', 'BMW', 'BYD', 'CITROEN', 'DATSUN', 'FORCE', 'ISUZU', 
    'JAGUAR', 'LAND ROVER', 'LEXUS', 'MERCEDES-BENZ', 'MINI', 'MITSUBISHI', 'PORSCHE', 'VOLVO'
  ].sort();

  const models = {
    'MARUTI SUZUKI': ['SWIFT', 'BALENO', 'DZIRE', 'ERTIGA', 'WAGON R', 'ALTO', 'VITARA BREZZA', 'CELERIO', 'IGNIS', 'S-CROSS', 'XL6', 'GRAND VITARA', 'JIMNY', 'FRONX'],
    'HYUNDAI': ['I20', 'CRETA', 'VERNA', 'VENUE', 'GRAND I10', 'SANTRO', 'ELANTRA', 'TUCSON', 'ALCAZAR', 'EXTER', 'IONIQ 5'],
    'TATA': ['NEXON', 'PUNCH', 'ALTROZ', 'TIAGO', 'HARRIER', 'SAFARI', 'TIGOR', 'NANO', 'INDICA', 'INDIGO', 'SUMO', 'SAFARI STORME'],
    'MAHINDRA': ['SCORPIO', 'XUV700', 'THAR', 'BOLERO', 'XUV300', 'MARAZZO', 'KUV100', 'ALTURAS G4', 'TUV300', 'XUV400'],
    'TOYOTA': ['INNOVA CRYSTA', 'FORTUNER', 'GLANZA', 'URBAN CRUISER', 'CAMRY', 'HILUX', 'VELLFIRE', 'LAND CRUISER'],
    'HONDA': ['CITY', 'AMAZE', 'JAZZ', 'WR-V', 'CIVIC', 'CR-V', 'ELEVATE'],
    'FIAT': ['PUNTO', 'LINEA', 'PALIO', 'AVVENTURA', 'ABARTH', '500', 'PETRA', 'SIENA', 'UNO'],
    'KIA': ['SELTOS', 'SONET', 'CARENS', 'CARNIVAL', 'EV6'],
    'RENAULT': ['KWID', 'TRIBER', 'KIGER', 'DUSTER', 'CAPTUR', 'LODGY'],
    'SKODA': ['KUSHAQ', 'SLAVIA', 'OCTAVIA', 'SUPERB', 'KODIAQ', 'RAPID', 'LAURA', 'YETI'],
    'MG': ['HECTOR', 'ASTOR', 'ZS EV', 'GLOSTER', 'COMET EV'],
    'VOLKSWAGEN': ['VIRTUS', 'TAIGUN', 'TIGUAN', 'POLO', 'VENTO', 'JETTA', 'PASSAT', 'AMEO'],
    'NISSAN': ['MAGNITE', 'KICKS', 'SUNNY', 'TERRANO', 'MICRA', 'EVALIA'],
    'JEEP': ['COMPASS', 'MERIDIAN', 'WRANGLER', 'GRAND CHEROKEE'],
    'FORD': ['ECOSPORT', 'ENDEAVOUR', 'FIGO', 'ASPIRE', 'FREESTYLE', 'FIESTA', 'MUSTANG'],
    'CHEVROLET': ['BEAT', 'CRUZE', 'SPARK', 'SAIL', 'ENJOY', 'CAPTIVA', 'TAVERA', 'OPTRA'],
    'AUDI': ['A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'E-TRON'],
    'BMW': ['2 SERIES', '3 SERIES', '5 SERIES', '7 SERIES', 'X1', 'X3', 'X5', 'X7', 'Z4', 'IX'],
    'MERCEDES-BENZ': ['A-CLASS', 'C-CLASS', 'E-CLASS', 'S-CLASS', 'GLA', 'GLC', 'GLE', 'GLS', 'EQB', 'EQC', 'EQS'],
    'ASHOK LEYLAND': ['DOST', 'STILE'],
    'FORCE': ['GURKHA', 'TRAX', 'CITI-LINE'],
    'ISUZU': ['D-MAX', 'V-CROSS', 'MU-X'],
    'LAND ROVER': ['DEFENDER', 'DISCOVERY', 'RANGE ROVER', 'EVOQUE', 'VELAR'],
    'VOLVO': ['XC40', 'XC60', 'XC90', 'S60', 'S90', 'C40 RECHARGE'],
    'BYD': ['ATTO 3', 'E6', 'SEAL'],
    'DATSUN': ['GO', 'GO+', 'REDI-GO'],
    'JAGUAR': ['XE', 'XF', 'XJ', 'F-PACE', 'I-PACE', 'F-TYPE'],
    'LEXUS': ['ES', 'LS', 'NX', 'RX', 'LX', 'LC'],
    'MINI': ['COOPER', 'COUNTRYMAN', 'CLUBMAN'],
    'MITSUBISHI': ['PAJERO SPORT', 'OUTLANDER', 'LANCER', 'CEDIA', 'MONTERO'],
    'PORSCHE': ['911', 'CAYENNE', 'MACAN', 'PANAMERA', 'TAYCAN', '718'],
    'CITROEN': ['C3', 'C3 AIRCORSS', 'C5 AIRCROSS', 'E-C3']
  };

  const years = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());

  const modifications = [
    '1.2L MT/Petrol/FIRE/BS3',
    '1.2L MT/Petrol/FIRE/BS4',
    '1.3L MT/Diesel/MULTIJET/BS3',
    '1.3L MT/Diesel/MULTIJET/BS4',
    '1.4L MT/Petrol/FIRE/BS3',
    '1.4L MT/Petrol/FIRE/BS4',
    '1.5L AT/Petrol/BS6',
    '2.0L MT/Diesel/BS6',
    '1.0L Turbo MT/Petrol',
    '1.2L Turbo AT/Petrol',
    'EV/Electric/72V',
    'CNG/Manual/Factory Fitted'
  ];

  const categoryGrid = [
    { id: 'maintenance', name: 'Maintenance Service Parts', icon: Settings },
    { id: 'filters', name: 'Filters', icon: Filter },
    { id: 'windscreen', name: 'Windscreen Cleaning System', icon: Zap },
    { id: 'accessories', name: 'Car Accessories', icon: Tag },
    { id: 'lighting', name: 'Lighting', icon: Zap },
    { id: 'cables', name: 'Control Cables', icon: Layers },
    { id: 'braking', name: 'Brake System', icon: ShieldCheck },
    { id: 'bearings', name: 'Bearings', icon: Settings },
    { id: 'clutch', name: 'Clutch System', icon: Layers },
    { id: 'electric', name: 'Electric Components', icon: Zap },
    { id: 'engine', name: 'Engine', icon: Settings },
    { id: 'cooling', name: 'Engine Cooling System', icon: Zap },
    { id: 'exhaust', name: 'Exhaust System', icon: Wind },
    { id: 'ac', name: 'Air Conditioning', icon: Wind },
    { id: 'fuel', name: 'Fuel Supply System', icon: Droplets },
    { id: 'gaskets', name: 'Gaskets and Sealing Rings', icon: Layers },
    { id: 'ignition', name: 'Ignition and Glowplug System', icon: Zap },
    { id: 'interior', name: 'Interior and comfort', icon: Car },
    { id: 'body', name: 'Body', icon: Car },
    { id: 'fluids', name: 'Oils and Fluids', icon: Droplets },
    { id: 'pipes', name: 'Pipes and Hoses', icon: Wind },
    { id: 'repair', name: 'Repair Kits', icon: Settings },
    { id: 'sensors', name: 'Sensors Relays and Control units', icon: Zap },
    { id: 'steering', name: 'Steering', icon: Settings },
    { id: 'suspension', name: 'Suspension and Arms', icon: Layers },
    { id: 'towbar', name: 'Towbar Parts', icon: Settings },
    { id: 'transmission', name: 'Transmission', icon: Settings },
    { id: 'trims', name: 'Trims', icon: Layers },
    { id: 'tyres', name: 'Tyres and Alloys', icon: Settings },
    { id: 'universal', name: 'Universal', icon: Star },
    { id: 'wheels', name: 'Wheels', icon: Settings },
    { id: 'belts', name: 'Belts Chains and Rollers', icon: Layers },
    { id: 'workshop', name: 'Workshop Consumables', icon: Settings },
    { id: 'care', name: 'Car Care & Detailing', icon: Star },
  ];

  const categories = [
    { id: 'engine', name: 'Engine & Drivetrain', sub: ['Pistons', 'Belts', 'Gaskets', 'Clutch'] },
    { id: 'braking', name: 'Braking System', sub: ['Pads', 'Discs', 'ABS Sensors', 'Brake Fluid'] },
    { id: 'suspension', name: 'Suspension & Steering', sub: ['Shocks', 'Bushings', 'Tie Rods'] },
    { id: 'electrical', name: 'Electrical & Lighting', sub: ['Headlights', 'Alternators', 'Batteries'] },
    { id: 'body', name: 'Body & Trim', sub: ['Bumpers', 'Mirrors', 'Panels'] },
  ];

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleSelection = (key: string, value: string) => {
    setSelection(prev => ({ ...prev, [key]: value }));
    if (key === 'modification') {
      setShowCategoryModal(true);
    } else {
      setSearchStep(prev => prev + 1);
    }
  };

  const resetSelection = () => {
    setSelection({ maker: '', model: '', year: '', modification: '' });
    setSearchStep(0);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Precision Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-display font-black italic tracking-tighter uppercase mb-2">Search by <span className="text-brand-orange">Vehicle</span></h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Technical Catalog & Compatibility Engine</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-2">Search by number plate:</div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="DL1AA2345" 
              className="bg-brand-charcoal border border-white/10 rounded-xl px-4 py-2 text-sm font-mono font-bold tracking-widest w-40 focus:outline-none focus:border-brand-orange/50"
            />
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-blue-600 rounded-l-xl flex flex-col items-center justify-center text-[6px] font-bold">
              <div className="w-3 h-2 bg-white/20 rounded-sm mb-0.5" />
              IND
            </div>
          </div>
          <button className="bg-brand-orange/20 p-2 rounded-xl text-brand-orange hover:bg-brand-orange hover:text-white transition-all">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Boodmo-style Multi-step Selection */}
      <div className="glass-card p-8 border-brand-orange/30 bg-brand-charcoal/40">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Step 1: Maker */}
          <div className="space-y-2">
            <select 
              value={selection.maker}
              onChange={(e) => handleSelection('maker', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-orange/50 appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-charcoal">Select Car Maker</option>
              {makers.map(m => <option key={m} value={m} className="bg-brand-charcoal">{m}</option>)}
            </select>
          </div>

          {/* Step 2: Model */}
          <div className={`space-y-2 transition-opacity ${searchStep < 1 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <select 
              value={selection.model}
              onChange={(e) => handleSelection('model', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-orange/50 appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-charcoal">Select Model Line</option>
              {selection.maker && (models as any)[selection.maker]?.map((m: string) => (
                <option key={m} value={m} className="bg-brand-charcoal">{m}</option>
              ))}
            </select>
          </div>

          {/* Step 3: Year */}
          <div className={`space-y-2 transition-opacity ${searchStep < 2 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <select 
              value={selection.year}
              onChange={(e) => handleSelection('year', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-orange/50 appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-charcoal">Select Year</option>
              {years.map(y => <option key={y} value={y} className="bg-brand-charcoal">{y}</option>)}
            </select>
          </div>

          {/* Step 4: Modification */}
          <div className={`space-y-2 transition-opacity ${searchStep < 3 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <select 
              value={selection.modification}
              onChange={(e) => handleSelection('modification', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-brand-orange/50 appearance-none cursor-pointer"
            >
              <option value="" className="bg-brand-charcoal">Select Modification</option>
              {modifications.map(m => <option key={m} value={m} className="bg-brand-charcoal">{m}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">
            <button className="text-[10px] font-bold uppercase tracking-widest text-brand-orange hover:underline">OEM Service Kit</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-brand-orange hover:underline">Aftermarket Service Kit</button>
            <button className="text-[10px] font-bold uppercase tracking-widest text-brand-orange hover:underline">Save Car in My Garage</button>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setShowCategoryModal(true);
                setHasSearched(true);
              }}
              className="bg-brand-orange text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(255,77,0,0.3)] hover:scale-105 transition-transform"
            >
              Search Parts
            </button>
            <button 
              onClick={() => setHasSearched(true)}
              className="bg-brand-accent text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(0,184,212,0.3)] hover:scale-105 transition-transform"
            >
              OEM Catalog
            </button>
          </div>
        </div>
      </div>

      {!hasSearched ? (
        /* Search by Category Section (Initial View) */
        <section className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-display font-black italic tracking-tighter uppercase">Search by <span className="text-brand-orange">Category</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categoryGrid.slice(0, 10).map((cat) => (
              <motion.button 
                key={cat.id}
                whileHover={{ y: -5 }}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setHasSearched(true);
                }}
                className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all group aspect-square"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <cat.icon size={32} className="text-white/40 group-hover:text-brand-orange transition-colors" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-center leading-tight text-white/60 group-hover:text-white">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
          <div className="flex justify-center pt-8">
            <button 
              onClick={() => setShowCategoryModal(true)}
              className="px-12 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Load more
            </button>
          </div>
        </section>
      ) : (
        /* Results View */
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar: Category Tree & Filters */}
          <aside className="space-y-6">
            <div className="glass-card p-6 space-y-6">
              {/* Category Tree */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4 flex items-center gap-2">
                  <Layers size={12} />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="space-y-1">
                      <button 
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-brand-orange/10 text-brand-orange' : 'hover:bg-white/5 text-white/60'}`}
                      >
                        {cat.name}
                        <ChevronRight size={14} className={`transition-transform ${selectedCategory === cat.id ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {selectedCategory === cat.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 space-y-1"
                          >
                            {cat.sub.map(sub => (
                              <button key={sub} className="w-full text-left p-2 text-[9px] text-white/40 hover:text-white transition-colors uppercase tracking-widest">
                                {sub}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-white/5" />

              {/* Advanced Filters */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <Filter size={12} />
                  Advanced Filters
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/60">Brand Tier</label>
                    <div className="grid grid-cols-1 gap-2">
                      {['OEM (Original)', 'OES (Premium)', 'Budget'].map(tier => (
                        <label key={tier} className="flex items-center gap-2 cursor-pointer group">
                          <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center group-hover:border-brand-orange transition-colors">
                            <div className="w-2 h-2 rounded-sm bg-brand-orange opacity-0 group-hover:opacity-20" />
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{tier}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/60">Proximity Radius</label>
                    <input type="range" className="w-full accent-brand-orange bg-white/5 h-1 rounded-full appearance-none cursor-pointer" />
                    <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-widest">
                      <span>1km</span>
                      <span>5km</span>
                      <span>25km+</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Search Results Area */}
          <main className="space-y-6">
            {/* Search Bar & View Toggles */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 group">
                <div className="absolute -inset-[1px] -z-10 overflow-hidden rounded-[calc(1rem+1px)] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-[1px]">
                  <div className="absolute inset-[-500%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,#FF4D00_360deg)]" />
                </div>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-orange transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by part name, number, or brand..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-orange/50 transition-all"
                />
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-brand-orange text-white' : 'text-white/40 hover:text-white'}`}
                >
                  Grid View
                </button>
                <button 
                  onClick={() => setViewMode('compare')}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'compare' ? 'bg-brand-orange text-white' : 'text-white/40 hover:text-white'}`}
                >
                  Side-by-Side
                </button>
              </div>
            </div>

            {/* Results Content */}
            <div className="grid gap-6">
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-6 group hover:border-brand-orange/30 transition-all"
                    >
                      <div className="flex gap-6">
                        <div className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                          <Settings size={32} className="text-white/20 group-hover:text-brand-orange/40 transition-colors" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-[8px] font-black text-brand-orange uppercase tracking-widest mb-1">OEM Parts</div>
                              <h4 className="text-sm font-bold uppercase tracking-tight">Brake Pad Set - Front</h4>
                            </div>
                            <div className="text-lg font-display font-black italic">₹1,850</div>
                          </div>
                          <div className="flex items-center gap-4 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><MapPin size={10} /> 2.4km</span>
                            <span className="flex items-center gap-1"><Clock size={10} /> 20m</span>
                          </div>
                          <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-brand-orange text-white text-[9px] font-black uppercase tracking-widest transition-all">
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-brand-orange/10 rounded-2xl border border-brand-orange/20">
                      <div className="text-[10px] font-black uppercase tracking-widest text-brand-orange">OEM Original</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Aftermarket (OES)</div>
                    </div>
                  </div>
                  
                  {[1, 2].map(i => (
                    <div key={i} className="grid grid-cols-2 gap-6">
                      <div className="glass-card p-6 border-brand-orange/20">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold uppercase">Maruti Genuine</h4>
                            <Star size={14} className="text-brand-orange fill-brand-orange" />
                          </div>
                          <div className="text-2xl font-display font-black italic">₹2,400</div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-[9px] text-white/60 uppercase tracking-widest">
                              <CheckCircle2 size={12} className="text-success" /> Perfect Fit Guarantee
                            </li>
                            <li className="flex items-center gap-2 text-[9px] text-white/60 uppercase tracking-widest">
                              <CheckCircle2 size={12} className="text-success" /> 6 Months Warranty
                            </li>
                          </ul>
                          <button className="w-full py-3 rounded-xl bg-brand-orange text-white text-[9px] font-black uppercase tracking-widest">Add to Cart</button>
                        </div>
                      </div>
                      <div className="glass-card p-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold uppercase">Bosch Premium</h4>
                            <div className="text-[8px] bg-white/10 px-2 py-1 rounded uppercase tracking-widest">Best Value</div>
                          </div>
                          <div className="text-2xl font-display font-black italic">₹1,650</div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-[9px] text-white/60 uppercase tracking-widest">
                              <CheckCircle2 size={12} className="text-success" /> High Performance
                            </li>
                            <li className="flex items-center gap-2 text-[9px] text-white/60 uppercase tracking-widest">
                              <CheckCircle2 size={12} className="text-success" /> 3 Months Warranty
                            </li>
                          </ul>
                          <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white/10">Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* Category Selection Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryModal(false)}
              className="absolute inset-0 bg-brand-charcoal/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] glass-card overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-brand-charcoal/50">
                <div>
                  <h2 className="text-2xl font-display font-black italic uppercase tracking-tight">Search <span className="text-brand-orange">Catalog</span></h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Selected Vehicle:</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                      {selection.maker} {selection.model} {selection.year} {selection.modification}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCategoryModal(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Search */}
              <div className="p-6 bg-brand-charcoal/30 border-b border-white/5">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-orange transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Type your query (e.g. Brake Pads, Oil Filter)..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-orange/50 transition-all"
                  />
                </div>
              </div>

              {/* Modal Content - Category Grid */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Select the required category of part:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {categoryGrid.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowCategoryModal(false);
                        setHasSearched(true);
                      }}
                      className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <cat.icon size={24} className="text-white/40 group-hover:text-brand-orange transition-colors" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight text-white/60 group-hover:text-white">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
