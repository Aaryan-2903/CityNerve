export function Footer() {
  return (
    <footer className="py-12 bg-[#0A101C] border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg leading-none">C</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CityNerve</span>
        </div>
        
        <p className="text-slate-500">
          Built with <span className="text-red-500">❤️</span> by <a href="https://github.com/Aaryan-2903" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors font-medium">Aryan Mandal</a>
        </p>
      </div>
    </footer>
  );
}
