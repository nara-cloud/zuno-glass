import { Link } from 'wouter';
import { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useStock } from '@/hooks/useStock';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const installment = product.price > 0 ? (product.price / 3).toFixed(2) : null;
  const { addItem } = useCart();
  const { getProductStock, isInStock } = useStock();

  const totalStock = getProductStock(product.id);
  const inStock = isInStock(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) {
      toast.error('Produto esgotado', {
        description: `${product.name} está temporariamente indisponível.`,
      });
      return;
    }

    const defaultVariant = product.variants[0];
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variantColor: defaultVariant?.color || '#000',
      variantColorName: defaultVariant?.colorName || 'Padrão',
      category: product.category,
    });

    toast.success('Adicionado ao carrinho!', {
      description: `${product.name} — ${defaultVariant?.colorName || 'Padrão'}`,
    });
  };

  return (
    <div className={`group relative bg-card border border-white/5 hover:border-primary/50 transition-all duration-500 overflow-hidden ${!inStock ? 'opacity-70' : ''}`}>
      {/* Out of Stock Badge */}
      {!inStock && totalStock !== -1 && (
        <div className="absolute top-3 right-3 z-30 bg-red-600 text-white font-display text-[10px] tracking-widest px-3 py-1 clip-corner">
          ESGOTADO
        </div>
      )}

      {/* Low Stock Badge */}
      {inStock && totalStock > 0 && totalStock <= 3 && (
        <div className="absolute top-3 right-3 z-30 bg-amber-500 text-black font-display text-[10px] tracking-widest px-3 py-1 clip-corner">
          ÚLTIMAS UNIDADES
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-white/5 to-transparent p-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-contain transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700 ease-out z-10 drop-shadow-2xl ${!inStock ? 'grayscale' : ''}`}
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          <Link href={`/product/${product.id}`}>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black font-display tracking-wider clip-corner">
              VER DETALHES
            </Button>
          </Link>
          {product.price > 0 && inStock && (
            <Button 
              onClick={handleQuickAdd}
              className="bg-primary text-black hover:bg-white font-display tracking-wider clip-corner"
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-display font-bold text-xl text-white group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="font-body text-xs text-gray-400 tracking-widest uppercase mt-1">
              {product.tagline}
            </p>
          </div>
          {!inStock && totalStock !== -1 ? (
            <span className="font-display font-bold text-sm text-red-400 tracking-wider flex-shrink-0 ml-3">
              INDISPONÍVEL
            </span>
          ) : product.price > 0 ? (
            <div className="text-right flex-shrink-0 ml-3">
              <span className="font-display font-bold text-lg text-white block">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="font-body text-[11px] text-gray-500 block mt-0.5">
                ou 3x de R$ {installment?.replace('.', ',')}
              </span>
            </div>
          ) : (
            <span className="font-display font-bold text-sm text-primary tracking-wider">
              CONSULTAR
            </span>
          )}
        </div>

        {/* Color Dots from variants */}
        <div className="flex gap-2 mt-4">
          {product.variants.map((variant, i: number) => (
            <div 
              key={i} 
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: variant.color }}
              title={variant.colorName}
            ></div>
          ))}
        </div>

        {/* Hover Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </div>
  );
}
