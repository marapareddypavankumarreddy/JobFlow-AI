import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Briefcase, Zap, Shield, Target, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Auth Error:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('Please allow popups for this site to sign in with Google.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        console.log('Popup request was cancelled.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-100">
              <Zap className="w-4 h-4" />
              <span>AI-Powered Job Hunting is Here</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 leading-tight">
              Apply to your dream job <span className="text-emerald-600">on autopilot.</span>
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed">
              JobFlow AI searches, tailors your resume, and applies to jobs across LinkedIn, Indeed, and more—while you sleep.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button 
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoggingIn ? 'Signing in...' : 'Get Started Free'}
                {!isLoggingIn && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-2xl font-bold text-lg hover:bg-zinc-50 transition-all">
                View Demo
              </button>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[128px]" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Smart Matching</h3>
              <p className="text-zinc-500 leading-relaxed">
                Our AI analyzes thousands of job listings daily to find the ones that perfectly match your skills and salary expectations.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Resume Tailoring</h3>
              <p className="text-zinc-500 leading-relaxed">
                For every single application, JobFlow AI rewrites your resume to highlight the exact keywords and experiences recruiters are looking for.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Safe Automation</h3>
              <p className="text-zinc-500 leading-relaxed">
                We use human-like browsing patterns to ensure your accounts stay safe while maximizing your application volume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-zinc-900">JobFlow AI</span>
          </div>
          <p className="text-zinc-400 text-sm">© 2026 JobFlow AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
