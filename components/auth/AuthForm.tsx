'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, Sparkles, Lock, Mail } from 'lucide-react';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signUpMutation = trpc.auth.signUp.useMutation();
  const signInMutation = trpc.auth.signIn.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await signUpMutation.mutateAsync({ email, password });
        if (result.session) {
          await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });
          toast({
            title: 'Account created!',
            description: 'Welcome to AI Chat.',
          });
        }
      } else {
        const result = await signInMutation.mutateAsync({ email, password });
        if (result.session) {
          await supabase.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });
          toast({
            title: 'Welcome back!',
            description: 'Signed in successfully.',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-100 dark:bg-gray-900 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-100 dark:bg-gray-900 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="max-w-lg space-y-8 z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-full px-6 py-3 shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white dark:text-black" />
              </div>
              <span className="text-2xl font-bold text-black dark:text-white">AI Chat</span>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-black dark:text-white leading-tight">
              Connect with<br />
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Multiple AI Models
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Experience the power of AI conversation in one unified platform. Smart, fast, and intuitive.
            </p>
          </div>

          <div className="grid gap-4 pt-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white dark:text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-1">Smart Conversations</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Access multiple AI models in one interface</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-white dark:text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-black dark:text-white mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your conversations are encrypted and protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white dark:text-black" />
              </div>
              <span className="text-2xl font-bold text-black dark:text-white">AI Chat</span>
            </div>
          </div>

          <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-gray-100 dark:via-gray-300 dark:to-gray-100"></div>
            
            <CardHeader className="space-y-3 text-center pt-8 pb-6">
              <CardTitle className="text-3xl font-bold text-black dark:text-white">
                {isSignUp ? 'Get Started' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                {isSignUp
                  ? 'Create your account to start chatting'
                  : 'Sign in to continue your conversations'}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-600" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-black dark:text-white">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-600" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-12 h-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 rounded-xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                  </div>
                </div>

                {!isSignUp && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    >
                      Forgot password?
                    </Button>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-black text-gray-500 dark:text-gray-500">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl font-semibold"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Sign In Instead' : 'Create New Account'}
              </Button>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8">
            &copy; {new Date().getFullYear()} Abuzar. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}