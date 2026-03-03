import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, CreditCard, Truck, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link, useLocation } from 'wouter';
import { calculateShipping, isValidCep, formatCep } from '@shared/shipping';
import type { ShippingQuote } from '@shared/shipping';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, closeCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [, navigate] = useLocation();
  const [cep, setCep] = useState('');
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [cepError, setCepError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Carregar CEP salvo do localStorage
  useEffect(() => {
    const savedCep = localStorage.getItem('zuno_shipping_cep');
    if (savedCep) {
      setCep(formatCep(savedCep));
      const quote = calculateShipping(savedCep, totalPrice);
      if (quote) setShippingQuote(quote);
    }
  }, []);

  // Recalcular frete quando o total do carrinho muda
  useEffect(() => {
    if (shippingQuote && cep) {
      const quote = calculateShipping(cep, totalPrice);
      if (quote) setShippingQuote(quote);
    }
  }, [totalPrice]);

  const handleCepChange = (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    setCepError('');
    // Limpar cotação se CEP mudou
    if (formatted.replace(/\D/g, '').length < 8) {
      setShippingQuote(null);
    }
  };

  const handleCalculateShipping = () => {
    const cleanCep = cep.replace(/\D/g, '');

    if (!isValidCep(cleanCep)) {
      setCepError('CEP inválido. Digite 8 números.');
      setShippingQuote(null);
      return;
    }

    setIsCalculating(true);
    setCepError('');

    // Simular um pequeno delay para UX
    setTimeout(() => {
      const quote = calculateShipping(cleanCep, totalPrice);
      if (quote) {
        setShippingQuote(quote);
        localStorage.setItem('zuno_shipping_cep', cleanCep);
      } else {
        setCepError('CEP não encontrado. Verifique e tente novamente.');
      }
      setIsCalculating(false);
    }, 600);
  };

  const installmentValue = totalPrice > 0 ? (totalPrice / 3) : 0;
  const shippingCost = shippingQuote ? shippingQuote.price : 0;
  const grandTotal = totalPrice + shippingCost;
  const grandTotalPix = grandTotal * 0.95;
  const installmentGrandTotal = grandTotal > 0 ? (grandTotal / 3) : 0;

  const handleCheckout = () => {
    if (items.length === 0) return;
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-white/10 z-[70] transform transition-transform duration-300 ease-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-xl text-white tracking-wider">
              CARRINHO
            </h2>
            {totalItems > 0 && (
              <span className="bg-primary text-black font-display font-bold text-xs px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-700 mb-4" />
              <h3 className="font-display font-bold text-lg text-gray-500 mb-2">
                CARRINHO VAZIO
              </h3>
              <p className="font-body text-sm text-gray-600 mb-6">
                Adicione produtos para começar suas compras.
              </p>
              <Link href="/products" onClick={closeCart}>
                <Button className="bg-primary text-black hover:bg-white font-display font-bold tracking-wider clip-corner">
                  VER COLEÇÃO
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantColor}`}
                  className="flex gap-4 bg-white/5 border border-white/10 p-4 group"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-white/5 flex-shrink-0 flex items-center justify-center p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-display font-bold text-sm text-white leading-tight">
                          {item.name}
                        </h4>
                        <p className="font-body text-xs text-gray-500 mt-0.5">
                          {item.variantColorName} · {item.category.toUpperCase()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.variantColor)}
                        className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantColor, item.quantity - 1)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-display font-bold text-sm text-white w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantColor, item.quantity + 1)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-display font-bold text-sm text-primary">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Shipping Calculator */}
              <div className="border border-white/10 bg-white/5 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-display font-bold text-sm text-white tracking-wider">CALCULAR FRETE</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCalculateShipping()}
                    placeholder="00000-000"
                    maxLength={9}
                    className="flex-1 bg-black/50 border border-white/10 px-3 py-2.5 font-body text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <Button
                    onClick={handleCalculateShipping}
                    disabled={isCalculating}
                    className="bg-primary text-black hover:bg-white font-display font-bold text-xs px-4 tracking-wider"
                  >
                    {isCalculating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'CALCULAR'
                    )}
                  </Button>
                </div>

                {cepError && (
                  <p className="font-body text-xs text-red-400">{cepError}</p>
                )}

                {shippingQuote && (
                  <div className="bg-black/30 border border-white/5 p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        <span className="font-body text-xs text-gray-300">{shippingQuote.region}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-xs text-gray-400">Prazo estimado</span>
                      <span className="font-body text-xs text-white font-bold">{shippingQuote.estimateText}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-xs text-gray-400">Valor do frete</span>
                      <span className={`font-display font-bold text-sm ${shippingQuote.freeShipping ? 'text-primary' : 'text-white'}`}>
                        {shippingQuote.formattedPrice}
                      </span>
                    </div>
                    {shippingQuote.freeShipping && (
                      <p className="font-body text-[10px] text-primary/70">Frete grátis para sua região!</p>
                    )}
                  </div>
                )}

                <a
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[10px] text-gray-600 hover:text-primary transition-colors underline"
                >
                  Não sei meu CEP
                </a>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="font-body text-xs text-gray-600 hover:text-red-400 transition-colors underline"
            >
              Limpar carrinho
            </button>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm text-gray-400 tracking-wider">SUBTOTAL</span>
                <span className="font-display font-bold text-sm text-white">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {shippingQuote && (
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-gray-400 tracking-wider">FRETE</span>
                  <span className={`font-display font-bold text-sm ${shippingQuote.freeShipping ? 'text-primary' : 'text-white'}`}>
                    {shippingQuote.formattedPrice}
                  </span>
                </div>
              )}

              <div className="border-t border-white/10 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-gray-300 tracking-wider">TOTAL</span>
                  <span className="font-display font-bold text-lg text-white">
                    R$ {grandTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-gray-500">Parcelamento</span>
                <span className="font-body text-xs text-gray-400">
                  ou <span className="text-white font-bold">3x de R$ {installmentGrandTotal.toFixed(2).replace('.', ',')}</span> sem juros
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-gray-500">PIX (5% desc.)</span>
                <span className="font-body text-xs text-primary font-bold">
                  R$ {grandTotalPix.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="flex items-center gap-2 bg-white/5 p-3 border border-white/10">
              <CreditCard className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-body text-xs text-gray-500">
                Pagamento seguro via Mercado Pago. Visa, Mastercard, Elo e PIX.
              </span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary text-black hover:bg-white font-display font-bold text-lg h-14 clip-corner tracking-wider disabled:opacity-70"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  PROCESSANDO...
                </>
              ) : (
                <>
                  FINALIZAR COMPRA <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {!shippingQuote && (
              <p className="font-body text-[10px] text-gray-600 text-center">
                Informe seu CEP acima para calcular o frete.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
