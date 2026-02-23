import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, CheckCircle, XCircle, Wrench, Mail } from 'lucide-react';

export default function Warranty() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden animate-in fade-in duration-700">
      <Navbar />

      <section className="pt-36 pb-20 container max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display text-primary text-sm tracking-widest">PROTEÇÃO</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            GARANTIA <span className="text-primary">ZUNO</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Confiança no que entregamos. Conheça a cobertura de garantia dos seus óculos ZUNO GLASS.
          </p>
        </div>

        {/* Cobertura */}
        <div className="space-y-8 mb-16">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            COBERTURA DE GARANTIA
          </h2>

          <div className="border border-primary/30 bg-primary/5 p-6 mb-6">
            <p className="text-white font-display font-bold text-xl mb-2">6 MESES DE GARANTIA</p>
            <p className="text-gray-300 font-body">
              Todos os óculos ZUNO GLASS possuem 6 meses de garantia contra defeitos de fabricação, contados a partir da data de entrega do produto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* O que cobre */}
            <div className="border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="font-display font-bold text-white">O QUE ESTÁ COBERTO</h3>
              </div>
              <ul className="space-y-3 text-gray-300 font-body">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>Defeitos de fabricação na armação</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>Falhas no material das lentes (delaminação, bolhas)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>Defeitos nas dobradiças e encaixes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>Problemas no tratamento UV400 das lentes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>Falhas no acabamento (pintura, revestimento)</span>
                </li>
              </ul>
            </div>

            {/* O que não cobre */}
            <div className="border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="w-5 h-5 text-red-400" />
                <h3 className="font-display font-bold text-white">O QUE NÃO ESTÁ COBERTO</h3>
              </div>
              <ul className="space-y-3 text-gray-300 font-body">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Danos causados por mau uso, quedas ou impacto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Riscos nas lentes por limpeza inadequada</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Desgaste natural pelo uso prolongado</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Modificações ou reparos feitos por terceiros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Perda ou roubo do produto</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Como acionar */}
        <div className="space-y-8 mb-16">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-primary" />
            </div>
            COMO ACIONAR A GARANTIA
          </h2>

          <div className="border border-white/10 bg-white/5 p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-black font-display font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <p className="text-white font-display font-bold mb-1">Identifique o problema</p>
                  <p className="text-gray-400 font-body">Tire fotos do defeito e tenha em mãos o número do pedido e a data da compra.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-black font-display font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <p className="text-white font-display font-bold mb-1">Entre em contato</p>
                  <p className="text-gray-400 font-body">Envie um email para <a href="mailto:garantia@zunoglass.com" className="text-primary hover:underline">garantia@zunoglass.com</a> com as fotos, número do pedido e descrição do problema.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-black font-display font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <p className="text-white font-display font-bold mb-1">Análise e resposta</p>
                  <p className="text-gray-400 font-body">Nossa equipe analisará o caso em até 3 dias úteis e responderá com as instruções de envio.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-black font-display font-bold flex items-center justify-center shrink-0">4</div>
                <div>
                  <p className="text-white font-display font-bold mb-1">Substituição</p>
                  <p className="text-gray-400 font-body">Se o defeito for confirmado, enviaremos um produto novo sem custo adicional. O frete de envio e devolução é por conta da ZUNO.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-primary/30 bg-primary/5 p-8 text-center">
          <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">PRECISA DE AJUDA?</h3>
          <p className="text-gray-300 font-body mb-4">
            Entre em contato com nossa equipe de suporte para qualquer dúvida sobre garantia.
          </p>
          <a href="mailto:garantia@zunoglass.com" className="inline-block bg-primary text-black font-display font-bold px-8 py-3 hover:bg-white transition-colors">
            FALAR COM SUPORTE
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
