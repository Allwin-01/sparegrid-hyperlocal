
import React, { useState, useRef } from 'react';
import { Camera, Upload, HardDrive, X, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HardwareIntegrationsProps {
  onClose: () => void;
  initialTab?: 'camera' | 'upload' | 'drive';
}

export const HardwareIntegrations: React.FC<HardwareIntegrationsProps> = ({ onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'drive'>(initialTab || 'camera');
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        
        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false);
        setCapturedImage(URL.createObjectURL(file));
      }, 1500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-charcoal/90 backdrop-blur-xl"
    >
      <div className="w-full max-w-2xl glass-card overflow-hidden border-brand-orange/30">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-display font-black italic tracking-tighter uppercase">
            Hardware <span className="text-brand-orange">Integration</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-white/10">
          {[
            { id: 'camera', label: 'Visual Search', icon: Camera },
            { id: 'upload', label: 'File Upload', icon: Upload },
            { id: 'drive', label: 'Cloud Sync', icon: HardDrive },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'camera') startCamera();
              }}
              className={`flex-1 py-4 flex flex-col items-center gap-2 transition-all ${
                activeTab === tab.id ? 'bg-brand-orange/10 text-brand-orange border-b-2 border-brand-orange' : 'text-white/40 hover:text-white'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8 min-h-[400px] flex flex-col items-center justify-center relative">
          {activeTab === 'camera' && (
            <div className="w-full h-full flex flex-col items-center gap-6">
              {!capturedImage ? (
                <>
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-2 border-dashed border-brand-orange/30 pointer-events-none m-8 rounded-xl" />
                  </div>
                  <button 
                    onClick={capturePhoto}
                    className="w-16 h-16 rounded-full border-4 border-brand-orange flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-orange" />
                  </button>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Align part within the frame</p>
                </>
              ) : (
                <div className="w-full flex flex-col items-center gap-6">
                  <img src={capturedImage} className="w-full max-h-[300px] object-contain rounded-2xl border border-brand-orange/30" />
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCapturedImage(null)}
                      className="px-6 py-3 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Retake
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-brand-orange text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,77,0,0.3)]">
                      Analyze Part
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="w-full h-full flex flex-col items-center gap-8">
              <div className="w-full aspect-video border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-brand-orange/50 transition-all cursor-pointer relative">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFileUpload}
                  accept="image/*,application/pdf"
                />
                {isProcessing ? (
                  <Loader2 className="animate-spin text-brand-orange" size={48} />
                ) : (
                  <>
                    <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange">
                      <Upload size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold mb-1">Drop files here or click to upload</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">Supports JPG, PNG, PDF (Max 10MB)</p>
                    </div>
                  </>
                )}
              </div>
              {capturedImage && !isProcessing && (
                <div className="flex items-center gap-3 p-4 glass-card w-full border-success/30">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center text-success">
                    <Check size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">File Uploaded Successfully</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Ready for processing</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'drive' && (
            <div className="w-full h-full flex flex-col items-center gap-8 text-center">
              <div className="w-24 h-24 bg-brand-accent/10 rounded-3xl flex items-center justify-center text-brand-accent mb-4">
                <HardDrive size={48} />
              </div>
              <div>
                <h3 className="text-xl font-display font-black italic mb-2 tracking-tighter uppercase">Cloud <span className="text-brand-accent">Synchronization</span></h3>
                <p className="text-xs text-white/40 max-w-xs mx-auto leading-relaxed">
                  Seamlessly connect your Google Drive or Dropbox to sync inventory lists, invoices, and part catalogs across all your devices.
                </p>
              </div>
              <button className="px-8 py-4 bg-brand-accent text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(0,184,212,0.3)] hover:scale-105 transition-transform">
                Connect Google Drive
              </button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </motion.div>
  );
};
