import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Shield, Truck, RotateCcw } from 'lucide-react';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const product = products.find(p => p.id === params?.id);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) return <div>Produto não encontrado</div>;

  const currentVariant = product.variants[selectedVariant];
  const currentImage = currentVariant?.image || product.image;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-32 pb-20 container">
        <Link href="/products">
          <span className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 font-display tracking-wider transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> VOLTAR PARA A LOJA
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
              <img 
                src={currentImage} 
                alt={`${product.name} - ${currentVariant?.colorName || ''}`} 
                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Variant thumbnails */}
            {product.variants.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.variants.map((variant, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={`aspect-square bg-white/5 border flex items-center justify-center p-2 transition-colors ${
                      selectedVariant === i ? 'border-primary' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={variant.image} alt={variant.colorName} className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-display text-primary tracking-widest uppercase text-sm border border-primary/30 px-3 py-1">
                {product.category}
              </span>
              {product.isNew && (
                <span className="font-display bg-white text-black font-bold text-xs px-3 py-1 clip-corner">
                  NOVO LANÇAMENTO
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-2 leading-none">
              {product.name}
            </h1>
            <p className="font-display text-xl text-gray-400 tracking-[0.2em] uppercase mb-8">
              {product.tagline}
            </p>

            {product.price > 0 ? (
              <div className="font-display font-bold text-4xl text-primary mb-8">
                R$ {product.price.toFixed(2)}
              </div>
            ) : (
              <div className="font-display font-bold text-2xl text-primary mb-8 tracking-wider">
                PREÇO EM BREVE
              </div>
            )}

            <p className="font-body text-gray-300 text-lg leading-relaxed mb-10 border-l-2 border-white/20 pl-6">
              {product.description}
            </p>

            {/* Color/Variant Selection */}
            <div className="mb-10">
              <label className="font-display font-bold text-white text-sm tracking-wider mb-4 block">
                {currentVariant ? `COR: ${currentVariant.colorName.toUpperCase()}` : 'SELECIONE A COR'}
              </label>
              <div className="flex gap-4">
                {product.variants.map((variant, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(i)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedVariant === i ? 'border-primary scale-110' : 'border-transparent hover:border-white/50'
                    }`}
                    style={{ backgroundColor: variant.color }}
                    title={variant.colorName}
                  >
                    {selectedVariant === i && (
                      <Check className={`w-5 h-5 ${
                        variant.color === '#FFFFFF' || variant.color === '#eab308' || variant.color === '#93c5fd' || variant.color === '#f472b6' || variant.color === '#c0c0c0' || variant.color === '#f4a6c0'
                          ? 'text-black' 
                          : 'text-white'
                      }`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {product.price > 0 ? (
                <Button className="flex-1 bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider">
                  ADICIONAR AO CARRINHO
                </Button>
              ) : (
                <Button className="flex-1 bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider">
                  AVISE-ME QUANDO DISPONÍVEL
                </Button>
              )}
              <Link href="/try-on">
                <Button variant="outline" className="flex-1 border-white text-white hover:bg-white hover:text-black font-display font-bold text-lg h-14 clip-corner tracking-wider">
                  EXPERIMENTAR AGORA
                </Button>
              </Link>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              {product.features.map((feature, i: number) => (
                <div key={i} className="flex items-center gap-3 text-gray-300 font-body">
                  <div className="w-1.5 h-1.5 bg-primary rotate-45"></div>
                  {feature}
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { icon: Shield, text: "Garantia de 2 Anos" },
                { icon: Truck, text: "Frete Grátis Brasil" },
                { icon: RotateCcw, text: "30 Dias para Troca" }
              ].map((item, i: number) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <item.icon className="w-6 h-6 text-gray-500" />
                  <span className="font-display text-xs text-gray-500 uppercase tracking-wider">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
