import { useState, useEffect } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export default function LeadCapturePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('zuno_popup_seen');
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('zuno_popup_seen', 'true');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setIsSubmitted(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-black/90 border border-primary/30 backdrop-blur-xl p-0 max-w-4xl overflow-hidden sm:rounded-none clip-corner">
        <DialogTitle className="sr-only">Inscreva-se para acesso antecipado</DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side */}
          <div className="relative h-64 md:h-auto hidden md:block">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210798515/FwMvhCAZVbqZVlKG.png" 
              alt="ZUNO Teaser" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
            <div className="absolute bottom-8 left-8 z-10">
              <div className="font-display font-bold text-4xl text-white mb-2">
                ACESSO <span className="text-primary">VIP</span>
              </div>
              <p className="font-body text-gray-300 text-sm max-w-[200px]">
                Receba novidades e acesso antecipado ao lançamento.
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-8 md:p-12 flex flex-col justify-center relative">
            <div className="mb-8 md:hidden">
              <h2 className="font-display font-bold text-3xl text-white mb-2">
                ACESSO <span className="text-primary">VIP</span>
              </h2>
            </div>

            {!isSubmitted ? (
              <>
                <h3 className="font-display font-bold text-xl text-white mb-4">
                  SEJA O PRIMEIRO A SABER
                </h3>
                <p className="font-body text-gray-400 mb-8 leading-relaxed">
                  Cadastre-se para receber novidades sobre o lançamento e acesso antecipado à coleção.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input 
                    type="email" 
                    placeholder="SEU MELHOR EMAIL" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 font-display h-12 focus:border-primary focus:ring-0 rounded-none"
                  />
                  <Button 
                    type="submit"
                    className="bg-primary text-black hover:bg-white font-bold h-12 rounded-none w-full group"
                  >
                    GARANTIR ACESSO <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                <p className="text-xs text-gray-600 mt-4 text-center">
                  Ao se inscrever, você concorda com nossa Política de Privacidade.
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">
                  VOCÊ ESTÁ DENTRO
                </h3>
                <p className="font-body text-gray-400">
                  Fique atento ao seu email. Vamos te avisar sobre o lançamento.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
