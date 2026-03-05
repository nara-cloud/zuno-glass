import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-24 pb-20 container">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="font-display font-bold text-primary text-sm tracking-widest">SOBRE NÓS</span>
          </div>
          
          <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-8 leading-tight">
            PARA QUEM VIVE <br/>
            <span className="text-primary">NO LIMITE DA LUZ</span>
          </h1>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-20 border-t border-white/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-8">
                NOSSA <span className="text-primary">HISTÓRIA</span>
              </h2>
              <div className="space-y-6 font-body text-gray-400 text-lg leading-relaxed">
                <p>
                  A ZUNO nasceu da necessidade real de atletas que não encontravam óculos esportivos 
                  com a combinação certa de performance óptica, leveza e design. Óculos que aguentassem 
                  o ritmo sem comprometer o estilo.
                </p>
                <p>
                  Começamos ouvindo corredores, ciclistas e praticantes de beach tennis. Entendemos 
                  suas frustrações: óculos que escorregam, lentes que embaçam, armações que pesam. 
                  A partir daí, projetamos cada modelo para resolver problemas reais.
                </p>
                <p>
                  Hoje, a ZUNO é uma marca que combina performance óptica com design esportivo premium. 
                  Cada óculos é testado em condições reais de uso antes de chegar ao mercado.
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-8">
                NOSSOS <span className="text-primary">VALORES</span>
              </h2>
              <div className="space-y-8">
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-display font-bold text-xl text-white mb-2">HONESTIDADE</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Não prometemos o que não entregamos. Nossos óculos são projetados para performance 
                    óptica e esportiva. Sem exageros técnicos, sem marketing enganoso.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-display font-bold text-xl text-white mb-2">PERFORMANCE REAL</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Cada modelo é testado por atletas reais em condições reais. Corrida, ciclismo, 
                    beach tennis. Se não funciona no campo, não vai para a prateleira.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-display font-bold text-xl text-white mb-2">COMUNIDADE</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Acreditamos que o esporte é coletivo. A comunidade ZUNO é o coração da marca — 
                    atletas que compartilham a mesma obsessão por performance e estilo.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-6">
                  <h3 className="font-display font-bold text-xl text-white mb-2">EVOLUÇÃO CONSTANTE</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Estamos construindo um ecossistema. Os óculos são o começo. O app, a comunidade 
                    e os desafios são os próximos passos. Evoluímos junto com nossos atletas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecossistema */}
      <section className="py-20 bg-white/5 border-y border-white/10">
        <div className="container text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-8 text-white">
            ECOSSISTEMA <span className="text-primary">EM CONSTRUÇÃO</span>
          </h2>
          <p className="font-body text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-12">
            A ZUNO é mais do que óculos. Estamos construindo um ecossistema completo para atletas 
            que vivem o esporte com intensidade.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-black border border-primary/50 p-6 clip-corner">
              <div className="text-primary font-display font-bold text-lg mb-2">ÓCULOS</div>
              <p className="text-gray-500 text-sm">Performance óptica e design esportivo</p>
              <div className="mt-4 text-primary text-xs font-mono">DISPONÍVEL</div>
            </div>
            <div className="bg-black border border-white/10 p-6 clip-corner">
              <div className="text-white font-display font-bold text-lg mb-2">COMUNIDADE</div>
              <p className="text-gray-500 text-sm">Desafios, eventos e conexão entre atletas</p>
              <div className="mt-4 text-gray-500 text-xs font-mono">EM CONSTRUÇÃO</div>
            </div>
            <div className="bg-black border border-white/10 p-6 clip-corner">
              <div className="text-white font-display font-bold text-lg mb-2">APP</div>
              <p className="text-gray-500 text-sm">Treinos, ranking e gamificação</p>
              <div className="mt-4 text-gray-500 text-xs font-mono">EM DESENVOLVIMENTO</div>
            </div>
            <div className="bg-black border border-white/10 p-6 clip-corner">
              <div className="text-white font-display font-bold text-lg mb-2">SQUAD</div>
              <p className="text-gray-500 text-sm">Embaixadores e atletas patrocinados</p>
              <div className="mt-4 text-primary text-xs font-mono">ATIVO</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 container text-center">
        <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">
          FAÇA PARTE DA <span className="text-primary">ZUNO</span>
        </h2>
        <p className="font-body text-gray-400 max-w-xl mx-auto mb-10 text-lg">
          Descubra a coleção, junte-se à comunidade e evolua com a gente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button className="bg-primary text-black hover:bg-white font-display font-bold px-10 h-14 tracking-wider text-lg clip-corner">
              VER COLEÇÃO <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/community">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-display font-bold px-10 h-14 tracking-wider text-lg">
              COMUNIDADE
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
