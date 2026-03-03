import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import {
  Search, RefreshCw, AlertTriangle,
  CheckCircle, Package, ChevronDown, ChevronUp,
  Edit, Plus, Tag, TrendingUp, Boxes
} from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Admin from './Admin';

interface Variant {
  id: number;
  sku: string;
  colorName: string;
  stock: number;
  price: string | null;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
  variants: Variant[];
}

const CATEGORY_LABELS: Record<string, string> = {
  esportivo: 'Performance',
  casual_masculino: 'Lifestyle',
  casual_feminino: 'Lifestyle',
  edicao_limitada: 'Ed. Limitada',
};

const CATEGORY_COLORS: Record<string, string> = {
  esportivo: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  casual_masculino: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  casual_feminino: 'text-pink-400 bg-pink-400/10 border-pink-400/30',
  edicao_limitada: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
};

const COST_MAP: Record<string, number> = {
  esportivo: 85.00,
  casual_masculino: 75.00,
  casual_feminino: 75.00,
  edicao_limitada: 75.00,
};

function getStockStatus(stock: number) {
  if (stock === 0) return { label: 'Esgotado', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' };
  if (stock <= 3) return { label: 'Baixo', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' };
  return { label: 'OK', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' };
}

export default function AdminProducts() {
  const { authenticated, loading, getAuthHeaders } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (authenticated) loadProducts();
  }, [authenticated]);

  const loadProducts = async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/catalog/products', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        toast.error('Erro ao carregar produtos');
      }
    } catch {
      toast.error('Erro ao carregar produtos');
    } finally {
      setDataLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedProducts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }
  if (!authenticated) return <Admin />;

  const allVariants = products.flatMap(p => p.variants);
  const totalProducts = products.length;
  const totalVariants = allVariants.length;
  const totalStock = allVariants.reduce((s, v) => s + v.stock, 0);
  const lowStockVariants = allVariants.filter(v => v.stock > 0 && v.stock <= 3).length;
  const outOfStockVariants = allVariants.filter(v => v.stock === 0).length;
  const totalValue = products.reduce((s, p) => {
    const pStock = p.variants.reduce((vs, v) => vs + v.stock, 0);
    return s + pStock * parseFloat(p.price);
  }, 0);
  const totalCost = products.reduce((s, p) => {
    const pStock = p.variants.reduce((vs, v) => vs + v.stock, 0);
    return s + pStock * (COST_MAP[p.category] || 75);
  }, 0);

  const filtered = products.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.variants.some(v =>
        v.sku.toLowerCase().includes(search.toLowerCase()) ||
        v.colorName.toLowerCase().includes(search.toLowerCase())
      );
    const matchCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'esportivo' && p.category === 'esportivo') ||
      (categoryFilter === 'casual' && (p.category === 'casual_masculino' || p.category === 'casual_feminino')) ||
      (categoryFilter === 'edicao_limitada' && p.category === 'edicao_limitada');
    const productTotalStock = p.variants.reduce((s, v) => s + v.stock, 0);
    const matchStock =
      stockFilter === 'all' ? true :
      stockFilter === 'zero' ? productTotalStock === 0 :
      stockFilter === 'low' ? productTotalStock > 0 && productTotalStock <= 5 :
      stockFilter === 'ok' ? productTotalStock > 5 : true;
    return matchSearch && matchCategory && matchStock;
  });

  return (
    <AdminLayout title="Produtos" subtitle={`${totalProducts} modelos · ${totalVariants} variantes`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-white tracking-wider">PRODUTOS</h1>
            <p className="font-body text-sm text-gray-500 mt-1">{totalProducts} modelos · {totalVariants} variantes · {totalStock} unidades</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadProducts} disabled={dataLoading} className="border-white/10 text-gray-400 hover:text-white">
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Link href="/admin/catalog">
              <Button size="sm" className="bg-primary text-black hover:bg-white font-display font-bold tracking-wider">
                <Plus className="w-4 h-4 mr-1" /> NOVO PRODUTO
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Tag className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-white">{totalVariants}</p>
              <p className="font-body text-[10px] text-gray-500">SKUs</p>
            </CardContent>
          </Card>
          <Card className="bg-green-400/5 border-green-400/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-green-400">{totalStock}</p>
              <p className="font-body text-[10px] text-gray-500">Em Estoque</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-400/5 border-yellow-400/20">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-yellow-400">{lowStockVariants}</p>
              <p className="font-body text-[10px] text-gray-500">Estoque Baixo</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-400/5 border-blue-400/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="font-display font-bold text-base text-blue-400">R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
              <p className="font-body text-[10px] text-gray-500">Valor em Estoque</p>
              <p className="font-body text-[9px] text-gray-600">Custo: R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar produto, SKU ou cor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'TODOS' },
              { key: 'esportivo', label: 'PERFORMANCE' },
              { key: 'casual', label: 'LIFESTYLE' },
              { key: 'edicao_limitada', label: 'ED. LIMITADA' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategoryFilter(cat.key)}
                className={`px-3 py-1.5 font-display font-bold text-xs tracking-wider border transition-colors ${
                  categoryFilter === cat.key
                    ? 'bg-primary text-black border-primary'
                    : 'text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'ESTOQUE: TODOS' },
              { key: 'zero', label: 'ESGOTADO' },
              { key: 'low', label: 'BAIXO' },
              { key: 'ok', label: 'OK' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setStockFilter(f.key)}
                className={`px-3 py-1.5 font-display font-bold text-xs tracking-wider border transition-colors ${
                  stockFilter === f.key
                    ? 'bg-white/10 text-white border-white/30'
                    : 'text-gray-500 border-white/5 hover:border-white/20 hover:text-gray-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="font-body text-xs text-gray-600">{filtered.length} de {totalProducts} produtos exibidos</p>

        {dataLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <Package className="w-8 h-8 mb-2 opacity-30" />
            <p className="font-body text-sm">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(product => {
              const totalProductStock = product.variants.reduce((s, v) => s + v.stock, 0);
              const stockStatus = getStockStatus(totalProductStock);
              const isExpanded = expandedProducts.has(product.id);

              return (
                <Card key={product.id} className="bg-white/5 border-white/10 overflow-hidden">
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => toggleExpand(product.id)}
                  >
                    <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display font-bold text-sm text-white tracking-wider">{product.name}</p>
                        <span className={`font-display font-bold text-[9px] px-2 py-0.5 border tracking-wider ${CATEGORY_COLORS[product.category] || 'text-gray-400 bg-gray-400/10 border-gray-400/30'}`}>
                          {CATEGORY_LABELS[product.category] || product.category}
                        </span>
                        {!product.isActive && (
                          <span className="font-display font-bold text-[9px] px-2 py-0.5 border text-gray-500 bg-gray-500/10 border-gray-500/30 tracking-wider">INATIVO</span>
                        )}
                      </div>
                      <p className="font-body text-xs text-gray-500 mt-0.5">{product.slug} · {product.variants.length} variante{product.variants.length !== 1 ? 's' : ''}</p>
                    </div>

                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="font-display font-bold text-sm text-white">R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}</p>
                      {product.compareAtPrice && (
                        <p className="font-body text-[10px] text-gray-600 line-through">R$ {parseFloat(product.compareAtPrice).toFixed(2).replace('.', ',')}</p>
                      )}
                    </div>

                    <div className={`text-center flex-shrink-0 px-3 py-1 border ${stockStatus.bg}`}>
                      <p className={`font-display font-bold text-lg ${stockStatus.color}`}>{totalProductStock}</p>
                      <p className={`font-body text-[9px] ${stockStatus.color}`}>{stockStatus.label}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/admin/catalog?edit=${product.id}`} onClick={e => e.stopPropagation()}>
                        <Button variant="outline" size="icon" className="w-8 h-8 border-white/10 text-gray-400 hover:text-white hover:border-primary">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/10 p-4 bg-black/20">
                      <p className="font-display font-bold text-[10px] text-gray-600 tracking-widest mb-3">VARIANTES ({product.variants.length})</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {product.variants.map(variant => {
                          const vs = getStockStatus(variant.stock);
                          return (
                            <div
                              key={variant.id}
                              className={`p-2 border text-center ${
                                variant.stock === 0
                                  ? 'border-red-400/30 bg-red-400/5'
                                  : variant.stock <= 3
                                  ? 'border-yellow-400/30 bg-yellow-400/5'
                                  : 'border-white/10 bg-white/5'
                              }`}
                            >
                              <p className="font-body text-[9px] text-gray-500 truncate">{variant.sku}</p>
                              <p className="font-body text-[10px] text-gray-300 truncate mt-0.5">{variant.colorName}</p>
                              <p className={`font-display font-bold text-xl mt-1 ${vs.color}`}>{variant.stock}</p>
                              {variant.price && (
                                <p className="font-body text-[9px] text-gray-600 mt-0.5">R$ {parseFloat(variant.price).toFixed(2).replace('.', ',')}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
