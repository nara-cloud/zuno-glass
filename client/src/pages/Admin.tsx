import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Plus, Pencil, Trash2, Package, ShoppingBag, X, Save,
  Eye, EyeOff, Lock, LogIn, DollarSign,
  ArrowLeft, RefreshCw, CheckCircle, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'zuno2025';

interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: string;
  image: string;
  variants: { color: string; colorName: string; image_url?: string }[];
  isNew?: boolean;
  isFeatured?: boolean;
}

interface Order {
  id: string;
  items: { name?: string; productId?: string; price?: number; quantity?: number }[];
  status: string;
  createdAt: string;
  shippingCost?: number;
  preferenceId?: string;
}

interface StockEntry {
  total: number;
  variants: Record<string, number>;
}

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  tagline: '',
  description: '',
  price: 0,
  category: 'performance',
  image: '',
  variants: [{ color: '#000000', colorName: 'Preto' }],
  isNew: false,
  isFeatured: false,
};

function Logo() {
  return (
    <Link href="/">
      <img
        src="/images/logo-zuno-official.png"
        alt="ZUNO GLASS"
        className="h-10 w-auto object-contain"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/logo-zuno-white.png'; }}
      />
    </Link>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('zuno_admin') === 'true';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stock, setStock] = useState<Record<string, StockEntry>>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stock'>('products');

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);

  // Stock editing state
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockDraft, setStockDraft] = useState<Record<string, number>>({});
  const [savingStock, setSavingStock] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes, stockRes] = await Promise.all([
        fetch('/api/catalog'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/stock'),
      ]);
      const productsData = await productsRes.json();
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];
      const stockData = stockRes.ok ? await stockRes.json() : {};
      setProducts(Array.isArray(productsData) ? productsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setStock(stockData && typeof stockData === 'object' ? stockData : {});
    } catch {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated, loadData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('zuno_admin', 'true');
      setLoginError('');
    } else {
      setLoginError('Senha incorreta. Tente novamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('zuno_admin');
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(EMPTY_PRODUCT);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      tagline: product.tagline || '',
      description: product.description || '',
      price: product.price,
      category: product.category,
      image: product.image || '',
      variants: product.variants?.length ? product.variants : [{ color: '#000000', colorName: 'Preto' }],
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Nome do produto é obrigatório'); return; }
    if (formData.price <= 0) { toast.error('Preço deve ser maior que zero'); return; }
    setSaving(true);
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erro ao salvar produto');
      }
      toast.success(editingProduct ? 'Produto atualizado! O site já reflete a mudança.' : 'Produto criado! Já aparece no site.');
      setShowForm(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Excluir "${productName}"? Esta ação não pode ser desfeita.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir');
      toast.success('Produto excluído! O site foi atualizado.');
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openStockEdit = (product: Product) => {
    const productStock = stock[product.id]?.variants || {};
    const draft: Record<string, number> = {};
    for (const v of product.variants || []) {
      const key = v.colorName || v.color;
      draft[key] = productStock[key] ?? 99;
    }
    setStockDraft(draft);
    setEditingStock(product.id);
  };

  const handleSaveStock = async (productId: string) => {
    setSavingStock(true);
    try {
      const res = await fetch(`/api/admin/stock/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants: stockDraft }),
      });
      if (!res.ok) throw new Error('Erro ao salvar estoque');
      toast.success('Estoque atualizado! O site já reflete a mudança.');
      setEditingStock(null);
      loadData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingStock(false);
    }
  };

  const addVariant = () => setFormData(p => ({ ...p, variants: [...p.variants, { color: '#000000', colorName: '' }] }));
  const removeVariant = (i: number) => setFormData(p => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));
  const updateVariant = (i: number, field: string, value: string) =>
    setFormData(p => ({ ...p, variants: p.variants.map((v, idx) => idx === i ? { ...v, [field]: value } : v) }));

  // Stats
  const totalRevenue = orders
    .filter(o => o.status === 'approved' || o.status === 'paid')
    .reduce((sum, o) => sum + o.items.reduce((s, item) => s + (item.price || 0) * (item.quantity || 1), 0) + (o.shippingCost || 0), 0);
  const approvedOrders = orders.filter(o => o.status === 'approved' || o.status === 'paid').length;
  const totalStock = Object.values(stock).reduce((sum, s: any) => sum + (s.total ?? s.default ?? 0), 0);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          <Logo />
        </div>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white tracking-widest mb-1">PAINEL ADMIN</h1>
            <p className="font-body text-sm text-gray-500">Área restrita — ZUNO GLASS</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-6 space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Senha de acesso"
                autoFocus
                className="w-full bg-black/50 border border-white/10 px-4 py-3 font-body text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {loginError && <p className="font-body text-xs text-red-400">{loginError}</p>}
            <Button
              type="submit"
              className="w-full bg-primary text-black hover:bg-white font-display font-bold tracking-wider h-11"
            >
              <LogIn className="w-4 h-4 mr-2" />
              ENTRAR
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link href="/" className="font-body text-xs text-gray-600 hover:text-white transition-colors flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Voltar ao site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN PANEL
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Admin Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="font-display text-xs text-gray-500 tracking-widest hidden md:block">/ ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 text-gray-500 hover:text-white transition-colors"
              title="Atualizar dados"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link href="/" className="font-body text-xs text-gray-500 hover:text-white transition-colors hidden md:block">
              Ver site
            </Link>
            <button
              onClick={handleLogout}
              className="font-display text-xs text-gray-500 hover:text-red-400 transition-colors border border-white/10 px-3 py-1.5"
            >
              SAIR
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white tracking-wider">PAINEL DE GESTÃO</h1>
          <p className="font-body text-sm text-gray-500 mt-1">Gerencie produtos, estoque e pedidos da ZUNO GLASS</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: 'PRODUTOS', value: products.length, color: 'text-primary', bg: 'bg-primary/10' },
            { icon: BarChart3, label: 'ESTOQUE TOTAL', value: totalStock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
            { icon: CheckCircle, label: 'APROVADOS', value: approvedOrders, color: 'text-green-400', bg: 'bg-green-400/10' },
            { icon: DollarSign, label: 'RECEITA', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
              <div className={`w-8 h-8 ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="font-body text-[10px] text-gray-500 tracking-widest">{stat.label}</p>
              <p className={`font-display font-bold text-xl ${stat.color} mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-white/10">
          {[
            { id: 'products', label: 'PRODUTOS', icon: Package },
            { id: 'stock', label: 'ESTOQUE', icon: BarChart3 },
            { id: 'orders', label: 'PEDIDOS', icon: ShoppingBag },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-display font-bold text-xs tracking-wider transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="font-body text-sm text-gray-500">{products.length} produtos cadastrados</p>
              <Button
                onClick={openAddForm}
                className="bg-primary text-black hover:bg-white font-display font-bold tracking-wider text-xs"
              >
                <Plus className="w-4 h-4 mr-2" />
                NOVO PRODUTO
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10">
                <Package className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="font-display text-gray-500 tracking-wider">NENHUM PRODUTO CADASTRADO</p>
                <button onClick={openAddForm} className="mt-4 font-body text-xs text-primary hover:text-white transition-colors">
                  Adicionar primeiro produto →
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {products.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors group"
                  >
                    <div className="w-14 h-14 bg-black/60 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-display text-xs text-gray-700">Z</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-sm text-white">{product.name}</span>
                        {product.isNew && (
                          <span className="bg-primary text-black font-display text-[9px] px-1.5 py-0.5 tracking-widest">NOVO</span>
                        )}
                        {product.isFeatured && (
                          <span className="bg-white/10 text-white font-display text-[9px] px-1.5 py-0.5 tracking-widest">DESTAQUE</span>
                        )}
                      </div>
                      <p className="font-body text-xs text-gray-500 mt-0.5 truncate max-w-xs">{product.tagline}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="font-display text-xs text-primary font-bold">
                          R$ {Number(product.price).toFixed(2).replace('.', ',')}
                        </span>
                        <span className="font-body text-[10px] text-gray-600 uppercase tracking-wider bg-white/5 px-2 py-0.5">
                          {product.category}
                        </span>
                        <span className="font-body text-[10px] text-gray-600">
                          {product.variants?.length || 0} cor(es)
                        </span>
                        {stock[product.id] && (
                          <span className={`font-body text-[10px] px-2 py-0.5 ${
                            stock[product.id].total > 10 ? 'text-green-400 bg-green-400/10' :
                            stock[product.id].total > 0 ? 'text-yellow-400 bg-yellow-400/10' :
                            'text-red-400 bg-red-400/10'
                          }`}>
                            Estoque: {stock[product.id].total}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { openStockEdit(product); setActiveTab('stock'); }}
                        className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                        title="Editar estoque"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditForm(product)}
                        className="p-2 text-gray-500 hover:text-primary transition-colors"
                        title="Editar produto"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STOCK TAB */}
        {activeTab === 'stock' && (
          <div>
            <p className="font-body text-sm text-gray-500 mb-6">
              Ajuste o estoque de cada produto. As alterações refletem <strong className="text-white">imediatamente</strong> no site.
            </p>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {products.map(product => {
                  const rawStock = stock[product.id] || {};
                  const productStock = {
                    total: rawStock.total ?? rawStock.default ?? 0,
                    variants: rawStock.variants && typeof rawStock.variants === 'object' ? rawStock.variants : {},
                  };
                  const isEditing = editingStock === product.id;

                  return (
                    <div key={product.id} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-black/60 flex-shrink-0 overflow-hidden">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="font-display text-xs text-gray-700">Z</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-sm text-white truncate">{product.name}</p>
                            <p className={`font-body text-xs mt-0.5 ${
                              productStock.total > 10 ? 'text-green-400' :
                              productStock.total > 0 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              Total em estoque: {productStock.total}
                            </p>
                          </div>
                        </div>

                        {!isEditing && (
                          <button
                            onClick={() => openStockEdit(product)}
                            className="font-display text-[10px] text-primary hover:text-white border border-primary/30 hover:border-white/30 px-3 py-1.5 transition-colors tracking-wider flex-shrink-0"
                          >
                            EDITAR
                          </button>
                        )}
                      </div>

                      {/* Variantes */}
                      {!isEditing && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(productStock.variants).map(([varName, qty]) => (
                            <span key={varName} className={`font-body text-[10px] px-2 py-1 border ${
                              qty > 10 ? 'border-green-400/30 text-green-400' :
                              qty > 0 ? 'border-yellow-400/30 text-yellow-400' :
                              'border-red-400/30 text-red-400'
                            }`}>
                              {varName}: {qty}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Editing form */}
                      {isEditing && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <p className="font-display text-[10px] text-gray-400 tracking-widest mb-3">QUANTIDADE POR VARIANTE</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {Object.entries(stockDraft).map(([varName, qty]) => (
                              <div key={varName}>
                                <label className="font-body text-[10px] text-gray-500 block mb-1">{varName}</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={qty}
                                  onChange={e => setStockDraft(d => ({ ...d, [varName]: parseInt(e.target.value) || 0 }))}
                                  className="w-full bg-black/50 border border-white/10 px-3 py-2 font-body text-white text-sm focus:outline-none focus:border-primary/50"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setEditingStock(null)}
                              className="flex-1 border border-white/20 text-gray-400 hover:text-white font-display text-xs tracking-wider py-2 transition-colors"
                            >
                              CANCELAR
                            </button>
                            <button
                              onClick={() => handleSaveStock(product.id)}
                              disabled={savingStock}
                              className="flex-1 bg-primary text-black hover:bg-white font-display font-bold text-xs tracking-wider py-2 transition-colors flex items-center justify-center gap-2"
                            >
                              {savingStock ? (
                                <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                              SALVAR ESTOQUE
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <p className="font-body text-sm text-gray-500 mb-6">{orders.length} pedidos registrados</p>
            {orders.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10">
                <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="font-display text-gray-500 tracking-wider">NENHUM PEDIDO AINDA</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[...orders].reverse().map(order => {
                  const total = order.items.reduce((s, item) => s + (item.price || 0) * (item.quantity || 1), 0) + (order.shippingCost || 0);
                  return (
                    <div key={order.id} className="bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap mb-2">
                            <span className="font-display font-bold text-sm text-white">
                              #{order.id?.slice(-8)?.toUpperCase() || 'N/A'}
                            </span>
                            <span className={`font-display text-[10px] px-2 py-0.5 tracking-widest ${
                              order.status === 'approved' || order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {order.status === 'approved' || order.status === 'paid' ? 'APROVADO' :
                               order.status === 'pending' ? 'PENDENTE' : order.status?.toUpperCase()}
                            </span>
                            <span className="font-body text-[10px] text-gray-500">
                              {new Date(order.createdAt).toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            {order.items?.map((item, i) => (
                              <p key={i} className="font-body text-xs text-gray-400">
                                {item.quantity || 1}x {item.name || item.productId || 'Produto'} — R$ {Number(item.price || 0).toFixed(2).replace('.', ',')}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-display font-bold text-sm text-primary">
                            R$ {total.toFixed(2).replace('.', ',')}
                          </p>
                          <p className="font-body text-[10px] text-gray-500 mt-0.5">
                            {order.shippingCost === 0 ? 'Frete grátis' : `Frete: R$ ${Number(order.shippingCost || 0).toFixed(2).replace('.', ',')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRODUCT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 z-[200] flex items-start justify-center overflow-y-auto">
          <div className="w-full max-w-2xl mx-4 my-8 bg-[#0f0f0f] border border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0f0f0f] z-10">
              <h2 className="font-display font-bold text-lg text-white tracking-wider">
                {editingProduct ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="font-display text-[10px] text-gray-400 tracking-widest block mb-1.5">NOME DO PRODUTO *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: ZUNO ARVEN"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 font-body text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-display text-[10px] text-gray-400 tracking-widest block mb-1.5">TAGLINE</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData(p => ({ ...p, tagline: e.target.value }))}
                  placeholder="Ex: Velocidade sem limites"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 font-body text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm"
                />
              </div>

              <div>
                <label className="font-display text-[10px] text-gray-400 tracking-widest block mb-1.5">DESCRIÇÃO</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Descrição completa do produto..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 font-body text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 resize-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-display text-[10px] text-gray-400 tracking-widest block mb-1.5">PREÇO (R$) *</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={e => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="189.90"
                    step="0.01"
                    min="0.01"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 font-body text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="font-display text-[10px] text-gray-400 tracking-widest block mb-1.5">CATEGORIA *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 font-body text-white focus:outline-none focus:border-primary/50 text-sm"
                  >
                    <option value="performance">Performance</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-display text-[10px] text-gray-400 tracking-widest block mb-1.5">URL DA IMAGEM PRINCIPAL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData(p => ({ ...p, image: e.target.value }))}
                  placeholder="/images/products/meu-produto.webp ou https://..."
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 font-body text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm"
                />
                {formData.image && (
                  <div className="mt-2 w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center p-1">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-display text-[10px] text-gray-400 tracking-widest">CORES / VARIANTES</label>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="font-display text-[10px] text-primary hover:text-white transition-colors flex items-center gap-1 tracking-wider"
                  >
                    <Plus className="w-3 h-3" /> ADICIONAR
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.variants.map((variant, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={variant.color}
                        onChange={e => updateVariant(i, 'color', e.target.value)}
                        className="w-9 h-9 bg-transparent border border-white/10 cursor-pointer p-0.5 rounded-none"
                      />
                      <input
                        type="text"
                        value={variant.colorName}
                        onChange={e => updateVariant(i, 'colorName', e.target.value)}
                        placeholder="Nome da cor"
                        className="flex-1 bg-white/5 border border-white/10 px-3 py-2 font-body text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50"
                      />
                      <input
                        type="text"
                        value={variant.image_url || ''}
                        onChange={e => updateVariant(i, 'image_url', e.target.value)}
                        placeholder="URL imagem (opcional)"
                        className="flex-1 bg-white/5 border border-white/10 px-3 py-2 font-body text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50"
                      />
                      {formData.variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(i)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew || false}
                    onChange={e => setFormData(p => ({ ...p, isNew: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="font-display text-[10px] text-gray-400 tracking-wider">MARCAR COMO NOVO</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={e => setFormData(p => ({ ...p, isFeatured: e.target.checked }))}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="font-display text-[10px] text-gray-400 tracking-wider">DESTAQUE NA HOME</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-white/20 text-gray-400 hover:text-white font-display text-xs tracking-wider"
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-black hover:bg-white font-display font-bold tracking-wider text-xs"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      SALVANDO...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-3 h-3" />
                      {editingProduct ? 'SALVAR ALTERAÇÕES' : 'CRIAR PRODUTO'}
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
