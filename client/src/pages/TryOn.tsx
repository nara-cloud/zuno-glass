import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { products, Product } from '@/lib/products';
import { Move, AlertCircle, Loader2, ScanFace, Camera as CameraIcon, Sun, Cloud, Moon, History, Download, X } from 'lucide-react';

type Environment = 'default' | 'sunny' | 'cloudy' | 'night';

export default function TryOn() {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  
  // New Features State
  const [history, setHistory] = useState<Product[]>([]);
  const [environment, setEnvironment] = useState<Environment>('default');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Glasses positioning state
  const [glassesStyle, setGlassesStyle] = useState<React.CSSProperties>({
    display: 'none',
  });

  // Add to history when product changes
  useEffect(() => {
    setHistory(prev => {
      const newHistory = [selectedProduct, ...prev.filter(p => p.id !== selectedProduct.id)].slice(0, 5);
      return newHistory;
    });
  }, [selectedProduct]);

  const onResults = useCallback((results: Results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setGlassesStyle({ display: 'none' });
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const noseBridge = landmarks[168];

    if (!leftEye || !rightEye || !noseBridge) return;

    const centerX = noseBridge.x * 100;
    const centerY = noseBridge.y * 100;
    const dy = rightEye.y - leftEye.y;
    const dx = rightEye.x - leftEye.x;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const scale = distance * 4.5; 

    setGlassesStyle({
      display: 'block',
      position: 'absolute',
      left: `${centerX}%`,
      top: `${centerY}%`,
      width: '100%',
      transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`,
      transformOrigin: 'center center',
      pointerEvents: 'none',
      zIndex: 20, // Higher z-index to be above environment filters
    });
  }, []);

  useEffect(() => {
    let camera: Camera | null = null;
    let faceMesh: FaceMesh | null = null;

    if (isCameraActive && webcamRef.current && webcamRef.current.video) {
      setIsLoading(true);
      
      faceMesh = new FaceMesh({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults(onResults);

      if (webcamRef.current.video) {
        camera = new Camera(webcamRef.current.video, {
          onFrame: async () => {
            if (webcamRef.current?.video && faceMesh) {
              await faceMesh.send({ image: webcamRef.current.video });
              setIsLoading(false);
            }
          },
          width: 1280,
          height: 720,
        });
        
        camera.start()
          .catch(err => {
            console.error("Camera start error:", err);
            setError("Erro ao iniciar a câmera. Verifique permissões.");
            setIsLoading(false);
          });
      }
    }

    return () => {
      if (camera) camera.stop();
      if (faceMesh) faceMesh.close();
    };
  }, [isCameraActive, onResults]);

  const startCamera = () => {
    setIsCameraActive(true);
    setError(null);
  };

  const takePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Create a canvas to combine video frame and glasses
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            // 1. Draw video frame
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // 2. Apply environment filter if needed
            if (environment !== 'default') {
              ctx.save();
              if (environment === 'sunny') {
                ctx.fillStyle = '#ffaa00';
                ctx.globalAlpha = 0.15;
                ctx.globalCompositeOperation = 'overlay';
              } else if (environment === 'cloudy') {
                ctx.fillStyle = '#8899aa';
                ctx.globalAlpha = 0.2;
                ctx.globalCompositeOperation = 'hard-light';
              } else if (environment === 'night') {
                ctx.fillStyle = '#001133';
                ctx.globalAlpha = 0.5;
                ctx.globalCompositeOperation = 'multiply';
              }
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.restore();
            }

            // 3. Draw glasses
            // We need to parse the transform style to draw correctly on canvas
            // This is a simplified approximation for the screenshot
            if (glassesStyle.display !== 'none') {
              const glassesImg = new Image();
              glassesImg.crossOrigin = "Anonymous";
              glassesImg.onload = () => {
                ctx.save();
                
                // Parse percentage positions to pixels
                const x = (parseFloat(glassesStyle.left as string) / 100) * canvas.width;
                const y = (parseFloat(glassesStyle.top as string) / 100) * canvas.height;
                
                // Parse transform
                const transform = glassesStyle.transform as string;
                const rotateMatch = transform.match(/rotate\(([-\d.]+)deg\)/);
                const scaleMatch = transform.match(/scale\(([-\d.]+)\)/);
                
                const angle = rotateMatch ? parseFloat(rotateMatch[1]) * (Math.PI / 180) : 0;
                const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.scale(scale, scale);
                
                // Draw centered
                ctx.drawImage(glassesImg, -canvas.width / 2, -canvas.width * (glassesImg.height / glassesImg.width) / 2, canvas.width, canvas.width * (glassesImg.height / glassesImg.width));
                
                ctx.restore();
                setCapturedImage(canvas.toDataURL('image/jpeg'));
              };
              glassesImg.src = selectedProduct.image;
            } else {
              setCapturedImage(canvas.toDataURL('image/jpeg'));
            }
          };
          img.src = imageSrc;
        }
      }
    }
  };

  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `zuno-tryon-${selectedProduct.name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-32 pb-20 container">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-4">
            AI <span className="text-primary italic">TRY-ON</span>
          </h1>
          <p className="font-body text-gray-400 max-w-2xl mx-auto text-lg">
            Experimente, personalize o ambiente e compartilhe seu visual ZUNO.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
          {/* Main Experience Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-black border border-white/10 relative aspect-video overflow-hidden clip-corner group">
              {!isCameraActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5">
                  <ScanFace className="w-16 h-16 text-primary mb-4 animate-pulse" />
                  <p className="font-display text-gray-400 mb-6">ATIVE A CÂMERA PARA O RASTREAMENTO IA</p>
                  <Button 
                    onClick={startCamera}
                    className="bg-primary text-black hover:bg-white font-display font-bold px-8 py-6 clip-corner"
                  >
                    INICIAR EXPERIÊNCIA
                  </Button>
                  {error && (
                    <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    mirrored={true}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                  />
                  
                  {/* Environment Filters Overlay */}
                  <div className={`absolute inset-0 pointer-events-none transition-all duration-500 z-10 ${
                    environment === 'sunny' ? 'bg-orange-500/15 mix-blend-overlay' :
                    environment === 'cloudy' ? 'bg-slate-500/20 mix-blend-hard-light' :
                    environment === 'night' ? 'bg-blue-950/50 mix-blend-multiply' : ''
                  }`}></div>

                  {/* Loading Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="font-display text-white tracking-widest">CARREGANDO MODELO IA...</p>
                      </div>
                    </div>
                  )}

                  {/* Glasses Overlay */}
                  <div style={glassesStyle}>
                    <img 
                      src={selectedProduct.image} 
                      alt="Glasses Overlay" 
                      className="w-full drop-shadow-2xl filter brightness-110 contrast-110"
                    />
                  </div>

                  {/* Controls Overlay */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-30">
                    <div className="bg-black/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 flex gap-4">
                      <button 
                        onClick={() => setEnvironment('default')}
                        className={`p-2 rounded-full transition-colors ${environment === 'default' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
                        title="Normal"
                      >
                        <Sun className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setEnvironment('sunny')}
                        className={`p-2 rounded-full transition-colors ${environment === 'sunny' ? 'bg-orange-500 text-white' : 'text-orange-400 hover:bg-white/20'}`}
                        title="Ensolarado"
                      >
                        <Sun className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setEnvironment('cloudy')}
                        className={`p-2 rounded-full transition-colors ${environment === 'cloudy' ? 'bg-slate-400 text-white' : 'text-slate-400 hover:bg-white/20'}`}
                        title="Nublado"
                      >
                        <Cloud className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setEnvironment('night')}
                        className={`p-2 rounded-full transition-colors ${environment === 'night' ? 'bg-blue-900 text-white' : 'text-blue-400 hover:bg-white/20'}`}
                        title="Noite"
                      >
                        <Moon className="w-5 h-5" />
                      </button>
                    </div>

                    <Button 
                      onClick={takePhoto}
                      className="rounded-full w-14 h-14 bg-white text-black hover:bg-primary hover:scale-110 transition-all border-4 border-black/50"
                    >
                      <CameraIcon className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* History Bar */}
            {history.length > 0 && (
              <div className="bg-card border border-white/10 p-4">
                <div className="flex items-center gap-2 mb-3 text-gray-400 text-sm font-display tracking-wider">
                  <History className="w-4 h-4" /> VISTOS RECENTEMENTE
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {history.map((prod) => (
                    <div 
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className={`flex-shrink-0 w-24 cursor-pointer border transition-all ${
                        selectedProduct.id === prod.id ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="aspect-square p-2">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="bg-black/50 p-1 text-center">
                        <span className="text-[10px] font-display text-white block truncate">{prod.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 flex flex-col h-full gap-6">
            {/* Product Selection */}
            <div className="bg-card border border-white/10 p-6 flex-1 flex flex-col">
              <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                <Move className="w-5 h-5 text-primary" />
                MODELOS
              </h3>
              
              <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar flex-1">
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

              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="font-display font-bold text-2xl text-white mb-2">{selectedProduct.name}</h4>
                <p className="font-body text-gray-400 text-sm mb-6">{selectedProduct.tagline}</p>
                <Button className="w-full bg-white text-black hover:bg-primary font-display font-bold clip-corner h-12">
                  COMPRAR - R$ {selectedProduct.price.toFixed(2)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {capturedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-white/10 max-w-4xl w-full p-6 relative clip-corner">
            <button 
              onClick={() => setCapturedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-primary"
            >
              <X className="w-8 h-8" />
            </button>
            
            <h3 className="font-display font-bold text-2xl text-white mb-6">SEU VISUAL ZUNO</h3>
            
            <div className="aspect-video bg-black mb-6 border border-white/10">
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
            </div>
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => setCapturedImage(null)}
                className="border-white text-white hover:bg-white hover:text-black font-display"
              >
                DESCARTAR
              </Button>
              <Button 
                onClick={downloadPhoto}
                className="bg-primary text-black hover:bg-white font-display font-bold gap-2"
              >
                <Download className="w-4 h-4" /> BAIXAR FOTO
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
