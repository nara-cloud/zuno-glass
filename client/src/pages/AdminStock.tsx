import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import Admin from './Admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, RefreshCw, AlertTriangle, CheckCircle, Boxes } from 'lucide-react';
import { toast } from 'sonner';

interface StockItem {
  ecommerceProductId: string;
  ecommerceProductName: string;
  ecommerceColorName: string;
  gestaoProductId: string;
  gestaoName: string;
  currentStock: number;
}

export default function AdminStock() {
  const { authenticated, loading, getAuthHeaders } = useAdminAuth();
  const [stock, setStock] = useState<StockItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (authenticated) loadStock();
  }, [authenticated]);

  const loadStock = async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/stock', {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setStock(data);
      } else {
        toast.error('Erro ao carregar estoque');
      }
    } catch {
      toast.error('Erro ao carregar estoque');
    } finally {
      setDataLoading(false);
    }
  };

  const handleRefresh = async () => {
    setDataLoading(true);
    try {
      await fetch('/api/stock/refresh', { method: 'POST' });
      await loadStock();
      toast.success('Estoque atualizado');
    } catch {
      toast.error('Erro ao atualizar estoque');
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!authenticated) return <Admin />;

  const filtered = stock.filter(item =>
    !search ||
    item.ecommerceProductName.toLowerCase().includes(search.toLowerCase()) ||
    item.ecommerceColorName.toLowerCase().includes(search.toLowerCase()) ||
    item.gestaoName.toLowerCase().includes(search.toLowerCase())
  );

  // Group by product
  const grouped = filtered.reduce<Record<string, StockItem[]>>((acc, item) => {
    const key = item.ecommerceProductId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const lowStockCount = stock.filter(i => i.currentStock > 0 && i.currentStock <= 3).length;
  const outOfStockCount = stock.filter(i => i.currentStock === 0).length;
  const inStockCount = stock.filter(i => i.currentStock > 3).length;

  return (
    <AdminLayout title="Estoque" subtitle="Sincronizado com ZUNO Gestão">
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-green-400/5 border-green-400/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-green-400">{inStockCount}</p>
              <p className="font-body text-[10px] text-gray-500">Em Estoque</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-400/5 border-yellow-400/20">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-yellow-400">{lowStockCount}</p>
              <p className="font-body text-[10px] text-gray-500">Estoque Baixo</p>
            </CardContent>
          </Card>
          <Card className="bg-red-400/5 border-red-400/20">
            <CardContent className="p-4 text-center">
              <Boxes className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="font-display font-bold text-xl text-red-400">{outOfStockCount}</p>
              <p className="font-body text-[10px] text-gray-500">Sem Estoque</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Buscar produto ou cor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={dataLoading}
            className="border-white/10 text-gray-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Stock Table */}
        {dataLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <Boxes className="w-8 h-8 mb-2 opacity-30" />
            <p className="font-body text-sm">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([productId, variants]) => {
              const productName = variants[0].ecommerceProductName;
              const totalStock = variants.reduce((s, v) => s + v.currentStock, 0);
              return (
                <Card key={productId} className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-display font-bold text-sm text-white tracking-wider">{productName}</CardTitle>
                      <span className={`font-display font-bold text-sm ${totalStock === 0 ? 'text-red-400' : totalStock <= 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {totalStock} total
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {variants.map(variant => (
                        <div
                          key={variant.gestaoProductId}
                          className={`p-2 border text-center ${
                            variant.currentStock === 0
                              ? 'border-red-400/30 bg-red-400/5'
                              : variant.currentStock <= 3
                              ? 'border-yellow-400/30 bg-yellow-400/5'
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <p className="font-body text-[10px] text-gray-400 truncate">{variant.ecommerceColorName}</p>
                          <p className={`font-display font-bold text-lg ${
                            variant.currentStock === 0 ? 'text-red-400' : variant.currentStock <= 3 ? 'text-yellow-400' : 'text-white'
                          }`}>
                            {variant.currentStock}
                          </p>
                          {variant.currentStock === 0 && (
                            <p className="font-body text-[9px] text-red-400">Esgotado</p>
                          )}
                          {variant.currentStock > 0 && variant.currentStock <= 3 && (
                            <p className="font-body text-[9px] text-yellow-400">Baixo</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
