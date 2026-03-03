import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Bem-vindo de volta!');
      setLocation('/minha-conta');
    } else {
      toast.error(result.error || 'Erro ao fazer login.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link href="/">
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-display tracking-wider">VOLTAR</span>
          </button>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/">
              <h1 className="font-display font-bold text-4xl text-foreground tracking-tight cursor-pointer">
                ZUNO
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm mt-2 tracking-widest font-display">
              PARA QUEM VIVE NO LIMITE DA LUZ
            </p>
          </div>

          {/* Card */}
          <div className="border border-border/50 bg-card/50 backdrop-blur-sm p-8">
            <h2 className="font-display font-bold text-2xl text-foreground mb-1 tracking-tight">
              ENTRAR
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Acesse sua conta ZUNO
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-display tracking-widest text-muted-foreground">
                  E-MAIL
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-background/50 border-border/70 focus:border-primary h-12"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-display tracking-widest text-muted-foreground">
                  SENHA
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-background/50 border-border/70 focus:border-primary h-12 pr-12"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/esqueci-senha">
                  <span className="text-xs text-primary hover:underline cursor-pointer font-display tracking-wider">
                    ESQUECI MINHA SENHA
                  </span>
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-display font-bold tracking-widest text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ENTRANDO...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    ENTRAR
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/cadastro">
                  <span className="text-primary hover:underline cursor-pointer font-display font-bold tracking-wider">
                    CRIAR CONTA
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
