import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Zap, Coffee, Star } from 'lucide-react';
import { products } from '@/lib/products';

const collections = [
  {
    id: 'performance',
    name: 'PERFORMANCE',
    description: 'Óculos de alta performance para atletas e praticantes de esportes. Tecnologia UV400, leveza extrema e design aerodinâmico.',
    icon: Zap,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
    category: 'performance' as const,
  },
  {
    id: 'lifestyle',
    name: 'LIFESTYLE',
    description: 'Óculos casuais com estilo urbano para o dia a dia. Design sofisticado que combina moda e funcionalidade.',
    icon: Coffee,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
    category: 'lifestyle' as const,
  },
  {
    id: 'limited',
    name: 'EDIÇÃO LIMITADA',
    description: 'Modelos exclusivos em quantidades limitadas. Peças únicas para quem busca o diferencial máximo.',
    icon: Star,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    category: 'limited' as const,
  },
];

export default function AdminCollections() {
  const esportivos = products.filter(p => p.category === 'performance');
  const casuais = products.filter(p => p.category === 'lifestyle');
  const limitados = products.filter(p => p.category === 'limited');

  const productsByCollection: Record<string, typeof products> = {
    performance: esportivos,
    lifestyle: casuais,
    limited: limitados,
  };

  return (
    <AdminLayout title="COLEÇÕES" subtitle="Gestão de coleções de produtos">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {collections.map(col => {
          const colProducts = productsByCollection[col.id];
          return (
            <Card key={col.id} className={`bg-[#1a1a1a] border ${col.bg} p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <col.icon className={`w-5 h-5 ${col.color}`} />
                <h3 className={`font-display font-bold text-sm ${col.color}`}>{col.name}</h3>
              </div>
              <p className="font-body text-xs text-gray-500 mb-4 leading-relaxed">{col.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-gray-600">{colProducts.length} produto(s)</span>
                <Badge className={`${col.bg} ${col.color} border text-[10px]`}>Activa</Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {collections.map(col => {
        const colProducts = productsByCollection[col.id];
        if (colProducts.length === 0) return null;
        return (
          <Card key={col.id} className="bg-[#1a1a1a] border-white/10 mb-4">
            <div className={`p-4 border-b border-white/10 flex items-center gap-2`}>
              <col.icon className={`w-4 h-4 ${col.color}`} />
              <h2 className="font-display font-bold text-sm text-white tracking-wider">{col.name}</h2>
              <Badge className={`${col.bg} ${col.color} border text-[10px] ml-auto`}>{colProducts.length} produtos</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-body">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Produto', 'Categoria', 'Preço', 'Variantes'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-gray-500 font-bold tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {colProducts.map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3 text-white font-bold">{p.name}</td>
                      <td className="px-4 py-3">
                        <Badge className={`${col.bg} ${col.color} border text-[10px]`}>{p.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-primary font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {(p as any).variants?.length || (p as any).colors?.length || 1} variante(s)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
      })}
    </AdminLayout>
  );
}
