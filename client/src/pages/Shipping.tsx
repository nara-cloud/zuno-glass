import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Truck, RotateCcw, Clock, MapPin, Shield, AlertCircle } from 'lucide-react';

export default function Shipping() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden animate-in fade-in duration-700">
      <Navbar />

      <section className="pt-36 pb-20 container max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 mb-6">
            <Truck className="w-4 h-4 text-primary" />
            <span className="font-display text-primary text-sm tracking-widest">LOGÍSTICA</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            ENVIO E <span className="text-primary">DEVOLUÇÕES</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Transparência em cada etapa. Saiba como funciona o envio dos seus óculos ZUNO e nossa política de devoluções.
          </p>
        </div>

        {/* Envio */}
        <div className="space-y-8 mb-16">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            ENVIO
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-white">PRAZO DE ENTREGA</h3>
              </div>
              <ul className="space-y-3 text-gray-300 font-body">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span><strong className="text-white">Capitais e regiões metropolitanas:</strong> 2 a 5 dias úteis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span><strong className="text-white">Interior:</strong> 5 a 10 dias úteis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>O prazo começa a contar após a confirmação do pagamento</span>
                </li>
              </ul>
            </div>

            <div className="border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-white">RASTREAMENTO</h3>
              </div>
              <ul className="space-y-3 text-gray-300 font-body">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Código de rastreamento enviado por email assim que o pedido for despachado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Acompanhe em tempo real pelo site dos Correios ou transportadora</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span>Notificações de atualização de status por email</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-primary">FRETE GRÁTIS</h3>
            </div>
            <p className="text-gray-300 font-body">
              Frete grátis para Petrolina (PE) e Juazeiro (BA) em todas as compras. Para as demais regiões, consulte o valor do frete pelo CEP no carrinho.
            </p>
          </div>
        </div>

        {/* Devoluções */}
        <div className="space-y-8 mb-16">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-primary" />
            </div>
            DEVOLUÇÕES E TROCAS
          </h2>

          <div className="space-y-6">
            <div className="border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-white">GARANTIA DE SATISFAÇÃO — 30 DIAS</h3>
              </div>
              <p className="text-gray-300 font-body mb-4">
                Você tem 30 dias corridos após o recebimento para solicitar troca ou devolução. Sem complicações, sem perguntas.
              </p>
              <ul className="space-y-3 text-gray-300 font-body">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span><strong className="text-white">Troca de modelo:</strong> Envie o produto de volta e escolha outro modelo da coleção</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span><strong className="text-white">Reembolso integral:</strong> Devolvemos 100% do valor pago, incluindo frete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                  <span><strong className="text-white">Frete de devolução:</strong> Por conta da ZUNO GLASS</span>
                </li>
              </ul>
            </div>

            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="font-display font-bold text-white mb-4">COMO SOLICITAR</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-black font-display font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <p className="text-white font-display font-bold mb-1">Entre em contato</p>
                    <p className="text-gray-400 font-body">Envie um email para <a href="mailto:contato@zunoglass.com" className="text-primary hover:underline">contato@zunoglass.com</a> com o número do pedido e o motivo da troca/devolução.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-black font-display font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <p className="text-white font-display font-bold mb-1">Receba a etiqueta</p>
                    <p className="text-gray-400 font-body">Enviaremos uma etiqueta de postagem pré-paga para você despachar o produto nos Correios.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary text-black font-display font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <p className="text-white font-display font-bold mb-1">Troca ou reembolso</p>
                    <p className="text-gray-400 font-body">Após recebermos o produto, processamos a troca ou reembolso em até 5 dias úteis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Condições */}
        <div className="border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h3 className="font-display font-bold text-white">CONDIÇÕES</h3>
          </div>
          <ul className="space-y-3 text-gray-300 font-body">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 shrink-0"></span>
              <span>O produto deve estar em condições originais, sem danos causados por mau uso</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 shrink-0"></span>
              <span>Embalagem original e acessórios devem ser devolvidos junto com o produto</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 shrink-0"></span>
              <span>Solicitações fora do prazo de 30 dias serão analisadas caso a caso</span>
            </li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
