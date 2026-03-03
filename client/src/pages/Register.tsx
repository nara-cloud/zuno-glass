import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, UserPlus, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = password.length >= 8 ? 'forte' : password.length >= 6 ? 'média' : 'fraca';
  const passwordMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Conta criada com sucesso! Bem-vindo à ZUNO!');
      setLocation('/minha-conta');
    } else {
      toast.error(result.error || 'Erro ao criar conta.');
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

      <div className="flex-1 flex items-center justify-center px-4 py-8">
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
              CRIAR CONTA
            </h2>
            <p className="text-muted-foreground text-sm mb-8">
              Junte-se ao Squad ZUNO
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-display tracking-widest text-muted-foreground">
                  NOME COMPLETO
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="bg-background/50 border-border/70 focus:border-primary h-12"
                  autoComplete="name"
                  required
                />
              </div>

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
                    placeholder="Mínimo 6 caracteres"
                    className="bg-background/50 border-border/70 focus:border-primary h-12 pr-12"
                    autoComplete="new-password"
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
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1 flex-1">
                      <div className={`h-1 flex-1 rounded-full ${password.length >= 2 ? 'bg-red-500' : 'bg-border'}`} />
                      <div className={`h-1 flex-1 rounded-full ${password.length >= 6 ? 'bg-yellow-500' : 'bg-border'}`} />
                      <div className={`h-1 flex-1 rounded-full ${password.length >= 8 ? 'bg-primary' : 'bg-border'}`} />
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">{passwordStrength}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-display tracking-widest text-muted-foreground">
                  CONFIRMAR SENHA
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className={`bg-background/50 border-border/70 focus:border-primary h-12 pr-12 ${
                      confirmPassword.length > 0
                        ? passwordMatch
                          ? 'border-green-500'
                          : 'border-red-500'
                        : ''
                    }`}
                    autoComplete="new-password"
                    required
                  />
                  {confirmPassword.length > 0 && passwordMatch && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-display font-bold tracking-widest text-sm mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    CRIANDO CONTA...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    CRIAR CONTA
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/entrar">
                  <span className="text-primary hover:underline cursor-pointer font-display font-bold tracking-wider">
                    ENTRAR
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
