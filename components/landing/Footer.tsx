export function Footer() {
  return (
    <footer className="py-12 bg-[#0A101C] border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">C</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CityNerve</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://github.com/Aaryan-2903/CityNerve" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
              GitHub Repository
            </a>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800/50">
          <p className="text-slate-500 text-sm">
            Empowering disaster management agencies with intelligent, real-time command capabilities.
          </p>
          <p className="text-slate-500 text-sm">
            Built with <span className="text-red-500">❤️</span> by <a href="https://github.com/Aaryan-2903" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors font-medium">Aryan Mandal</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
