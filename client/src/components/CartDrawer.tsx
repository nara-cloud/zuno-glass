import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'wouter';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, closeCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const installmentTotal = totalPrice > 0 ? (totalPrice / 3).toFixed(2).replace('.', ',') : null;

  const handleCheckout = async () => {
    if (isCheckingOut || items.length === 0) return;
    setIsCheckingOut(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            variantColor: item.variantColorName,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
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
            items.map((item) => (
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
            ))
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

            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm text-gray-400 tracking-wider">SUBTOTAL</span>
                <span className="font-display font-bold text-lg text-white">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-gray-500">Parcelamento</span>
                <span className="font-body text-xs text-gray-400">
                  ou <span className="text-white font-bold">3x de R$ {installmentTotal}</span> sem juros
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-gray-500">PIX (5% desc.)</span>
                <span className="font-body text-xs text-primary font-bold">
                  R$ {(totalPrice * 0.95).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="flex items-center gap-2 bg-white/5 p-3 border border-white/10">
              <CreditCard className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="font-body text-xs text-gray-500">
                Pagamento seguro via Stripe. Visa, Mastercard, Elo e PIX.
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

            <p className="font-body text-[10px] text-gray-600 text-center">
              Frete grátis para todo o Brasil. Entrega em até 10 dias úteis.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
