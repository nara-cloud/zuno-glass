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
      question: "COMO FUNCIONA A GARANTIA VITALÍCIA?",
      answer: "Todos os óculos ZUNO possuem garantia vitalícia contra defeitos de fabricação. Se a armação quebrar por falha de material, nós a substituímos. Danos por uso extremo ou acidentes (como atropelamento por um tanque) têm 40% de desconto na reposição."
    },
    {
      question: "QUAL O PRAZO DE ENTREGA?",
      answer: "Para o Brasil, o envio expresso leva de 2 a 5 dias úteis. Envios internacionais variam de 7 a 15 dias. Você receberá um código de rastreamento quântico assim que o pedido for despachado."
    },
    {
      question: "POSSO TROCAR SE NÃO SERVIR?",
      answer: "Sim. Você tem 30 dias para testar seus ZUNO no mundo real. Se não sentir o aumento de performance, devolvemos seu dinheiro ou trocamos o modelo. Sem perguntas, apenas velocidade."
    },
    {
      question: "AS LENTES SÃO COMPATÍVEIS COM GRAU?",
      answer: "Sim. Nossa parceria com laboratórios digitais permite a produção de lentes Z-CORE com prescrição. Basta enviar sua receita atualizada na área 'ZUNO PRO' após a compra."
    },
    {
      question: "COMO CUIDAR DAS LENTES Z-POLAR?",
      answer: "Lave apenas com água doce e sabão neutro. Nunca use produtos químicos agressivos ou limpe a seco com a camisa suja de lama. Use sempre o estojo de microfibra fornecido."
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
