import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { id: 'default', label: 'Padrão' },
  { id: 'price-asc', label: 'Menor preço' },
  { id: 'price-desc', label: 'Maior preço' },
  { id: 'name-asc', label: 'A–Z' },
  { id: 'name-desc', label: 'Z–A' },
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/catalog')
      .then(r => r.json())
      .then(d => setAllProducts(Array.isArray(d) ? d : []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Fechar menu de ordenação ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#sort-menu')) setShowSortMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredProducts = allProducts.filter(p =>
    activeCategory === 'all' || p.category === activeCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return (Number(a.price) || 0) - (Number(b.price) || 0);
      case 'price-desc': return (Number(b.price) || 0) - (Number(a.price) || 0);
      case 'name-asc': return (a.name || '').localeCompare(b.name || '');
      case 'name-desc': return (b.name || '').localeCompare(a.name || '');
      default: return 0;
    }
  });

  const categories = [
    { id: 'all', label: 'TODOS' },
    { id: 'performance', label: 'PERFORMANCE' },
    { id: 'lifestyle', label: 'LIFESTYLE' },
  ];

  const currentSortLabel = SORT_OPTIONS.find(o => o.id === sortBy)?.label || 'Padrão';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pb-20 container pt-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="font-display font-bold text-5xl md:text-6xl text-white mb-3">COLEÇÃO</h1>
            <p className="font-body text-gray-400 max-w-md text-sm">
              Óculos esportivos de alta performance para cada modalidade.
            </p>
            <p className="font-display text-primary text-xs mt-2 tracking-wider">
              {sortedProducts.length} {sortedProducts.length === 1 ? 'MODELO' : 'MODELOS'}
            </p>
          </div>

          {/* Ordenação */}
          <div id="sort-menu" className="relative">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:border-primary hover:text-primary font-display gap-2 min-w-[160px] justify-between"
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {currentSortLabel}
              <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </Button>
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-black border border-white/20 shadow-xl z-50">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    className={`w-full text-left px-4 py-2.5 font-display text-xs tracking-wider transition-colors hover:bg-white/10 ${
                      sortBy === opt.id ? 'text-primary bg-white/5' : 'text-gray-300'
                    }`}
                    onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                  >
                    {opt.label.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 mb-10 border-b border-white/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-display font-bold text-sm px-6 py-2 transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-black'
                  : 'text-gray-500 hover:text-white border border-white/10 hover:border-white/30'
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
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-gray-500 text-lg">NENHUM MODELO ENCONTRADO</p>
            <button
              className="mt-4 text-primary font-display text-sm underline"
              onClick={() => setActiveCategory('all')}
            >
              VER TODOS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
