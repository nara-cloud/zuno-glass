import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  User, Package, MapPin, LogOut, ChevronRight,
  ShoppingBag, Clock, CheckCircle, Truck, XCircle,
  Edit2, Save, X, ArrowLeft, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

type Tab = 'dashboard' | 'pedidos' | 'perfil' | 'endereco';

interface Order {
  id: string | number;
  orderNumber?: string;
  status: string;
  paymentStatus?: string;
  total: number;
  createdAt: string;
  items: Array<{
    productName?: string;
    name?: string;
    variantColorName?: string;
    quantity: number;
    unitPrice?: number;
    price?: number;
  }>;
  trackingCode?: string;
}

const statusLabel: Record<string, string> = {
  pending: 'Aguardando Pagamento',
  confirmed: 'Confirmado',
  processing: 'Processando',
  em_separacao: 'Aprovado e em Separação',
  paid: 'Pago',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const statusIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  confirmed: <CheckCircle className="w-4 h-4 text-blue-500" />,
  processing: <Clock className="w-4 h-4 text-blue-500" />,
  em_separacao: <CheckCircle className="w-4 h-4 text-green-500" />,
  paid: <CheckCircle className="w-4 h-4 text-green-500" />,
  shipped: <Truck className="w-4 h-4 text-primary" />,
  delivered: <CheckCircle className="w-4 h-4 text-green-500" />,
  cancelled: <XCircle className="w-4 h-4 text-red-500" />,
};

