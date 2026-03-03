import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/catalog')
      .then(r => r.json())
      .then(d => setAllProducts(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  const categories = [
    { id: 'all', label: 'TODOS' },
    { id: 'performance', label: 'PERFORMANCE' },
    { id: 'lifestyle', label: 'LIFESTYLE' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="pt-32 pb-20 container">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h1 className="font-display font-bold text-6xl text-white mb-4">COLEÇÃO</h1>
            <p className="font-body text-gray-400 max-w-md">
              Óculos esportivos de alta performance para cada modalidade.
              Encontre o modelo ideal para o seu esporte.
            </p>
            <p className="font-display text-primary text-sm mt-2 tracking-wider">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'MODELO' : 'MODELOS'}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/20 text-white hover:border-primary hover:text-primary font-display gap-2">
              <Filter className="w-4 h-4" /> FILTRAR
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:border-primary hover:text-primary font-display gap-2">
              <SlidersHorizontal className="w-4 h-4" /> ORDENAR
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-white/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-display font-bold text-lg px-6 py-2 transition-all clip-corner ${
                activeCategory === cat.id 
                  ? 'bg-primary text-black' 
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-gray-500 text-lg">NENHUM MODELO ENCONTRADO</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
