import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Ruler, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function SizeGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden animate-in fade-in duration-700">
      <Navbar />

      <section className="pt-36 pb-20 container max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 mb-6">
            <Ruler className="w-4 h-4 text-primary" />
            <span className="font-display text-primary text-sm tracking-widest">MEDIDAS</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            GUIA DE <span className="text-primary">TAMANHOS</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Encontre o encaixe ideal. Cada modelo ZUNO é projetado para conforto e estabilidade durante o uso.
          </p>
        </div>

        {/* Como medir */}
        <div className="space-y-8 mb-16">
          <h2 className="font-display font-bold text-2xl text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            COMO MEDIR
          </h2>

          <div className="border border-white/10 bg-white/5 p-6">
            <p className="text-gray-300 font-body mb-6">
              Para encontrar o tamanho ideal, você pode verificar as medidas de um óculos que já usa e comparar com a tabela abaixo. As medidas estão geralmente gravadas na haste interna dos óculos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-white/10 bg-white/5">
                <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                  <span className="font-display font-bold text-primary text-2xl">L</span>
                </div>
                <h4 className="font-display font-bold text-white mb-1">LARGURA DA LENTE</h4>
                <p className="text-gray-400 font-body text-sm">Medida horizontal da lente, de borda a borda</p>
              </div>
              <div className="text-center p-4 border border-white/10 bg-white/5">
                <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                  <span className="font-display font-bold text-primary text-2xl">P</span>
                </div>
                <h4 className="font-display font-bold text-white mb-1">PONTE</h4>
                <p className="text-gray-400 font-body text-sm">Distância entre as duas lentes, sobre o nariz</p>
              </div>
              <div className="text-center p-4 border border-white/10 bg-white/5">
                <div className="w-16 h-16 bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                  <span className="font-display font-bold text-primary text-2xl">H</span>
                </div>
                <h4 className="font-display font-bold text-white mb-1">HASTE</h4>
                <p className="text-gray-400 font-body text-sm">Comprimento da haste, da dobradiça à ponta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de tamanhos */}
        <div className="space-y-8 mb-16">
          <h2 className="font-display font-bold text-2xl text-white">TABELA DE MEDIDAS</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary/10 border border-primary/30">
                  <th className="font-display font-bold text-primary text-left p-4">LINHA</th>
                  <th className="font-display font-bold text-primary text-center p-4">LENTE (mm)</th>
                  <th className="font-display font-bold text-primary text-center p-4">PONTE (mm)</th>
                  <th className="font-display font-bold text-primary text-center p-4">HASTE (mm)</th>
                  <th className="font-display font-bold text-primary text-center p-4">INDICAÇÃO</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border border-white/10 bg-white/5">
                  <td className="font-display font-bold text-white p-4">SPORT</td>
                  <td className="text-gray-300 font-body text-center p-4">60-65</td>
                  <td className="text-gray-300 font-body text-center p-4">14-16</td>
                  <td className="text-gray-300 font-body text-center p-4">130-140</td>
                  <td className="text-gray-300 font-body text-center p-4">Rostos médios a grandes</td>
                </tr>
                <tr className="border border-white/10">
                  <td className="font-display font-bold text-white p-4">URBAN</td>
                  <td className="text-gray-300 font-body text-center p-4">52-58</td>
                  <td className="text-gray-300 font-body text-center p-4">16-18</td>
                  <td className="text-gray-300 font-body text-center p-4">135-145</td>
                  <td className="text-gray-300 font-body text-center p-4">Rostos médios</td>
                </tr>
                <tr className="border border-white/10 bg-white/5">
                  <td className="font-display font-bold text-white p-4">PREMIUM</td>
                  <td className="text-gray-300 font-body text-center p-4">54-60</td>
                  <td className="text-gray-300 font-body text-center p-4">15-18</td>
                  <td className="text-gray-300 font-body text-center p-4">135-145</td>
                  <td className="text-gray-300 font-body text-center p-4">Rostos médios a grandes</td>
                </tr>
                <tr className="border border-white/10">
                  <td className="font-display font-bold text-white p-4">LIFESTYLE</td>
                  <td className="text-gray-300 font-body text-center p-4">50-56</td>
                  <td className="text-gray-300 font-body text-center p-4">18-20</td>
                  <td className="text-gray-300 font-body text-center p-4">140-145</td>
                  <td className="text-gray-300 font-body text-center p-4">Todos os rostos</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-500 font-body text-sm">
            * As medidas podem variar ligeiramente entre modelos da mesma linha. Consulte a página do produto para medidas específicas.
          </p>
        </div>

        {/* Dicas */}
        <div className="space-y-8 mb-16">
          <h2 className="font-display font-bold text-2xl text-white">DICAS DE AJUSTE</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="font-display font-bold text-white mb-3">COMO SABER SE ESTÁ BEM AJUSTADO</h3>
              <ul className="space-y-3 text-gray-300 font-body">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>As lentes devem cobrir completamente os olhos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>A ponte deve apoiar confortavelmente no nariz, sem apertar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>As hastes devem seguir a curvatura da orelha sem pressionar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0"></span>
                  <span>O óculos não deve escorregar ao inclinar a cabeça</span>
                </li>
              </ul>
            </div>

            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="font-display font-bold text-white mb-3">SINAIS DE AJUSTE INCORRETO</h3>
              <ul className="space-y-3 text-gray-300 font-body">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Marcas vermelhas no nariz ou atrás das orelhas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Óculos escorregando constantemente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Visão periférica bloqueada pela armação</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 shrink-0"></span>
                  <span>Dor de cabeça após uso prolongado</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Try-On CTA */}
        <div className="border border-primary/30 bg-primary/5 p-8 text-center">
          <Eye className="w-8 h-8 text-primary mx-auto mb-4" />
          <h3 className="font-display font-bold text-xl text-white mb-2">AINDA COM DÚVIDA?</h3>
          <p className="text-gray-300 font-body mb-4">
            Experimente nossos modelos virtualmente e veja como ficam no seu rosto antes de comprar.
          </p>
          <Link href="/try-on" className="inline-flex items-center gap-2 bg-primary text-black font-display font-bold px-8 py-3 hover:bg-white transition-colors">
            TRY-ON VIRTUAL <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
