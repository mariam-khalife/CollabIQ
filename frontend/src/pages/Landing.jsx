import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Sparkles,
  ShieldCheck,
  Layers,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Globe,
  Share2,
  Mail,
  ChevronLeft,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Brain className="w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-indigo-950 dark:text-white">
            CollabIQ
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
          <a href="#home" className="hover:text-indigo-600 transition-colors">Home</a>
          <a href="#platform" className="hover:text-indigo-600 transition-colors">Platform</a>
          <a href="#teams" className="hover:text-indigo-600 transition-colors">Teams</a>
          <a href="#research" className="hover:text-indigo-600 transition-colors">Research</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-full transition-all shadow-md shadow-indigo-600/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 text-center bg-gradient-to-b from-indigo-50/40 via-transparent to-white dark:from-indigo-950/20 dark:to-slate-950">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] tracking-wider uppercase rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED ACADEMIC COLLABORATION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-indigo-950 dark:text-white tracking-tight leading-[1.1]">
            Build Smarter <span className="text-indigo-600 dark:text-indigo-400">Teams</span> with Academic AI
          </h1>

          <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CollabIQ leverages advanced neural matching to connect students, researchers, and educators based on cognitive styles, skill sets, and project goals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <span>Start Building Your Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-2xl transition-all shadow-2xs">
              Watch Demo
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 border-t border-slate-100 dark:border-slate-900 mt-16 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white">50k+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Active Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white">120+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Universities</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white">12k+</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Projects Launched</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white">98%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Science of Seamless Collaboration Banner */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-900 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-xl">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              The Science of Seamless Collaboration
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Traditional team formation is often left to chance. CollabIQ transforms this process using evidence-based matchmaking. By analyzing peer reviews, technical proficiency, and project complexity, our AI ensures every member is positioned for peak performance and intellectual growth.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold">Precision Matching:</h4>
                  <p className="text-[11px] text-slate-400">Beyond keywords—matching based on cognitive diversity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold">Real-time Insights:</h4>
                  <p className="text-[11px] text-slate-400">Monitor team health and project velocity with AI-driven analytics.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 flex items-center justify-center min-h-[260px] shadow-inner">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-indigo-600/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30">
                <Brain className="w-6 h-6" />
              </div>
              <p className="text-xs font-extrabold text-slate-300">Neural Network Engine Active</p>
              <p className="text-[11px] text-slate-500 max-w-xs">Analyzing vector embeddings across 450+ multi-disciplinary criteria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineered for Academic Success (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white tracking-tight">
            Engineered for Academic Success
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Intelligent tools designed to handle the complexity of modern educational projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Card 1: Neural Team Matching */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Neural Team Matching</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Our proprietary algorithm evaluates hundreds of data points from previous work, soft skills, and academic interests to suggest the most compatible partners for your specific project needs.
              </p>
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all">
              <span>Learn more</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: AI Project Suggestions */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">AI Project Suggestions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Discover projects that align with your current curriculum and career aspirations, AI-analyzed trending research fields.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Quantum Computing NLP
              </div>
              <div className="p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                ETH Zurich Frameworks
              </div>
            </div>
          </div>

          {/* Card 3: Lifecycle Management */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Lifecycle Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                From proposal to publication, manage every stage of your academic journey with integrated tools for milestones and peer reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Wide Card: Verified Academic Reputation */}
        <div className="bg-indigo-600 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl">
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">Verified Academic Reputation</h3>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium leading-relaxed">
              Build a professional portfolio that tracks your contributions across multiple projects. Earn badges for leadership, technical prowess, and collaborative spirit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-extrabold">Leadership Gold</span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-extrabold">Top Research Mentor</span>
          </div>
        </div>
      </section>

      {/* From Concept to Collaboration (Steps) */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white tracking-tight">
              From Concept to Collaboration
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              A streamlined 4-step process to get your academic project off the ground and running with the right people.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-indigo-600 dark:text-indigo-400 font-black text-2xl">01</span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Create Profile</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Input your academic interests, past projects, and specific skills to build your developer portfolio.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-indigo-600 dark:text-indigo-400 font-black text-2xl">02</span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Define Project</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Post your research project or search through thousands of existing opportunities using AI-powered filters.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-indigo-600 dark:text-indigo-400 font-black text-2xl">03</span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Review Matches</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Our AI produces a short list of optimal collaborators. Review their reputation scores and past project outcomes.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <span className="text-indigo-600 dark:text-indigo-400 font-black text-2xl">04</span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Launch Team</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Form your newly assembled team and finish tasks, milestones, and version-control connections securely.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-12 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to optimize your academic research?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
              Join thousands of students and faculty members who are redefining how academic teams are built and managed.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-lg shadow-indigo-600/30 inline-block"
            >
              JOIN COLLABIQ TODAY
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Free for students and university verified researchers.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-900 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200/60 dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-indigo-950 dark:text-white">
                CollabIQ
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
              Introducing the next generation of researchers with artificial intelligence designed for team excellence.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <Globe className="w-4 h-4 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Share2 className="w-4 h-4 hover:text-indigo-600 cursor-pointer transition-colors" />
              <Mail className="w-4 h-4 hover:text-indigo-600 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">AI Matching</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Project Discovery</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Team Analytics</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Research Papers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Community Hub</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-400">
          <p>© 2026 CollabIQ Academic Excellence. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Status: Optimal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}