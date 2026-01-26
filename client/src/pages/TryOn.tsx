import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { FaceMesh, Results } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import { Move, AlertCircle, Loader2, ScanFace } from 'lucide-react';

export default function TryOn() {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  
  // Glasses positioning state
  const [glassesStyle, setGlassesStyle] = useState<React.CSSProperties>({
    display: 'none',
  });

  const onResults = useCallback((results: Results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setGlassesStyle({ display: 'none' });
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];

    // Key landmarks for glasses positioning
    // 33: Left eye outer corner
    // 263: Right eye outer corner
    // 168: Nose bridge (center)
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const noseBridge = landmarks[168];

    if (!leftEye || !rightEye || !noseBridge) return;

    // Calculate center point (nose bridge is usually good, but midpoint of eyes is safer for rotation center)
    const centerX = noseBridge.x * 100;
    const centerY = noseBridge.y * 100;

    // Calculate angle for rotation (roll)
    const dy = rightEye.y - leftEye.y;
    const dx = rightEye.x - leftEye.x;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Calculate scale based on distance between eyes
    // The distance in normalized coordinates needs to be scaled up
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Base scale factor - adjust this multiplier to fit the specific glasses assets
    const scale = distance * 4.5; 

    setGlassesStyle({
      display: 'block',
      position: 'absolute',
      left: `${centerX}%`,
      top: `${centerY}%`,
      width: '100%', // Base width, scaled down by transform
      transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${scale})`,
      transformOrigin: 'center center',
      pointerEvents: 'none',
      zIndex: 10,
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-32 pb-20 container">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-4">
            AI <span className="text-primary italic">TRY-ON</span>
          </h1>
          <p className="font-body text-gray-400 max-w-2xl mx-auto text-lg">
            Tecnologia de rastreamento facial em tempo real. A inteligência artificial ajusta os óculos ao seu rosto automaticamente.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Camera Area */}
          <div className="lg:col-span-8 bg-black border border-white/10 relative aspect-video overflow-hidden clip-corner group">
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
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user"
                  }}
                />
                
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

                {/* Face Mesh Debug Grid (Optional - for visual tech feel) */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('/grid-pattern.svg')]"></div>
                
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded border border-primary/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-display text-xs text-primary">AI TRACKING ACTIVE</span>
                  </div>
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
