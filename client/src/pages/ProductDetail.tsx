import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Shield, Truck, RotateCcw, CreditCard, Loader2, ShoppingBag, Minus, Plus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useStock } from '@/hooks/useStock';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const product = products.find(p => p.id === params?.id);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { getVariantStock, getProductStock, isInStock } = useStock();

  if (!product) return <div>Produto não encontrado</div>;

  const currentVariant = product.variants[selectedVariant];
  const currentImage = currentVariant?.image || product.image;
  const installment = product.price > 0 ? (product.price / 3).toFixed(2).replace('.', ',') : null;
  const formattedPrice = product.price > 0 ? product.price.toFixed(2).replace('.', ',') : null;

  const variantStock = currentVariant 
    ? getVariantStock(product.id, currentVariant.colorName)
    : getProductStock(product.id);
  const variantInStock = variantStock === -1 || variantStock > 0;
  const productInStock = isInStock(product.id);

  const handleAddToCart = () => {
    if (!variantInStock) {
      toast.error('Variante esgotada', {
        description: `${product.name} — ${currentVariant?.colorName || 'Padrão'} está indisponível.`,
      });
      return;
    }

    if (variantStock !== -1 && quantity > variantStock) {
      toast.error('Quantidade indisponível', {
        description: `Apenas ${variantStock} unidade(s) disponível(is).`,
      });
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: currentImage,
      variantColor: currentVariant?.color || '#000',
      variantColorName: currentVariant?.colorName || 'Padrão',
      category: product.category,
    }, quantity);

    toast.success('Adicionado ao carrinho!', {
      description: `${product.name} — ${currentVariant?.colorName || 'Padrão'} (x${quantity})`,
    });
  };

  const handleBuyNow = async () => {
    if (isCheckingOut) return;

    if (!variantInStock) {
      toast.error('Variante esgotada', {
        description: `${product.name} — ${currentVariant?.colorName || 'Padrão'} está indisponível.`,
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantColor: currentVariant?.colorName || 'default',
          quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error('Estoque insuficiente', {
            description: data.details?.join(', ') || 'Produto indisponível.',
          });
          return;
        }
        throw new Error(data.error || 'Erro ao criar sessão de pagamento');
      }

      if (data.url) {
        toast.info('Redirecionando para o checkout...', {
          description: 'Você será levado à página de pagamento seguro.',
        });
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast.error('Erro no checkout', {
        description: err.message || 'Tente novamente em alguns instantes.',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Max quantity based on stock
  const maxQuantity = variantStock > 0 ? Math.min(10, variantStock) : 10;

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
            <div className={`aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-12 relative overflow-hidden group ${!variantInStock ? 'opacity-60' : ''}`}>
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
              {!variantInStock && variantStock !== -1 && (
                <div className="absolute top-4 right-4 z-20 bg-red-600 text-white font-display text-xs tracking-widest px-4 py-2 clip-corner">
                  ESGOTADO
                </div>
              )}
              <img 
                src={currentImage} 
                alt={`${product.name} - ${currentVariant?.colorName || ''}`} 
                className={`w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500 ${!variantInStock ? 'grayscale' : ''}`}
              />
            </div>
            {/* Variant thumbnails */}
            {product.variants.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.variants.map((variant, i: number) => {
                  const vStock = getVariantStock(product.id, variant.colorName);
                  const vAvailable = vStock === -1 || vStock > 0;
                  return (
                    <button
                      key={i}
                      onClick={() => { setSelectedVariant(i); setQuantity(1); }}
                      className={`aspect-square bg-white/5 border flex items-center justify-center p-2 transition-colors relative ${
                        selectedVariant === i ? 'border-primary' : 'border-white/10 hover:border-white/30'
                      } ${!vAvailable ? 'opacity-40' : ''}`}
                    >
                      <img src={variant.image} alt={variant.colorName} className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
                      {!vAvailable && vStock !== -1 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[1px] bg-red-500 rotate-45 absolute"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-display text-primary tracking-widest uppercase text-sm border border-primary/30 px-3 py-1">
                {product.category === 'limited' ? 'EDIÇÃO LIMITADA' : product.category === 'performance' ? 'PERFORMANCE' : 'LIFESTYLE'}
              </span>

            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-2 leading-none">
              {product.name}
            </h1>
            <p className="font-display text-xl text-gray-400 tracking-[0.2em] uppercase mb-8">
              {product.tagline}
            </p>

            {formattedPrice ? (
              <div className="mb-8">
                <div className="font-display font-bold text-4xl text-primary">
                  R$ {formattedPrice}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="font-body text-gray-400 text-sm">
                    ou <span className="text-white font-bold">3x de R$ {installment}</span> sem juros no cartão
                  </span>
                </div>
                <span className="font-body text-xs text-gray-600 mt-1 block">
                  À vista no PIX com 5% de desconto: R$ {(product.price * 0.95).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ) : (
              <div className="font-display font-bold text-2xl text-primary mb-8 tracking-wider">
                CONSULTAR PREÇO
              </div>
            )}

            {/* Stock Status */}
            {variantStock !== -1 && (
              <div className={`mb-6 flex items-center gap-2 text-sm font-display tracking-wider ${
                !variantInStock ? 'text-red-400' : variantStock <= 3 ? 'text-amber-400' : 'text-green-400'
              }`}>
                {!variantInStock ? (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>ESGOTADO — {currentVariant?.colorName?.toUpperCase()}</span>
                  </>
                ) : variantStock <= 3 ? (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>ÚLTIMAS {variantStock} UNIDADE{variantStock > 1 ? 'S' : ''} — {currentVariant?.colorName?.toUpperCase()}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>EM ESTOQUE — {currentVariant?.colorName?.toUpperCase()}</span>
                  </>
                )}
              </div>
            )}

            <p className="font-body text-gray-300 text-lg leading-relaxed mb-10 border-l-2 border-white/20 pl-6">
              {product.description}
            </p>

            {/* Color/Variant Selection */}
            <div className="mb-8">
              <label className="font-display font-bold text-white text-sm tracking-wider mb-4 block">
                {currentVariant ? `COR: ${currentVariant.colorName.toUpperCase()}` : 'SELECIONE A COR'}
              </label>
              <div className="flex gap-4">
                {product.variants.map((variant, i: number) => {
                  const vStock = getVariantStock(product.id, variant.colorName);
                  const vAvailable = vStock === -1 || vStock > 0;
                  return (
                    <button
                      key={i}
                      onClick={() => { setSelectedVariant(i); setQuantity(1); }}
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all relative ${
                        selectedVariant === i ? 'border-primary scale-110' : 'border-transparent hover:border-white/50'
                      } ${!vAvailable ? 'opacity-40' : ''}`}
                      style={{ backgroundColor: variant.color }}
                      title={`${variant.colorName}${!vAvailable ? ' (Esgotado)' : ''}`}
                    >
                      {selectedVariant === i && (
                        <Check className={`w-5 h-5 ${
                          variant.color === '#FFFFFF' || variant.color === '#eab308' || variant.color === '#93c5fd' || variant.color === '#f472b6' || variant.color === '#c0c0c0' || variant.color === '#f4a6c0'
                            ? 'text-black' 
                            : 'text-white'
                        }`} />
                      )}
                      {!vAvailable && vStock !== -1 && (
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="w-full h-[2px] bg-red-500 rotate-45 absolute top-1/2 left-0 -translate-y-1/2"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            {product.price > 0 && variantInStock && (
              <div className="mb-8">
                <label className="font-display font-bold text-white text-sm tracking-wider mb-4 block">
                  QUANTIDADE
                </label>
                <div className="inline-flex items-center border border-white/10">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display font-bold text-lg text-white w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    className="p-3 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {variantStock > 0 && variantStock <= 5 && (
                  <span className="font-body text-xs text-gray-500 ml-3">
                    (máx. {maxQuantity})
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {product.price > 0 ? (
                variantInStock ? (
                  <>
                    <Button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-white/10 text-white hover:bg-white/20 font-display font-bold text-lg h-14 clip-corner tracking-wider border border-white/20"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      ADICIONAR AO CARRINHO
                    </Button>
                    <Button 
                      onClick={handleBuyNow}
                      disabled={isCheckingOut}
                      className="flex-1 bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider disabled:opacity-70"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          PROCESSANDO...
                        </>
                      ) : (
                        'COMPRAR AGORA'
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex-1">
                    <Button 
                      disabled
                      className="w-full bg-red-600/20 text-red-400 font-display font-bold text-lg h-14 clip-corner tracking-wider cursor-not-allowed border border-red-600/30"
                    >
                      PRODUTO ESGOTADO
                    </Button>
                    <p className="font-body text-xs text-gray-500 mt-2 text-center">
                      {productInStock ? 'Selecione outra cor disponível.' : 'Este produto está temporariamente indisponível.'}
                    </p>
                  </div>
                )
              ) : (
                <Button className="flex-1 bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider">
                  AVISE-ME QUANDO DISPONÍVEL
                </Button>
              )}
            </div>

            {/* Try On */}
            <Link href="/try-on">
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-black font-display font-bold h-12 tracking-wider mb-8">
                EXPERIMENTAR AGORA (TRY-ON VIRTUAL)
              </Button>
            </Link>

            {/* Payment Methods Info */}
            <div className="bg-white/5 border border-white/10 p-4 mb-8 flex items-center gap-4">
              <CreditCard className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-body text-sm text-gray-400">Pagamento seguro via Stripe. Aceitamos Visa, Mastercard, Elo e PIX.</span>
              </div>
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
                { icon: Truck, text: "Envio para todo o Brasil" },
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

      {/* Related Products */}
      <section className="pb-20 container">
        <div className="border-t border-white/10 pt-16 mb-12">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-[2px] bg-primary"></div>
            <span className="font-display text-primary text-sm tracking-widest">VOCÊ TAMBÉM PODE GOSTAR</span>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white">
            PRODUTOS RELACIONADOS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 4)
            .concat(
              products.filter(
                p => p.id !== product.id &&
                p.category !== product.category &&
                !products.filter(x => x.id !== product.id && x.category === product.category).slice(0, 4).find(x => x.id === p.id)
              )
            )
            .slice(0, 4)
            .map(relProduct => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
