import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

const sports = [
  'Corrida',
  'Ciclismo',
  'Beach Tennis',
  'Natação',
  'Futebol',
  'Musculação',
  'Crossfit',
  'Outro',
];

export default function WaitlistForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: '',
    sport: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Preencha os campos obrigatórios: Nome e E-mail.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/forms/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erro ao enviar');
      setSuccess(true);
    } catch {
      setError('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <CheckCircle2 className="w-16 h-16 text-primary" />
        <h3 className="font-display font-bold text-2xl text-white">VOCÊ ESTÁ NA LISTA!</h3>
        <p className="text-gray-400 max-w-sm">
          Você será um dos primeiros a saber quando o App Zuno estiver disponível para testes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
            NOME <span className="text-primary">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Seu nome"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body"
          />
        </div>
        <div>
          <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
            E-MAIL <span className="text-primary">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
            CIDADE
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Sua cidade"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body"
          />
        </div>
        <div>
          <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
            MODALIDADE ESPORTIVA
          </label>
          <select
            name="sport"
            value={form.sport}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body appearance-none"
          >
            <option value="" disabled className="bg-black">Selecione uma modalidade</option>
            {sports.map(s => (
              <option key={s} value={s} className="bg-black">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm font-body">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-black hover:bg-white font-display font-bold h-14 tracking-wider text-lg clip-corner"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin mr-2" /> ENVIANDO...</>
        ) : (
          'ENTRAR NA LISTA DE ESPERA'
        )}
      </Button>
    </form>
  );
}
