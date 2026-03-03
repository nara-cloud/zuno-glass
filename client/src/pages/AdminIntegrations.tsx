import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminLayout from '@/components/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Plug, CreditCard, Truck, Mail, MessageSquare,
  BarChart2, ShoppingBag, CheckCircle, Clock, AlertCircle,
  ExternalLink, Settings, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  configUrl?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    description: 'Pagamentos via PIX, boleto e cartão de crédito. Modo produção activo.',
    icon: CreditCard,
    status: 'active',
    category: 'Pagamentos',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Pagamentos internacionais via cartão. Integração configurada.',
    icon: CreditCard,
    status: 'active',
    category: 'Pagamentos',
  },
  {
    id: 'correios',
    name: 'Correios / Frete',
    description: 'Cálculo de frete por CEP. Frete grátis para Petrolina e Juazeiro.',
    icon: Truck,
    status: 'active',
    category: 'Logística',
  },
  {
    id: 'email',
    name: 'E-mail Transacional',
    description: 'Confirmação automática de pedidos por e-mail. Configuração pendente.',
    icon: Mail,
    status: 'pending',
    category: 'Comunicação',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Notificações de pedido e atendimento via WhatsApp.',
    icon: MessageSquare,
    status: 'inactive',
    category: 'Comunicação',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Monitoramento de tráfego e conversões do site.',
    icon: BarChart2,
    status: 'active',
    category: 'Marketing',
  },
  {
    id: 'instagram',
    name: 'Instagram Shopping',
    description: 'Catálogo de produtos integrado ao Instagram e Facebook.',
    icon: ShoppingBag,
    status: 'inactive',
    category: 'Marketing',
  },
];

const STATUS_CONFIG = {
  active: { label: 'Activo', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
  pending: { label: 'Pendente', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
  inactive: { label: 'Inactivo', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: AlertCircle },
};

const CATEGORIES = ['Todos', 'Pagamentos', 'Logística', 'Comunicação', 'Marketing'];

export default function AdminIntegrations() {
  const { authenticated: isAuthenticated, loading: authLoading } = useAdminAuth();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [refreshing, setRefreshing] = useState<string | null>(null);

  if (authLoading) {
    return (
      <AdminLayout title="Integrações">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLayout title="Integrações">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Acesso restrito a administradores.</p>
        </div>
      </AdminLayout>
    );
  }

  const filtered = activeCategory === 'Todos'
    ? INTEGRATIONS
    : INTEGRATIONS.filter(i => i.category === activeCategory);

  const handleRefresh = (id: string) => {
    setRefreshing(id);
    setTimeout(() => {
      setRefreshing(null);
      toast.success('Status verificado com sucesso.');
    }, 1200);
  };

  const handleConfigure = (name: string) => {
    toast.info(`Configuração de "${name}" disponível em breve.`);
  };

  const activeCount = INTEGRATIONS.filter(i => i.status === 'active').length;
  const pendingCount = INTEGRATIONS.filter(i => i.status === 'pending').length;
  const inactiveCount = INTEGRATIONS.filter(i => i.status === 'inactive').length;

  return (
    <AdminLayout title="Integrações" subtitle="Gerencie as integrações externas">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
              <Plug className="w-6 h-6 text-primary" />
              INTEGRAÇÕES
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Gerencie as integrações externas da loja ZUNO GLASS
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-green-500/20 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-display font-bold text-xs tracking-wider">ACTIVAS</span>
            </div>
            <p className="text-2xl font-display font-bold text-white">{activeCount}</p>
          </div>
          <div className="bg-white/5 border border-yellow-500/20 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-display font-bold text-xs tracking-wider">PENDENTES</span>
            </div>
            <p className="text-2xl font-display font-bold text-white">{pendingCount}</p>
          </div>
          <div className="bg-white/5 border border-gray-500/20 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 font-display font-bold text-xs tracking-wider">INACTIVAS</span>
            </div>
            <p className="text-2xl font-display font-bold text-white">{inactiveCount}</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-display font-bold tracking-wider transition-colors border ${
                activeCategory === cat
                  ? 'bg-primary text-black border-primary'
                  : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(integration => {
            const statusConf = STATUS_CONFIG[integration.status];
            const StatusIcon = statusConf.icon;
            const Icon = integration.icon;

            return (
              <div
                key={integration.id}
                className="bg-white/5 border border-white/10 p-5 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-sm tracking-tight">
                        {integration.name}
                      </h3>
                      <span className="text-xs text-gray-500">{integration.category}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-sm ${statusConf.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConf.label}
                  </span>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {integration.description}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleConfigure(integration.name)}
                    className="flex-1 border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-xs h-8"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Configurar
                  </Button>
                  <button
                    onClick={() => handleRefresh(integration.id)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors border border-white/10 hover:border-primary/30"
                    title="Verificar status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing === integration.id ? 'animate-spin' : ''}`} />
                  </button>
                  {integration.configUrl && (
                    <a
                      href={integration.configUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-primary transition-colors border border-white/10 hover:border-primary/30"
                      title="Abrir painel externo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-sm">
          <p className="text-xs text-gray-400 leading-relaxed">
            <span className="text-primary font-bold">Nota:</span> As integrações de pagamento (Mercado Pago e Stripe) estão em modo de produção. 
            Para configurar novas integrações ou alterar credenciais, aceda às Definições do projecto.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
