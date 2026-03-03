import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "QUAL A PROTEÇÃO DAS LENTES ZUNO?",
      answer: "Todas as lentes ZUNO oferecem proteção UV400, bloqueando 100% dos raios UVA e UVB. Além disso, contam com tratamento anti-reflexo para maior conforto visual durante atividades ao ar livre."
    },
    {
      question: "COMO FUNCIONA A GARANTIA?",
      answer: "Todos os óculos ZUNO possuem garantia contra defeitos de fabricação. Se a armação ou lentes apresentarem falha de material, nós substituímos. Consulte os termos completos no momento da compra."
    },
    {
      question: "QUAL O PRAZO DE ENTREGA?",
      answer: "Para o Brasil, o envio leva de 2 a 5 dias úteis. Você receberá um código de rastreamento assim que o pedido for despachado."
    },
    {
      question: "POSSO TROCAR SE NÃO SERVIR?",
      answer: "Sim. Você tem 30 dias para testar seus ZUNO. Se não ficar satisfeito, devolvemos seu dinheiro ou trocamos o modelo. Sem complicações."
    },
    {
      question: "AS LENTES SÃO COMPATÍVEIS COM GRAU?",
      answer: "Alguns modelos são compatíveis com lentes de grau. Consulte a disponibilidade na página do produto ou entre em contato com nosso suporte."
    },
    {
      question: "COMO CUIDAR DOS MEUS ÓCULOS ZUNO?",
      answer: "Lave com água e sabão neutro. Nunca use produtos químicos agressivos ou limpe a seco. Use sempre o pano de microfibra fornecido na caixa para evitar riscos nas lentes."
    },
    {
      question: "OS ÓCULOS SÃO INDICADOS PARA QUAIS ESPORTES?",
      answer: "Os óculos ZUNO são projetados e testados para corrida, ciclismo, beach tennis e atividades ao ar livre em geral. Cada modelo é validado em condições reais de uso por atletas."
    },
    {
      question: "O QUE É O APP ZUNO?",
      answer: "O App Zuno está em desenvolvimento. Será uma plataforma para registro de treinos, desafios internos, ranking da comunidade e integração com dispositivos compatíveis. Você pode entrar na lista de espera na página do App."
    },
    {
      question: "COMO FAÇO PARTE DO ZUNO SQUAD?",
      answer: "O ZUNO Squad é nosso programa de embaixadores. Se você é atleta ou criador de conteúdo e se identifica com a marca, entre em contato pelo nosso Instagram @zuno.glass para saber mais."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden animate-in fade-in duration-700">
      <Navbar />

      <section className="pt-32 pb-20 container max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="font-display font-bold text-5xl text-white mb-4">PERGUNTAS <span className="text-primary">FREQUENTES</span></h1>
          <p className="text-gray-400">Dúvidas sobre o universo ZUNO? A resposta está aqui.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 bg-white/5 px-6 clip-corner data-[state=open]:border-primary/50 transition-all">
              <AccordionTrigger className="font-display font-bold text-lg text-white hover:text-primary hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-body text-gray-300 leading-relaxed pb-6 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Footer />
    </div>
  );
}
