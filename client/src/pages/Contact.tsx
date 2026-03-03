import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, Instagram, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simular envio — no futuro integrar com backend
    setTimeout(() => {
      setSent(true);
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden animate-in fade-in duration-700">
      <Navbar />

      <section className="pt-36 pb-20 container max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 mb-6">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="font-display text-primary text-sm tracking-widest">FALE CONOSCO</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            CONTATO <span className="text-primary">ZUNO</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Dúvidas, sugestões ou parcerias? Estamos aqui para ajudar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Informações de contato */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display font-bold text-xl text-white mb-6">CANAIS DE ATENDIMENTO</h2>

            <div className="border border-white/10 bg-white/5 p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm mb-1">EMAIL</h3>
                <a href="mailto:contato@zunoglass.com" className="text-gray-300 font-body hover:text-primary transition-colors">
                  contato@zunoglass.com
                </a>
              </div>
            </div>

            <div className="border border-white/10 bg-white/5 p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm mb-1">WHATSAPP</h3>
                <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-body hover:text-primary transition-colors">
                  (00) 00000-0000
                </a>
                <p className="text-gray-500 font-body text-xs mt-1">Em breve</p>
              </div>
            </div>

            <div className="border border-white/10 bg-white/5 p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Instagram className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm mb-1">INSTAGRAM</h3>
                <a href="https://www.instagram.com/zuno.glass/" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-body hover:text-primary transition-colors">
                  @zuno.glass
                </a>
                <p className="text-gray-500 font-body text-xs mt-1">DM aberta para dúvidas rápidas</p>
              </div>
            </div>

            <div className="border border-white/10 bg-white/5 p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm mb-1">HORÁRIO DE ATENDIMENTO</h3>
                <p className="text-gray-300 font-body text-sm">Segunda a Sexta: 9h às 18h</p>
                <p className="text-gray-500 font-body text-xs mt-1">Respondemos em até 24h úteis</p>
              </div>
            </div>

            <div className="border border-white/10 bg-white/5 p-5 flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm mb-1">LOCALIZAÇÃO</h3>
                <p className="text-gray-300 font-body text-sm">Brasil</p>
                <p className="text-gray-500 font-body text-xs mt-1">Operação 100% digital</p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-3">
            <div className="border border-white/10 bg-white/5 p-8">
              {sent ? (
                /* ─── Tela de Confirmação ─── */
                <div className="flex flex-col items-center justify-center py-12 text-center gap-6 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl text-white tracking-wider mb-2">
                      MENSAGEM ENVIADA!
                    </h3>
                    <p className="text-gray-400 font-body max-w-sm">
                      Recebemos o seu contato. Nossa equipe responderá em até <span className="text-white font-bold">24 horas úteis</span>.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSent(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white hover:text-black font-display font-bold tracking-wider"
                  >
                    ENVIAR OUTRA MENSAGEM
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="font-display font-bold text-xl text-white mb-2">ENVIE SUA MENSAGEM</h2>
                  <p className="text-gray-400 font-body mb-8">Preencha o formulário e retornaremos o mais breve possível.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="font-display text-white text-sm mb-2 block">NOME</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Seu nome"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-body rounded-none h-12 focus:border-primary focus:ring-0"
                        />
                      </div>
                      <div>
                        <label className="font-display text-white text-sm mb-2 block">EMAIL</label>
                        <Input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-body rounded-none h-12 focus:border-primary focus:ring-0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-display text-white text-sm mb-2 block">ASSUNTO</label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Sobre o que gostaria de falar?"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-body rounded-none h-12 focus:border-primary focus:ring-0"
                      />
                    </div>

                    <div>
                      <label className="font-display text-white text-sm mb-2 block">MENSAGEM</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Escreva sua mensagem aqui..."
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-gray-600 font-body rounded-none p-3 focus:border-primary focus:ring-0 focus:outline-none resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-primary text-black hover:bg-white font-display font-bold h-14 rounded-none text-lg tracking-wider"
                    >
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          ENVIANDO...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          ENVIAR MENSAGEM
                        </span>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>

            {/* Assuntos específicos */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-white/10 bg-white/5 p-4">
                <h4 className="font-display font-bold text-white text-sm mb-1">PARCERIAS</h4>
                <p className="text-gray-400 font-body text-xs mb-2">Marcas e profissionais</p>
                <a href="mailto:parcerias@zunoglass.com" className="text-primary font-body text-sm hover:underline">parcerias@zunoglass.com</a>
              </div>
              <div className="border border-white/10 bg-white/5 p-4">
                <h4 className="font-display font-bold text-white text-sm mb-1">IMPRENSA</h4>
                <p className="text-gray-400 font-body text-xs mb-2">Assessoria e mídia</p>
                <a href="mailto:imprensa@zunoglass.com" className="text-primary font-body text-sm hover:underline">imprensa@zunoglass.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
