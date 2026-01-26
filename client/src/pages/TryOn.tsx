import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { Camera, RefreshCw, Move, Maximize2, Minimize2, AlertCircle } from 'lucide-react';

export default function TryOn() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  
  // Overlay controls
  const [position, setPosition] = useState({ x: 50, y: 40 }); // Percentage
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Drag logic
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x, y });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-32 pb-20 container">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-4">
            TRY-ON <span className="text-primary italic">VIRTUAL</span>
          </h1>
          <p className="font-body text-gray-400 max-w-2xl mx-auto text-lg">
            Experimente nossa tecnologia antes de comprar. Use sua câmera para ver como os modelos ZUNO se ajustam ao seu rosto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Camera Area */}
          <div className="lg:col-span-8 bg-black border border-white/10 relative aspect-video overflow-hidden clip-corner group">
            {!stream ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5">
                <Camera className="w-16 h-16 text-gray-600 mb-4" />
                <p className="font-display text-gray-400 mb-6">ATIVE A CÂMERA PARA COMEÇAR</p>
                <Button 
                  onClick={startCamera}
                  className="bg-primary text-black hover:bg-white font-display font-bold px-8 py-6 clip-corner"
                >
                  INICIAR CÂMERA
                </Button>
                {error && (
                  <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="relative w-full h-full cursor-move"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                
                {/* Glasses Overlay */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={{ 
                    left: `${position.x}%`, 
                    top: `${position.y}%`,
                    width: `${40 * scale}%`
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <img 
                    src={selectedProduct.image} 
                    alt="Glasses Overlay" 
                    className="w-full drop-shadow-2xl filter brightness-110 contrast-110"
                  />
                  {/* Guides */}
                  <div className="absolute inset-0 border-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/80 backdrop-blur px-6 py-3 rounded-full border border-white/10">
                  <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="text-white hover:text-primary"><Minimize2 className="w-5 h-5" /></button>
                  <span className="font-display text-xs text-gray-400 flex items-center">TAMANHO</span>
                  <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="text-white hover:text-primary"><Maximize2 className="w-5 h-5" /></button>
                  <div className="w-[1px] h-5 bg-white/20 mx-2"></div>
                  <button onClick={() => setPosition({ x: 50, y: 40 })} className="text-white hover:text-primary"><RefreshCw className="w-5 h-5" /></button>
                </div>
              </div>
            )}
          </div>

          {/* Product Selection */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="bg-card border border-white/10 p-6 flex-1">
              <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                <Move className="w-5 h-5 text-primary" />
                SELECIONE O MODELO
              </h3>
              
              <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`cursor-pointer border p-4 transition-all ${
                      selectedProduct.id === product.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <div className="aspect-[4/3] mb-2 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full object-contain" />
                    </div>
                    <p className={`font-display font-bold text-sm text-center ${
                      selectedProduct.id === product.id ? 'text-primary' : 'text-gray-400'
                    }`}>
                      {product.name}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="font-display font-bold text-2xl text-white mb-2">{selectedProduct.name}</h4>
                <p className="font-body text-gray-400 text-sm mb-6">{selectedProduct.tagline}</p>
                <Button className="w-full bg-white text-black hover:bg-primary font-display font-bold clip-corner">
                  COMPRAR AGORA - R$ {selectedProduct.price.toFixed(2)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
