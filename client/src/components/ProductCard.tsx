import { Link } from 'wouter';
import { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-card border border-white/5 hover:border-primary/50 transition-all duration-500 overflow-hidden">
      {/* New Badge */}
      {product.isNew && (
        <div className="absolute top-4 left-4 z-20 bg-primary text-black font-display font-bold text-xs px-3 py-1 clip-corner">
          NOVO
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-white/5 to-transparent p-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-700 ease-out z-10 drop-shadow-2xl"
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <Link href={`/product/${product.id}`}>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black font-display tracking-wider clip-corner">
              VER DETALHES
            </Button>
          </Link>
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
          <span className="font-display font-bold text-lg text-white">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        {/* Color Dots */}
        <div className="flex gap-2 mt-4">
          {product.colors.map((color, i) => (
            <div 
              key={i} 
              className="w-3 h-3 rounded-full border border-white/20"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>

        {/* Hover Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </div>
  );
}
