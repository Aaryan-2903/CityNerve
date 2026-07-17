'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { AuthCard } from './AuthCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-slate-300">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <input
                id="firstName"
                type="text"
                placeholder="Jane"
                required
                className="block w-full pl-10 pr-3 py-2.5 bg-[#0A101C] border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-slate-300">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              required
              className="block w-full px-3 py-2.5 bg-[#0A101C] border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

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
              placeholder="operator@citynerve.gov"
              required
              className="block w-full pl-10 pr-3 py-2.5 bg-[#0A101C] border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="department" className="text-sm font-medium text-slate-300">
            Department / Division
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheck className="h-5 w-5 text-slate-500" />
            </div>
            <select
              id="department"
              required
              defaultValue=""
              className="block w-full pl-10 pr-3 py-2.5 bg-[#0A101C] border border-white/10 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
            >
              <option value="" disabled className="text-slate-500">Select department</option>
              <option value="police">Police Department</option>
              <option value="fire">Fire & Rescue</option>
              <option value="medical">Emergency Medical Services</option>
              <option value="transportation">Department of Transportation</option>
              <option value="command">Central Command (EOC)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-300">
            Secure Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              minLength={8}
              className="block w-full pl-10 pr-10 py-2.5 bg-[#0A101C] border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Must be at least 8 characters</p>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2.5 rounded-lg transition-all border-none shadow-[0_0_20px_rgba(37,99,235,0.3)] mt-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Request...
            </>
          ) : (
            'Request Clearance'
          )}
        </Button>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have clearance?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Access Terminal
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
