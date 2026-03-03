import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

const partnerTypes = [
  'Patrocínio de atleta',
  'Collab / Co-branding',
  'Distribuição / Revenda',
  'Influencer / Creator',
  'Evento esportivo',
  'Outro',
];

export default function PartnerForm() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    instagram: '',
    email: '',
    type: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.type) {
      setError('Preencha os campos obrigatórios: Nome, E-mail e Tipo de parceria.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/forms/partner', {
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
        <h3 className="font-display font-bold text-2xl text-white">MENSAGEM ENVIADA!</h3>
        <p className="text-gray-400 max-w-sm">
          Recebemos o seu contato. Nossa equipe vai analisar e retornar em até 48 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
            NOME <span className="text-primary">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body"
          />
        </div>
        <div>
          <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
            EMPRESA / MARCA
          </label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Nome da empresa ou marca"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        <div>
          <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
            INSTAGRAM
          </label>
          <input
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="@seuinstagram"
            className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body"
          />
        </div>
      </div>

      <div>
        <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
          TIPO DE PARCERIA <span className="text-primary">*</span>
        </label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body appearance-none"
        >
          <option value="" disabled className="bg-black">Selecione o tipo de parceria</option>
          {partnerTypes.map(t => (
            <option key={t} value={t} className="bg-black">{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-display font-bold text-xs tracking-widest text-gray-400 mb-2">
          MENSAGEM
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          placeholder="Conte um pouco sobre a sua proposta..."
          className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-4 py-3 focus:outline-none focus:border-primary transition-colors font-body resize-none"
        />
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
          'ENVIAR PROPOSTA'
        )}
      </Button>
    </form>
  );
}
