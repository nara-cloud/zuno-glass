import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search, RefreshCw, Tag, TrendingUp, AlertTriangle,
  CheckCircle, Package, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import { productCatalog } from '@shared/products';
import { stockMapping } from '@shared/stockMapping';
import { toast } from 'sonner';

interface StockData {
  [productId: string]: {
    total: number;
    variants: { [color: string]: number };
  };
}

interface ProductRow {
  id: string;
  name: string;
  price: number;
  category: 'performance' | 'lifestyle' | 'limited';
  sku: string;
  gestaoName: string;
  color: string;
  stock: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  performance: 'Performance',
  lifestyle: 'Lifestyle',
  limited: 'Ed. Limitada',
};

const CATEGORY_COLORS: Record<string, string> = {
  performance: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  lifestyle: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  limited: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
};

const COST_MAP: Record<string, number> = {
  performance: 85.00,
  lifestyle: 75.00,
  limited: 75.00,
};

function getStockStatus(stock: number) {
  if (stock === 0) return { label: 'Sem Estoque', color: 'text-red-400', icon: AlertTriangle };
  if (stock <= 2) return { label: 'Crítico', color: 'text-orange-400', icon: AlertTriangle };
  if (stock <= 5) return { label: 'Baixo', color: 'text-yellow-400', icon: AlertTriangle };
  return { label: 'OK', color: 'text-green-400', icon: CheckCircle };
}

