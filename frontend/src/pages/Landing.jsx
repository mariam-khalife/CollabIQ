import React, { useState, useEffect } from "react";
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
  ChevronDown,
  Rocket,
  Users,
  Target,
  Zap,
  Award,
  BarChart3,
  BookOpen,
  Play,
  Star,
  TrendingUp,
  Clock,
  User,
} from "lucide-react";

export default function Landing() {
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Professor of Computer Science, Stanford",
      quote: "CollabIQ transformed how my research group collaborates. The AI matching is uncannily accurate.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Michael Rodriguez",
      role: "PhD Candidate, MIT",
      quote: "Found my entire thesis advisory team through CollabIQ. Couldn't have done it without this platform.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=33",
    },
    {
      name: "Dr. Emily Watson",
      role: "Lead Researcher, Oxford",
      quote: "The reputation system ensures you're working with the best. It's revolutionized academic networking.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200 overflow-x-hidden">
      
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-all">
              <Brain className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              CollabIQ
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-300">
            {["Home", "Platform", "Teams", "Research"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-extrabold rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 text-center bg-gradient-to-b from-indigo-50/40 via-transparent to-white dark:from-indigo-950/20 dark:to-slate-950">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-100/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] sm:text-xs tracking-wider uppercase rounded-full shadow-sm animate-pulse-soft">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-POWERED ACADEMIC COLLABORATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Build Smarter{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-300">
              Teams
            </span>{" "}
            with Academic AI
          </h1>

          <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CollabIQ leverages advanced neural matching to connect students, researchers, and educators based on cognitive styles, skill sets, and project goals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/30 flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Start Building Your Team</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button 
              onClick={() => scrollToSection("platform")}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-slate-200/60 dark:border-slate-800 mt-12 max-w-3xl mx-auto">
            {[
              { value: "50k+", label: "Active Students", icon: Users },
              { value: "120+", label: "Universities", icon: BookOpen },
              { value: "12k+", label: "Projects Launched", icon: Rocket },
              { value: "98%", label: "Success Rate", icon: Award },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  <stat.icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  {stat.value}
                </div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={() => scrollToSection("platform")}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors animate-bounce"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* Science of Seamless Collaboration Banner */}
      <section id="platform" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 animate-on-scroll">
        <div className="bg-slate-900 dark:bg-slate-900/80 rounded-3xl p-6 sm:p-12 text-white grid grid-cols-1 lg:grid-cols-2 gap-10 items-center shadow-2xl border border-slate-800">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold tracking-wider uppercase rounded-full border border-indigo-500/30">
              <Zap className="w-3.5 h-3.5" />
              <span>AI-POWERED MATCHING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              The Science of Seamless Collaboration
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Traditional team formation is often left to chance. CollabIQ transforms this process using evidence-based matchmaking. By analyzing peer reviews, technical proficiency, and project complexity, our AI ensures every member is positioned for peak performance and intellectual growth.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: "Precision Matching", desc: "Beyond keywords—matching based on cognitive diversity." },
                { title: "Real-time Insights", desc: "Monitor team health and project velocity with AI-driven analytics." },
                { title: "Reputation Tracking", desc: "Build credibility through verified contributions." },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 flex items-center justify-center min-h-[260px] shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
            <div className="text-center space-y-4 relative z-10">
              <div className="w-14 h-14 bg-indigo-600/30 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                <Brain className="w-7 h-7" />
              </div>
              <p className="text-sm font-extrabold text-slate-300">Neural Network Engine Active</p>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500">Analyzing 450+ criteria</span>
              </div>
              <div className="flex items-center gap-3 justify-center text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Real-time</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 94% accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineered for Academic Success (Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-8 animate-on-scroll">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold tracking-wider uppercase rounded-full border border-indigo-100 dark:border-indigo-800/50">
            <Target className="w-3 h-3 inline mr-1" />
            Core Features
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineered for Academic Success
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Intelligent tools designed to handle the complexity of modern educational projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[
            {
              icon: Brain,
              title: "Neural Team Matching",
              desc: "Our proprietary algorithm evaluates hundreds of data points from previous work, soft skills, and academic interests to suggest the most compatible partners.",
              color: "indigo",
              link: "/ai-matching",
            },
            {
              icon: Sparkles,
              title: "AI Project Suggestions",
              desc: "Discover projects that align with your current curriculum and career aspirations, AI-analyzed trending research fields.",
              color: "purple",
              link: "/ai-suggestions",
              tags: ["Quantum Computing", "ETH Zurich"],
            },
            {
              icon: Layers,
              title: "Lifecycle Management",
              desc: "From proposal to publication, manage every stage of your academic journey with integrated tools for milestones and peer reviews.",
              color: "emerald",
              link: "/my-projects",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 space-y-5 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 bg-${card.color}-50 dark:bg-${card.color}-950/50 text-${card.color}-600 dark:text-${card.color}-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {card.desc}
                </p>
                {card.tags && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {card.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to={card.link}
                className="inline-flex items-center gap-1.5 text-sm font-extrabold text-indigo-600 dark:text-indigo-400 hover:gap-3 transition-all group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
              >
                <span>Learn more</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Wide Card: Verified Academic Reputation */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all">
          <div className="space-y-4 max-w-xl">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Verified Academic Reputation</h3>
            <p className="text-sm text-indigo-100 font-medium leading-relaxed">
              Build a professional portfolio that tracks your contributions across multiple projects. Earn badges for leadership, technical prowess, and collaborative spirit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            {["🏆 Leadership Gold", "🌟 Top Research Mentor", "💡 Innovation Award"].map((badge) => (
              <span key={badge} className="px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-extrabold border border-white/10 hover:bg-white/20 transition-all">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* From Concept to Collaboration (Steps) */}
      <section id="teams" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 space-y-10 animate-on-scroll">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold tracking-wider uppercase rounded-full border border-indigo-100 dark:border-indigo-800/50">
              <Rocket className="w-3 h-3 inline mr-1" />
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              From Concept to Collaboration
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              A streamlined 4-step process to get your academic project off the ground.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors hover:border-indigo-300 dark:hover:border-indigo-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors hover:border-indigo-300 dark:hover:border-indigo-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Create Profile", desc: "Input your academic interests, past projects, and specific skills to build your developer portfolio.", icon: User },
            { step: "02", title: "Define Project", desc: "Post your research project or search through thousands of existing opportunities using AI-powered filters.", icon: Target },
            { step: "03", title: "Review Matches", desc: "Our AI produces a short list of optimal collaborators. Review their reputation scores and past project outcomes.", icon: Star },
            { step: "04", title: "Launch Team", desc: "Form your newly assembled team and finish tasks, milestones, and version-control connections securely.", icon: Rocket },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 opacity-60">
                  {step.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <step.icon className="w-5 h-5" />
                </div>
              </div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {step.title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 animate-on-scroll">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold tracking-wider uppercase rounded-full border border-indigo-100 dark:border-indigo-800/50">
            <Users className="w-3 h-3 inline mr-1" />
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            What Our Community Says
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800"
                    />
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentTestimonial
                    ? "w-8 bg-indigo-600 dark:bg-indigo-400"
                    : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 animate-on-scroll">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-indigo-200 text-[10px] font-extrabold tracking-wider uppercase rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join the Future of Research</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Ready to optimize your academic research?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
              Join thousands of students and faculty members who are redefining how academic teams are built and managed.
            </p>
          </div>
          <div className="pt-4 relative z-10">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/40 active:scale-95 inline-flex items-center gap-2 group"
            >
              <span>JOIN COLLABIQ TODAY</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="text-xs text-slate-500 font-medium relative z-10">
            Free for students and university verified researchers.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800 pt-16 pb-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200/60 dark:border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                CollabIQ
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs">
              Introducing the next generation of researchers with artificial intelligence designed for team excellence.
            </p>
            <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
              {[Globe, Share2, Mail].map((Icon, index) => (
                <button
                  key={index}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {[
            {
              title: "Platform",
              links: ["AI Matching", "Project Discovery", "Team Analytics", "Integrations"],
            },
            {
              title: "Resources",
              links: ["Research Papers", "Community Hub", "API Documentation", "Help Center"],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <p>© 2026 CollabIQ Academic Excellence. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Status: Optimal</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>v2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}