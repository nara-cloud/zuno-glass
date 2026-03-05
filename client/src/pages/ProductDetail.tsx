import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Shield, RotateCcw, CreditCard, ShoppingBag, Minus, Plus, AlertTriangle, MessageCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useStock } from '@/hooks/useStock';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { getVariantStock, getProductStock, isInStock } = useStock();

  useEffect(() => {
    setLoading(true);
    setSelectedVariant(0);
    setQuantity(1);
    fetch('/api/catalog')
      .then(r => r.json())
      .then((data: any[]) => {
        const found = data.find((p: any) => p.id === params?.id);
        setProduct(found || null);
        setAllProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex justify-center items-center py-40">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container py-40 text-center">
          <p className="font-display text-gray-400 text-xl mb-4">PRODUTO NÃO ENCONTRADO</p>
          <Link href="/products">
            <span className="text-primary font-display underline cursor-pointer">VER COLEÇÃO</span>
          </Link>
        </div>
      </div>
    );
  }

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const currentVariant = variants[selectedVariant];
  const currentImage = currentVariant?.image || currentVariant?.imageUrl || product.image || '';
  const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
  const installment = price > 0 ? (price / 3).toFixed(2).replace('.', ',') : null;
  const formattedPrice = price > 0 ? price.toFixed(2).replace('.', ',') : null;

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
      price,
      image: currentImage,
      variantColor: currentVariant?.color || '#000',
      variantColorName: currentVariant?.colorName || 'Padrão',
      category: product.category,
    }, quantity);
    toast.success('Adicionado ao carrinho!', {
      description: `${product.name} — ${currentVariant?.colorName || 'Padrão'} (x${quantity})`,
    });
  };


  const maxQuantity = variantStock > 0 ? Math.min(10, variantStock) : 10;

  // Produtos relacionados da mesma categoria
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const categoryLabel = product.category === 'performance' ? 'PERFORMANCE' : product.category === 'limited' ? 'EDIÇÃO LIMITADA' : 'LIFESTYLE';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-20 pb-20 container">
        <Link href="/products">
          <span className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 font-display tracking-wider transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> VOLTAR PARA A LOJA
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className={`aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-12 relative overflow-hidden group cursor-pointer ${!variantInStock ? 'opacity-60' : ''}`}
              onClick={() => {/* foto clicável - já está no produto */}}
            >
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
              {!variantInStock && variantStock !== -1 && (
                <div className="absolute top-4 right-4 z-20 bg-red-600 text-white font-display text-xs tracking-widest px-4 py-2 clip-corner">
                  ESGOTADO
                </div>
              )}
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={`${product.name} - ${currentVariant?.colorName || ''}`}
                  onError={(e) => { const el = e.target as HTMLImageElement; el.style.display='none'; const next = el.nextElementSibling as HTMLElement; if (next) next.classList.remove('hidden'); }}
                  className={`w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500 ${!variantInStock ? 'grayscale' : ''}`}
                />
              ) : null}
              <div className={`${currentImage ? 'hidden' : 'flex'} flex-col items-center justify-center gap-4 w-full h-full`}>
                <div className="w-24 h-24 border border-primary/20 flex items-center justify-center">
                  <span className="font-display font-bold text-4xl text-primary/30">Z</span>
                </div>
                <span className="font-display text-xs tracking-[0.4em] text-gray-700">ZUNO GLASS</span>
              </div>
            </div>

            {/* Variant thumbnails */}
            {variants.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {variants.map((variant: any, i: number) => {
                  const vStock = getVariantStock(product.id, variant.colorName);
                  const vAvailable = vStock === -1 || vStock > 0;
                  const vImg = variant.image || variant.imageUrl || '';
                  return (
                    <button
                      key={i}
                      onClick={() => { setSelectedVariant(i); setQuantity(1); }}
                      className={`aspect-square bg-white/5 border flex items-center justify-center p-2 transition-colors relative ${
                        selectedVariant === i ? 'border-primary' : 'border-white/10 hover:border-white/30'
                      } ${!vAvailable ? 'opacity-40' : ''}`}
                    >
                      {vImg ? (
                        <img src={vImg} alt={variant.colorName} className="w-full h-full object-contain opacity-70 hover:opacity-100 transition-opacity" />
                      ) : (
                        <span className="font-display font-bold text-xs text-primary/30">Z</span>
                      )}
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
                {categoryLabel}
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-2 leading-none">
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
                  À vista no PIX com 5% de desconto: R$ {(price * 0.95).toFixed(2).replace('.', ',')}
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

            {/* Color/Variant Selector */}
            {variants.length > 0 && (
              <div className="mb-8">
                <label className="font-display font-bold text-white text-sm tracking-wider mb-4 block">
                  {currentVariant ? `COR: ${currentVariant.colorName.toUpperCase()}` : 'SELECIONE A COR'}
                </label>
                <div className="flex gap-4 flex-wrap">
                  {variants.map((variant: any, i: number) => {
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
            )}

            {/* Quantity Selector */}
            {price > 0 && variantInStock && (
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
              {price > 0 ? (
                variantInStock ? (
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    ADICIONAR AO CARRINHO
                  </Button>
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

            {/* Try On - Em breve */}
            <div className="relative mb-8">
              <Button
                variant="outline"
                disabled
                className="w-full border-white/10 text-gray-600 font-display font-bold h-12 tracking-wider cursor-not-allowed opacity-50"
              >
                EXPERIMENTAR AGORA (TRY-ON VIRTUAL)
              </Button>
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-display font-bold px-2 py-0.5 tracking-widest whitespace-nowrap">
                EM BREVE
              </span>
            </div>

            {/* Payment Methods Info */}
            <div className="bg-white/5 border border-white/10 p-4 mb-8 flex items-center gap-4">
              <CreditCard className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <div>
                <span className="font-body text-sm text-gray-400">Pagamento seguro via Mercado Pago. Aceitamos Visa, Mastercard, Elo e PIX.</span>
              </div>
            </div>

            {/* Features List */}
            {Array.isArray(product.features) && product.features.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-12">
                {product.features.map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300 font-body">
                    <div className="w-1.5 h-1.5 bg-primary rotate-45"></div>
                    {feature}
                  </div>
                ))}
              </div>
            )}

            {/* Garantia Forte */}
            <div className="bg-primary/5 border border-primary/20 p-6 clip-corner">
              <p className="font-display font-bold text-primary text-sm tracking-widest mb-4">COMPRA PROTEGIDA</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: RotateCcw, title: "30 DIAS SEM RISCO", desc: "Teste e devolva se não amar" },
                  { icon: CheckCircle2, title: "TROCA FÁCIL", desc: "Sem burocracia, sem complicação" },
                  { icon: Shield, title: "GARANTIA 3 MESES", desc: "Contra defeitos de fabricação" },
                  { icon: MessageCircle, title: "SUPORTE WHATSAPP", desc: "Atendimento direto e humano" },
                ].map((item, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-display text-white text-xs tracking-wider">{item.title}</p>
                      <p className="font-body text-gray-500 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
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
            {relatedProducts.map((relProduct: any) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
