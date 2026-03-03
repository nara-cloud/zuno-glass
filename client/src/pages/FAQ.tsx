import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
  {
    title: "PRODUTO & PERFORMANCE",
    faqs: [
      {
        question: "O ÓCULOS ESCORREGA COM SUOR?",
        answer: "Não. Os modelos ZUNO foram desenvolvidos especificamente para atividades de alta intensidade. As hastes e a ponte nasal utilizam materiais com aderência natural que mantêm o óculos firme mesmo em treinos intensos, corridas longas e situações de muito suor. Testamos em condições reais — não em laboratório."
      },
      {
        question: "POSSO USAR PARA CORRIDA LONGA?",
        answer: "Sim. Os óculos ZUNO são projetados e testados para corridas de longa distância, ciclismo, beach tennis e treinos funcionais. O design leve e o encaixe firme garantem conforto mesmo em atividades de 1 a 3 horas. Vários modelos da linha Performance são especialmente indicados para isso."
      },
      {
        question: "QUAL A PROTEÇÃO DAS LENTES?",
        answer: "Todas as lentes ZUNO oferecem proteção UV400, bloqueando 100% dos raios UVA e UVB. Além disso, contam com tratamento anti-reflexo para maior conforto visual durante atividades ao ar livre em qualquer condição de luz."
      },
      {
        question: "OS ÓCULOS SÃO INDICADOS PARA QUAIS ESPORTES?",
        answer: "Corrida, ciclismo, beach tennis, treino funcional e atividades ao ar livre em geral. Cada modelo é validado em condições reais de uso por atletas — não apenas em testes de laboratório."
      },
      {
        question: "AS LENTES SÃO COMPATÍVEIS COM GRAU?",
        answer: "Alguns modelos são compatíveis com lentes de grau. Consulte a disponibilidade na página do produto ou entre em contato com nosso suporte via WhatsApp para orientação personalizada."
      },
    ]
  },
  {
    title: "GARANTIA & DEVOLUÇÃO",
    faqs: [
      {
        question: "TEM GARANTIA?",
        answer: "Sim. Todos os óculos ZUNO possuem garantia de 3 meses contra defeitos de fabricação. Se a armação ou lentes apresentarem falha de material dentro desse período, substituímos sem custo. Além disso, você tem 30 dias para testar e devolver se não ficar satisfeito — sem perguntas, sem burocracia."
      },
      {
        question: "POSSO TROCAR SE NÃO GOSTAR?",
        answer: "Sim. Você tem 30 dias para testar seus ZUNO. Se não ficar satisfeito por qualquer motivo, devolvemos seu dinheiro integralmente ou trocamos o modelo. O processo é simples: basta entrar em contato via WhatsApp e orientamos tudo."
      },
      {
        question: "O QUE COBRE A GARANTIA DE 3 MESES?",
        answer: "A garantia cobre defeitos de fabricação: armação que quebra sem impacto, lente que descola, dobradiça que falha, tratamento que descasca. Não cobre danos por mau uso, quedas ou arranhões por uso inadequado. Em caso de dúvida, entre em contato — analisamos caso a caso."
      },
    ]
  },
  {
    title: "ENTREGA & PAGAMENTO",
    faqs: [
      {
        question: "EM QUANTO TEMPO RECEBO?",
        answer: "Para todo o Brasil, o prazo de entrega é de 2 a 5 dias úteis após a confirmação do pagamento. Você receberá um código de rastreamento por e-mail assim que o pedido for despachado. Para regiões mais remotas, o prazo pode ser de até 8 dias úteis."
      },
      {
        question: "QUAIS SÃO AS FORMAS DE PAGAMENTO?",
        answer: "Aceitamos todas as principais formas: cartão de crédito (Visa, Mastercard, Elo, Amex) em até 3x sem juros, PIX com 5% de desconto, e boleto bancário. O pagamento é processado de forma segura via Mercado Pago."
      },
      {
        question: "A COMPRA É SEGURA?",
        answer: "Sim. Todas as transações são processadas pelo Mercado Pago, uma das plataformas de pagamento mais seguras do Brasil. Seus dados financeiros nunca passam pelos nossos servidores — são criptografados diretamente na plataforma de pagamento."
      },
    ]
  },
  {
    title: "COMUNIDADE & APP",
    faqs: [
      {
        question: "O QUE É O APP ZUNO?",
        answer: "O App Zuno está em desenvolvimento. Será uma plataforma para registro de treinos, desafios internos, ranking da comunidade e integração com dispositivos compatíveis. Entre na lista de espera na página do App e garanta acesso antecipado com condição exclusiva."
      },
      {
        question: "COMO FAÇO PARTE DO ZUNO SQUAD?",
        answer: "O ZUNO Squad é nosso programa de embaixadores. Se você é atleta ou criador de conteúdo e se identifica com a marca, entre em contato pelo nosso Instagram @zuno.glass ou acesse a página Comunidade para saber mais sobre como se candidatar."
      },
      {
        question: "COMO CUIDAR DOS MEUS ÓCULOS ZUNO?",
        answer: "Lave com água e sabão neutro. Nunca use produtos químicos agressivos ou limpe a seco. Use sempre o pano de microfibra fornecido na caixa para evitar riscos nas lentes. Guarde no estojo rígido quando não estiver usando para proteger de impactos."
      },
    ]
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden animate-in fade-in duration-700">
      <Navbar />

      <section className="pt-32 pb-20 container max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-5xl text-white mb-4">
            PERGUNTAS <span className="text-primary">FREQUENTES</span>
          </h1>
          <p className="text-gray-400 font-body text-lg">
            Dúvidas sobre o universo ZUNO? A resposta está aqui.
          </p>
        </div>

        <div className="space-y-12">
          {categories.map((cat, ci) => (
            <div key={ci}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-6 h-[2px] bg-primary"></div>
                <span className="font-display font-bold text-primary text-sm tracking-widest">{cat.title}</span>
              </div>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {cat.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`${ci}-${index}`}
                    className="border border-white/10 bg-white/5 px-6 clip-corner data-[state=open]:border-primary/50 transition-all"
                  >
                    <AccordionTrigger className="font-display font-bold text-base md:text-lg text-white hover:text-primary hover:no-underline py-5 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="font-body text-gray-300 leading-relaxed pb-6 text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA de suporte */}
        <div className="mt-16 bg-primary/5 border border-primary/20 p-8 clip-corner text-center">
          <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="font-display font-bold text-white text-xl mb-2">AINDA TEM DÚVIDAS?</h3>
          <p className="font-body text-gray-400 mb-6">
            Nosso suporte está disponível via WhatsApp. Atendimento direto, sem robô, sem espera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary text-black hover:bg-white font-display font-bold px-8 h-12 clip-corner tracking-wider">
                <MessageCircle className="w-4 h-4 mr-2" />
                FALAR NO WHATSAPP
              </Button>
            </a>
            <Link href="/products">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-display font-bold px-8 h-12 tracking-wider">
                VER A COLEÇÃO
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
