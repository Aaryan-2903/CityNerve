'use client';

import { useState } from 'react';
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-medium text-white">Transmission Sent</h3>
          <p className="text-sm text-slate-400">
            If an account matching <span className="text-slate-200">{email}</span> exists, you will receive password reset instructions shortly.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-6 w-full bg-transparent border-white/10 hover:bg-white/5 text-white"
          >
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-400 mb-6 text-center">
          Enter your agency email address and we'll send you a link to reset your secure password.
        </p>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-300">
            Agency Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@citynerve.gov"
              required
              className="block w-full pl-10 pr-3 py-2.5 bg-[#0A101C] border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2.5 rounded-lg transition-all border-none shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending Request...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>

        <div className="pt-4 text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-slate-300 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
