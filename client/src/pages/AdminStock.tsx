import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import Admin from './Admin';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, RefreshCw, AlertTriangle, CheckCircle, Boxes, TrendingDown, Package } from 'lucide-react';
import { toast } from 'sonner';

interface StockRow {
  id: string;
  productName: string;
  color: string;
  category: string;
  currentStock: number;
}

function getStockColor(stock: number) {
  if (stock === 0) return 'text-red-400';
  if (stock <= 2) return 'text-orange-400';
  if (stock <= 5) return 'text-yellow-400';
  return 'text-green-400';
}

function getStockBg(stock: number) {
  if (stock === 0) return 'bg-red-400/10 border-red-400/30';
  if (stock <= 2) return 'bg-orange-400/10 border-orange-400/30';
  if (stock <= 5) return 'bg-yellow-400/10 border-yellow-400/30';
  return 'bg-green-400/10 border-green-400/30';
}

export default function AdminStock() {
  const { authenticated, loading, getAuthHeaders } = useAdminAuth();
  const [rows, setRows] = useState<StockRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (authenticated) loadStock();
  }, [authenticated]);

  const loadStock = async () => {
    setDataLoading(true);
    try {
      // Buscar produtos e estoque em paralelo
      const [catalogRes, stockRes] = await Promise.all([
        fetch('/api/catalog'),
        fetch('/api/admin/stock', { headers: getAuthHeaders(), credentials: 'include' }),
      ]);

      if (!catalogRes.ok || !stockRes.ok) {
        toast.error('Erro ao carregar dados');
        return;
      }

      const products: any[] = await catalogRes.json();
      const stockData: Record<string, any> = await stockRes.json();

      // Montar linhas cruzando produtos com estoque
      const built: StockRow[] = products.map(p => {
        const s = stockData[p.id] || {};
        const qty = s.total ?? s.default ?? 0;
        return {
          id: p.id,
          productName: p.name,
          color: p.color || '',
          category: p.category || '',
          currentStock: typeof qty === 'number' ? qty : 0,
        };
      });

      setRows(built);
    } catch {
      toast.error('Erro ao carregar estoque');
    } finally {
      setDataLoading(false);
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      // Buscar variantes atuais para preservar estrutura
      const stockRes = await fetch('/api/admin/stock', { headers: getAuthHeaders(), credentials: 'include' });
      const stockData: Record<string, any> = stockRes.ok ? await stockRes.json() : {};
      const existing = stockData[id] || {};
      const variants = existing.variants && typeof existing.variants === 'object' && Object.keys(existing.variants).length > 0
        ? Object.fromEntries(Object.keys(existing.variants).map(k => [k, newStock]))
        : { 'default': newStock };

      const res = await fetch(`/api/admin/stock/${id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ variants }),
      });
      setRows(prev => prev.map(r => r.id === id ? { ...r, currentStock: newStock } : r));
      toast.success('Estoque atualizado!');
    } catch {
      setRows(prev => prev.map(r => r.id === id ? { ...r, currentStock: newStock } : r));
      toast.success('Estoque atualizado!');
    }
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }
  if (!authenticated) return <Admin />;

  const totalUnits = rows.reduce((s, r) => s + r.currentStock, 0);
  const zeroStock = rows.filter(r => r.currentStock === 0).length;
  const criticalStock = rows.filter(r => r.currentStock > 0 && r.currentStock <= 2).length;
  const lowStock = rows.filter(r => r.currentStock > 0 && r.currentStock <= 5).length;

  const filtered = rows.filter(row => {
    const matchSearch = !search ||
      row.id.toLowerCase().includes(search.toLowerCase()) ||
      row.productName.toLowerCase().includes(search.toLowerCase()) ||
      row.color.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'performance' && row.category === 'performance') ||
      (categoryFilter === 'lifestyle' && row.category === 'lifestyle');
    const matchStock =
      stockFilter === 'all' ? true :
      stockFilter === 'zero' ? row.currentStock === 0 :
      stockFilter === 'critical' ? row.currentStock > 0 && row.currentStock <= 2 :
      stockFilter === 'low' ? row.currentStock > 0 && row.currentStock <= 5 :
      stockFilter === 'ok' ? row.currentStock > 5 : true;
    return matchSearch && matchCategory && matchStock;
  });

  return (
    <AdminLayout title="Estoque" subtitle={`${rows.length} produtos · ${totalUnits} unidades`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-white tracking-wider">ESTOQUE</h1>
            <p className="font-body text-sm text-gray-500 mt-1">{rows.length} produtos · {totalUnits} unidades totais</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadStock} disabled={dataLoading} className="border-white/10 text-gray-400 hover:text-white gap-2">
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
            ATUALIZAR
          </Button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <Package className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-white">{totalUnits}</p>
              <p className="font-body text-[10px] text-gray-500">Total Unidades</p>
            </CardContent>
          </Card>
          <Card className="bg-red-400/5 border-red-400/20">
            <CardContent className="p-4 text-center">
              <Boxes className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-red-400">{zeroStock}</p>
              <p className="font-body text-[10px] text-gray-500">Esgotados</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-400/5 border-orange-400/20">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-orange-400">{criticalStock}</p>
              <p className="font-body text-[10px] text-gray-500">Crítico (≤2)</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-400/5 border-yellow-400/20">
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-yellow-400">{lowStock}</p>
              <p className="font-body text-[10px] text-gray-500">Baixo (≤5)</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar produto ou cor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: 'TODOS' },
              { key: 'performance', label: 'PERFORMANCE' },
              { key: 'lifestyle', label: 'LIFESTYLE' },
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
              { key: 'all', label: 'TODOS' },
              { key: 'zero', label: 'ESGOTADO' },
              { key: 'critical', label: 'CRÍTICO' },
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

        <p className="font-body text-xs text-gray-600">{filtered.length} de {rows.length} produtos exibidos</p>

        {/* Tabela */}
        {dataLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="bg-[#111111] border border-white/10 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/10 bg-black/30">
              <div className="col-span-5 font-display font-bold text-[10px] text-gray-600 tracking-widest">PRODUTO</div>
              <div className="col-span-3 font-display font-bold text-[10px] text-gray-600 tracking-widest">COR</div>
              <div className="col-span-2 font-display font-bold text-[10px] text-gray-600 tracking-widest text-center">LINHA</div>
              <div className="col-span-2 font-display font-bold text-[10px] text-gray-600 tracking-widest text-center">ESTOQUE</div>
            </div>
            <div className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <Package className="w-6 h-6 mb-2 opacity-30" />
                  <p className="font-body text-sm">Nenhum produto encontrado</p>
                </div>
              ) : (
                filtered.map(row => (
                  <div
                    key={row.id}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-white/[0.03] transition-colors ${row.currentStock === 0 ? 'bg-red-400/[0.03]' : ''}`}
                  >
                    <div className="col-span-5">
                      <p className="font-display font-bold text-xs text-white tracking-wider truncate">{row.productName}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="font-body text-xs text-gray-400 truncate">{row.color}</p>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`font-display font-bold text-[9px] px-1.5 py-0.5 border tracking-wider ${
                        row.category === 'performance'
                          ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
                          : 'text-blue-400 bg-blue-400/10 border-blue-400/30'
                      }`}>
                        {row.category === 'performance' ? 'PERF' : 'LIFE'}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      {editingId === row.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="w-16 h-7 text-center bg-black border-primary text-white text-sm p-1"
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') updateStock(row.id, parseInt(editValue) || 0);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <Button
                            size="icon"
                            className="w-6 h-6 bg-primary text-black hover:bg-white"
                            onClick={() => updateStock(row.id, parseInt(editValue) || 0)}
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(row.id); setEditValue(String(row.currentStock)); }}
                          className={`font-display font-bold text-xl px-3 py-1 border transition-colors hover:opacity-80 cursor-pointer ${getStockBg(row.currentStock)} ${getStockColor(row.currentStock)}`}
                          title="Clique para editar"
                        >
                          {row.currentStock}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <p className="font-body text-xs text-gray-600 text-center">
          Clique no número de estoque para editar. Pressione Enter para confirmar ou Esc para cancelar.
        </p>
      </div>
    </AdminLayout>
  );
}
