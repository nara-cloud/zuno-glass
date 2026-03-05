import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function AdminBot() {
  return (
    <AdminLayout title="BOT Z4" subtitle="Automação e atendimento inteligente">
      <Card className="bg-[#1a1a1a] border-white/10 p-12 text-center">
        <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-display font-bold text-lg text-white tracking-wider mb-2">BOT Z4</h2>
        <p className="font-body text-sm text-gray-500 mb-4">Sistema de automação e atendimento inteligente.</p>
        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2">
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          <span className="font-body text-xs text-yellow-400">EM DESENVOLVIMENTO</span>
        </div>
      </Card>
    </AdminLayout>
  );
}
