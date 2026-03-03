import { useAuth } from '@/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react';

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirecionar para login se não autenticado
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Verificar se é admin
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar o painel administrativo</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation('/')} className="w-full">
              Voltar para Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
              <p className="text-gray-400 mt-1">Bem-vindo, {user?.name}</p>
            </div>
            <Button variant="outline" onClick={() => setLocation('/')}>
              Voltar para Loja
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">Total de Vendas</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">R$ 12.450</div>
              <p className="text-xs text-gray-400 mt-1">+12% desde ontem</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">Pedidos</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24</div>
              <p className="text-xs text-gray-400 mt-1">8 pendentes</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">Produtos</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">32</div>
              <p className="text-xs text-gray-400 mt-1">5 com estoque baixo</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-300">Usuários</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">156</div>
              <p className="text-xs text-gray-400 mt-1">+8 novos hoje</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setLocation('/admin/products')}>
            <CardHeader>
              <CardTitle className="text-lg">Gerenciar Produtos</CardTitle>
              <CardDescription>Adicionar, editar ou remover produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Acessar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setLocation('/admin/sales')}>
            <CardHeader>
              <CardTitle className="text-lg">Relatório de Vendas</CardTitle>
              <CardDescription>Ver vendas e receita em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Acessar
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setLocation('/admin/stock')}>
            <CardHeader>
              <CardTitle className="text-lg">Gerenciar Estoque</CardTitle>
              <CardDescription>Atualizar níveis de estoque</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Acessar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