export default function AdminProducts() {
  const { authenticated, loading: authLoading, getAuthHeaders } = useAdminAuth();
  const [stockData, setStockData] = useState<StockData>({});
  const [loadingStock, setLoadingStock] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const fetchStock = async () => {
    setLoadingStock(true);
    try {
      const res = await fetch('/api/stock', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStockData(data.stock || {});
      }
    } catch (err) {
      toast.error('Erro ao carregar estoque');
    } finally {
      setLoadingStock(false);
    }
  };

  useEffect(() => {
    if (authenticated) fetchStock();
  }, [authenticated]);

  // Build flat rows from stockMapping
  const allRows: ProductRow[] = stockMapping.map((entry) => {
    const product = productCatalog.find(p => p.id === entry.ecommerceProductId);
    const stock = stockData[entry.ecommerceProductId]?.variants[entry.ecommerceColorName] ?? 0;
    return {
      id: entry.ecommerceProductId,
      name: product?.name ?? entry.ecommerceProductId,
      price: product?.price ?? 0,
      category: product?.category ?? 'lifestyle',
      sku: entry.gestaoSku,
      gestaoName: entry.gestaoName,
      color: entry.ecommerceColorName,
      stock,
    };
  });

  // Filter and sort
  const filtered = allRows.filter(row => {
    const matchSearch = search === '' ||
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.sku.toLowerCase().includes(search.toLowerCase()) ||
      row.gestaoName.toLowerCase().includes(search.toLowerCase()) ||
      row.color.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || row.category === categoryFilter;
    const matchStock =
      stockFilter === 'all' ? true :
      stockFilter === 'zero' ? row.stock === 0 :
      stockFilter === 'low' ? row.stock > 0 && row.stock <= 5 :
      stockFilter === 'ok' ? row.stock > 5 : true;
    return matchSearch && matchCategory && matchStock;
  }).sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortBy === 'stock') cmp = a.stock - b.stock;
    else if (sortBy === 'price') cmp = a.price - b.price;
    return sortDir === 'asc' ? cmp : -cmp;
  });

  // Summary stats
  const totalSKUs = allRows.length;
  const totalStock = allRows.reduce((s, r) => s + r.stock, 0);
  const zeroStock = allRows.filter(r => r.stock === 0).length;
  const lowStock = allRows.filter(r => r.stock > 0 && r.stock <= 5).length;
  const totalValue = allRows.reduce((s, r) => s + r.stock * r.price, 0);
  const totalCost = allRows.reduce((s, r) => s + r.stock * COST_MAP[r.category], 0);

  const toggleSort = (col: 'name' | 'stock' | 'price') => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: 'name' | 'stock' | 'price' }) => {
    if (sortBy !== col) return null;
    return sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Catálogo de Produtos" subtitle={`${totalSKUs} SKUs · Estoque em tempo real`}>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111111] border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Tag className="w-4 h-4 text-primary" />
            <span className="font-body text-xs text-gray-500">Total SKUs</span>
          </div>
          <p className="font-display font-bold text-2xl text-white">{totalSKUs}</p>
        </div>
        <div className="bg-[#111111] border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-blue-400" />
            <span className="font-body text-xs text-gray-500">Unidades em Estoque</span>
          </div>
          <p className="font-display font-bold text-2xl text-white">{totalStock}</p>
        </div>
        <div className="bg-[#111111] border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="font-body text-xs text-gray-500">Estoque Crítico</span>
          </div>
          <p className="font-display font-bold text-2xl text-white">
            {zeroStock + lowStock}
            <span className="text-xs text-gray-500 ml-1">SKUs</span>
          </p>
        </div>
        <div className="bg-[#111111] border border-white/10 p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="font-body text-xs text-gray-500">Valor em Estoque</span>
          </div>
          <p className="font-display font-bold text-xl text-white">
            R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </p>
          <p className="font-body text-xs text-gray-500 mt-0.5">
            Custo: R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-white/10 p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar por nome, SKU, cor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-black/50 border-white/10 text-white placeholder:text-gray-600 font-body text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'performance', 'lifestyle', 'limited'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 font-display font-bold text-xs tracking-wider border transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary text-black border-primary'
                    : 'text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'TODOS' : CATEGORY_LABELS[cat]?.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Stock Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'ESTOQUE: TODOS' },
              { key: 'zero', label: 'SEM ESTOQUE' },
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

          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStock}
            disabled={loadingStock}
            className="border-white/10 text-gray-400 hover:text-white gap-1.5 font-display text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingStock ? 'animate-spin' : ''}`} />
            ATUALIZAR
          </Button>
        </div>
        <p className="font-body text-xs text-gray-600 mt-2">
          {filtered.length} de {totalSKUs} SKUs exibidos
        </p>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
          <div className="col-span-3">
            <button
              onClick={() => toggleSort('name')}
              className="flex items-center gap-1 font-display font-bold text-xs text-gray-500 hover:text-white tracking-wider"
            >
              PRODUTO <SortIcon col="name" />
            </button>
          </div>
          <div className="col-span-2">
            <span className="font-display font-bold text-xs text-gray-500 tracking-wider">SKU / GESTÃO</span>
          </div>
          <div className="col-span-2">
            <span className="font-display font-bold text-xs text-gray-500 tracking-wider">COR</span>
          </div>
          <div className="col-span-1">
            <span className="font-display font-bold text-xs text-gray-500 tracking-wider">CATEG.</span>
          </div>
          <div className="col-span-1 text-right">
            <button
              onClick={() => toggleSort('price')}
              className="flex items-center gap-1 font-display font-bold text-xs text-gray-500 hover:text-white tracking-wider ml-auto"
            >
              PREÇO <SortIcon col="price" />
            </button>
          </div>
          <div className="col-span-1 text-right">
            <span className="font-display font-bold text-xs text-gray-500 tracking-wider">CUSTO</span>
          </div>
          <div className="col-span-1 text-right">
            <span className="font-display font-bold text-xs text-gray-500 tracking-wider">MARGEM</span>
          </div>
          <div className="col-span-1 text-right">
            <button
              onClick={() => toggleSort('stock')}
              className="flex items-center gap-1 font-display font-bold text-xs text-gray-500 hover:text-white tracking-wider ml-auto"
            >
              ESTOQUE <SortIcon col="stock" />
            </button>
          </div>
        </div>

        {/* Rows */}
        {loadingStock ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-500 text-xs">Carregando estoque...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Tag className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Nenhum produto encontrado</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((row, idx) => {
              const status = getStockStatus(row.stock);
              const StatusIcon = status.icon;
              const cost = COST_MAP[row.category];
              const margin = ((row.price - cost) / row.price * 100).toFixed(0);

              return (
                <div
                  key={`${row.id}-${row.color}-${idx}`}
                  className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/3 transition-colors items-center"
                >
                  {/* Produto */}
                  <div className="col-span-3">
                    <p className="font-display font-bold text-xs text-white tracking-wide">{row.name}</p>
                  </div>

                  {/* SKU */}
                  <div className="col-span-2">
                    <p className="font-mono text-xs text-primary">{row.sku}</p>
                    <p className="font-body text-xs text-gray-600 truncate mt-0.5">{row.gestaoName}</p>
                  </div>

                  {/* Cor */}
                  <div className="col-span-2">
                    <p className="font-body text-xs text-gray-300">{row.color}</p>
                  </div>

                  {/* Categoria */}
                  <div className="col-span-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-display font-bold tracking-wider border ${CATEGORY_COLORS[row.category]}`}>
                      {CATEGORY_LABELS[row.category]}
                    </span>
                  </div>

                  {/* Preço */}
                  <div className="col-span-1 text-right">
                    <p className="font-display font-bold text-xs text-white">
                      R$ {row.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  {/* Custo */}
                  <div className="col-span-1 text-right">
                    <p className="font-body text-xs text-gray-500">
                      R$ {cost.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  {/* Margem */}
                  <div className="col-span-1 text-right">
                    <p className="font-display font-bold text-xs text-green-400">{margin}%</p>
                  </div>

                  {/* Estoque */}
                  <div className="col-span-1 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <StatusIcon className={`w-3 h-3 ${status.color}`} />
                      <span className={`font-display font-bold text-sm ${status.color}`}>
                        {row.stock}
                      </span>
                    </div>
                    <p className={`font-body text-[10px] ${status.color} text-right`}>{status.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer summary */}
        {!loadingStock && filtered.length > 0 && (
          <div className="border-t border-white/10 bg-black/30 px-4 py-3 grid grid-cols-12 gap-2">
            <div className="col-span-3">
              <span className="font-display font-bold text-xs text-gray-500 tracking-wider">
                TOTAL ({filtered.length} SKUs)
              </span>
            </div>
            <div className="col-span-6" />
            <div className="col-span-1 text-right">
              <span className="font-display font-bold text-xs text-white">
                R$ {(filtered.reduce((s, r) => s + r.price, 0) / filtered.length).toFixed(0)}
              </span>
              <p className="font-body text-[10px] text-gray-600">média</p>
            </div>
            <div className="col-span-1 text-right">
              <span className="font-display font-bold text-xs text-gray-400">
                R$ {(filtered.reduce((s, r) => s + COST_MAP[r.category], 0) / filtered.length).toFixed(0)}
              </span>
              <p className="font-body text-[10px] text-gray-600">média</p>
            </div>
            <div className="col-span-1 text-right">
              <span className="font-display font-bold text-xs text-green-400">
                {(filtered.reduce((s, r) => s + ((r.price - COST_MAP[r.category]) / r.price * 100), 0) / filtered.length).toFixed(0)}%
              </span>
              <p className="font-body text-[10px] text-gray-600">média</p>
            </div>
            <div className="col-span-1 text-right">
              <span className="font-display font-bold text-sm text-white">
                {filtered.reduce((s, r) => s + r.stock, 0)}
              </span>
              <p className="font-body text-[10px] text-gray-600">total</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3 h-3 text-green-400" />
          <span>OK: &gt; 5 unidades</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-yellow-400" />
          <span>Baixo: 1–5 unidades</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-orange-400" />
          <span>Crítico: 1–2 unidades</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span>Sem Estoque: 0 unidades</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500">Custo estimado: Performance R$ 85 · Lifestyle/Ed. Limitada R$ 75</span>
        </div>
      </div>
    </AdminLayout>
  );
}