export default function MinhaConta() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, loading, logout, accessToken, updateUser } = useAuthContext();
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialTab = (urlParams.get('tab') as Tab) || 'dashboard';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', cpf: '' });
  const [addressForm, setAddressForm] = useState({
    zip: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const returnTo = window.location.pathname + window.location.search;
      setLocation(`/entrar?returnTo=${encodeURIComponent(returnTo)}`);
    }
  }, [loading, isAuthenticated, setLocation]);

  // Initialize forms from user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        cpf: user.cpf || '',
      });
      setAddressForm({
        zip: user.address?.zip || '',
        street: user.address?.street || '',
        number: user.address?.number || '',
        complement: user.address?.complement || '',
        neighborhood: user.address?.neighborhood || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
      });
    }
  }, [user]);

  // Processar retorno do Mercado Pago e confirmar pagamento
  useEffect(() => {
    const paymentId = urlParams.get('payment_id') || urlParams.get('collection_id');
    const collectionStatus = urlParams.get('collection_status') || urlParams.get('status');
    const externalReference = urlParams.get('external_reference');
    if ((paymentId || externalReference) && isAuthenticated && accessToken) {
      // Confirmar pagamento no servidor
      fetch('/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ paymentId, externalReference, collectionStatus }),
      }).then(r => r.json()).then(data => {
        if (data.success) {
          setPaymentConfirmed(true);
          fetchOrders();
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, accessToken]);

  // Fetch orders when tab changes or on mount if tab=pedidos
  useEffect(() => {
    if (activeTab === 'pedidos' && accessToken) {
      fetchOrders();
    }
  }, [activeTab, accessToken]);

  // Auto-fetch orders on mount if redirected from payment
  useEffect(() => {
    if (initialTab === 'pedidos' && accessToken && orders.length === 0) {
      fetchOrders();
    }
  }, [accessToken]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/auth/my-orders', {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('[MinhaConta] Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        setEditingProfile(false);
        toast.success('Perfil atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar perfil.');
      }
    } catch {
      toast.error('Erro de conexão.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ address: addressForm }),
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar endereço.');
      }
    } catch {
      toast.error('Erro de conexão.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Até logo!');
    setLocation('/');
  };

  const fetchCepData = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddressForm(prev => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'dashboard' as Tab, label: 'INÍCIO', icon: <User className="w-4 h-4" /> },
    { id: 'pedidos' as Tab, label: 'PEDIDOS', icon: <Package className="w-4 h-4" /> },
    { id: 'perfil' as Tab, label: 'PERFIL', icon: <Edit2 className="w-4 h-4" /> },
    { id: 'endereco' as Tab, label: 'ENDEREÇO', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container max-w-5xl pt-20 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl tracking-tight">
              OLÁ, {user.name?.split(' ')[0].toUpperCase()}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {user.roles?.includes('admin') && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2 font-display tracking-wider text-xs">
                  <Shield className="w-3 h-3" />
                  ADMIN
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 font-display tracking-wider text-xs"
            >
              <LogOut className="w-3 h-3" />
              SAIR
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-black font-bold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {tab.icon}
                  <span className="font-display text-xs tracking-widest">{tab.label}</span>
                  {activeTab !== tab.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="border border-border/50 bg-card/30 p-6">
                  <h2 className="font-display font-bold text-lg tracking-tight mb-4">RESUMO DA CONTA</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-border/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <span className="text-xs font-display tracking-widest text-muted-foreground">PEDIDOS</span>
                      </div>
                      <p className="font-display font-bold text-2xl">{orders.length || '—'}</p>
                    </div>
                    <div className="border border-border/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-xs font-display tracking-widest text-muted-foreground">PERFIL</span>
                      </div>
                      <p className="font-display font-bold text-sm truncate">{user.name}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-border/50 bg-card/30 p-6">
                  <h2 className="font-display font-bold text-lg tracking-tight mb-4">ACESSO RÁPIDO</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab('pedidos')}
                      className="w-full flex items-center justify-between p-3 border border-border/30 hover:border-primary/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="font-display text-sm tracking-wider">VER MEUS PEDIDOS</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setActiveTab('perfil')}
                      className="w-full flex items-center justify-between p-3 border border-border/30 hover:border-primary/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Edit2 className="w-4 h-4 text-primary" />
                        <span className="font-display text-sm tracking-wider">EDITAR PERFIL</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <Link href="/produtos">
                      <button className="w-full flex items-center justify-between p-3 border border-border/30 hover:border-primary/50 transition-colors text-left">
                        <div className="flex items-center gap-3">
                          <ShoppingBag className="w-4 h-4 text-primary" />
                          <span className="font-display text-sm tracking-wider">CONTINUAR COMPRANDO</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Pedidos */}
            {activeTab === 'pedidos' && (
              <div>
                <h2 className="font-display font-bold text-lg tracking-tight mb-6">MEUS PEDIDOS</h2>
                {/* Banner de sucesso quando redirecionado do pagamento */}
                {(paymentConfirmed || (urlParams.get('collection_status') === 'approved') || (urlParams.get('status') === 'approved')) && (
                  <div className="border border-green-500/30 bg-green-500/10 p-4 mb-6 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display font-bold text-sm text-green-400 tracking-wider">PAGAMENTO CONFIRMADO!</p>
                      <p className="font-body text-xs text-green-300/80 mt-1">Seu pedido foi aprovado e está sendo separado. Você receberá atualizações por aqui.</p>
                    </div>
                  </div>
                )}
                {ordersLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="border border-border/50 p-12 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-display text-lg tracking-tight mb-2">NENHUM PEDIDO AINDA</p>
                    <p className="text-muted-foreground text-sm mb-6">Seus pedidos aparecerão aqui após a compra.</p>
                    <Link href="/produtos">
                      <Button className="bg-primary text-black hover:bg-primary/90 font-display tracking-widest text-xs">
                        VER PRODUTOS
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border/50 bg-card/30 p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-display font-bold text-sm tracking-wider">#{order.orderNumber || order.id}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit', month: 'long', year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border ${
                            order.status === 'em_separacao' || order.status === 'paid'
                              ? 'border-green-500/30 bg-green-500/10'
                              : order.status === 'shipped'
                              ? 'border-primary/30 bg-primary/10'
                              : order.status === 'delivered'
                              ? 'border-green-500/30 bg-green-500/10'
                              : order.status === 'cancelled'
                              ? 'border-red-500/30 bg-red-500/10'
                              : 'border-yellow-500/30 bg-yellow-500/10'
                          }`}>
                            {statusIcon[order.status] || <Clock className="w-4 h-4 text-yellow-500" />}
                            <span className="text-xs font-display tracking-wider">
                              {statusLabel[order.status] || order.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {item.quantity}x {item.productName || item.name || 'Produto'}
                                {item.variantColorName && ` — ${item.variantColorName}`}
                              </span>
                              <span>R$ {((item.unitPrice ?? item.price ?? 0) * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/30">
                          <div>
                            {order.trackingCode && (
                              <p className="text-xs text-muted-foreground">
                                Rastreio: <span className="text-primary font-mono">{order.trackingCode}</span>
                              </p>
                            )}
                          </div>
                          <p className="font-display font-bold text-primary">
                            R$ {order.total.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Perfil */}
            {activeTab === 'perfil' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display font-bold text-lg tracking-tight">DADOS PESSOAIS</h2>
                  {!editingProfile ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProfile(true)}
                      className="gap-2 font-display tracking-wider text-xs"
                    >
                      <Edit2 className="w-3 h-3" />
                      EDITAR
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProfile(false)}
                        className="gap-2 font-display tracking-wider text-xs"
                      >
                        <X className="w-3 h-3" />
                        CANCELAR
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="gap-2 bg-primary text-black hover:bg-primary/90 font-display tracking-wider text-xs"
                      >
                        <Save className="w-3 h-3" />
                        SALVAR
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border border-border/50 bg-card/30 p-6 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-display tracking-widest text-muted-foreground">NOME COMPLETO</Label>
                    {editingProfile ? (
                      <Input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                        className="bg-background/50 border-border/70 h-11"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.name || '—'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-display tracking-widest text-muted-foreground">E-MAIL</Label>
                    <p className="text-sm py-2 text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-display tracking-widest text-muted-foreground">TELEFONE</Label>
                    {editingProfile ? (
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="(00) 00000-0000"
                        className="bg-background/50 border-border/70 h-11"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.phone || '—'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-display tracking-widest text-muted-foreground">CPF</Label>
                    {editingProfile ? (
                      <Input
                        value={profileForm.cpf}
                        onChange={(e) => setProfileForm(p => ({ ...p, cpf: e.target.value }))}
                        placeholder="000.000.000-00"
                        className="bg-background/50 border-border/70 h-11"
                      />
                    ) : (
                      <p className="text-sm py-2">{user.cpf || '—'}</p>
                    )}
                  </div>

                  {user.roles && user.roles.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs font-display tracking-widest text-muted-foreground">PERFIS DE ACESSO</Label>
                      <div className="flex flex-wrap gap-2 py-1">
                        {user.roles.map((role) => (
                          <Badge key={role} variant="outline" className="font-display text-xs tracking-wider">
                            {role.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Endereço */}
            {activeTab === 'endereco' && (
              <div>
                <h2 className="font-display font-bold text-lg tracking-tight mb-6">ENDEREÇO DE ENTREGA</h2>
                <div className="border border-border/50 bg-card/30 p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-display tracking-widest text-muted-foreground">CEP</Label>
                      <Input
                        value={addressForm.zip}
                        onChange={(e) => {
                          setAddressForm(p => ({ ...p, zip: e.target.value }));
                          if (e.target.value.replace(/\D/g, '').length === 8) {
                            fetchCepData(e.target.value);
                          }
                        }}
                        placeholder="00000-000"
                        className="bg-background/50 border-border/70 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-display tracking-widest text-muted-foreground">ESTADO</Label>
                      <Input
                        value={addressForm.state}
                        onChange={(e) => setAddressForm(p => ({ ...p, state: e.target.value }))}
                        placeholder="UF"
                        className="bg-background/50 border-border/70 h-11"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-display tracking-widest text-muted-foreground">RUA / LOGRADOURO</Label>
                    <Input
                      value={addressForm.street}
                      onChange={(e) => setAddressForm(p => ({ ...p, street: e.target.value }))}
                      placeholder="Rua, Avenida..."
                      className="bg-background/50 border-border/70 h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-display tracking-widest text-muted-foreground">NÚMERO</Label>
                      <Input
                        value={addressForm.number}
                        onChange={(e) => setAddressForm(p => ({ ...p, number: e.target.value }))}
                        placeholder="123"
                        className="bg-background/50 border-border/70 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-display tracking-widest text-muted-foreground">COMPLEMENTO</Label>
                      <Input
                        value={addressForm.complement}
                        onChange={(e) => setAddressForm(p => ({ ...p, complement: e.target.value }))}
                        placeholder="Apto, Bloco..."
                        className="bg-background/50 border-border/70 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-display tracking-widest text-muted-foreground">BAIRRO</Label>
                      <Input
                        value={addressForm.neighborhood}
                        onChange={(e) => setAddressForm(p => ({ ...p, neighborhood: e.target.value }))}
                        placeholder="Bairro"
                        className="bg-background/50 border-border/70 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-display tracking-widest text-muted-foreground">CIDADE</Label>
                      <Input
                        value={addressForm.city}
                        onChange={(e) => setAddressForm(p => ({ ...p, city: e.target.value }))}
                        placeholder="Cidade"
                        className="bg-background/50 border-border/70 h-11"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveAddress}
                    disabled={savingProfile}
                    className="bg-primary text-black hover:bg-primary/90 font-display tracking-widest text-xs h-11"
                  >
                    {savingProfile ? 'SALVANDO...' : 'SALVAR ENDEREÇO'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
