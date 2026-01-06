
import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Briefcase, ShoppingCart, Home, ChevronRight, Info, User, Building, Anchor } from 'lucide-react';
import { clauseLibrary, ClauseDetail } from '../data/clauseLibrary';

const ClauseLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClause, setSelectedClause] = useState<ClauseDetail | null>(clauseLibrary.find(c => c.category === 'SCoTA (Coal Trading)') || clauseLibrary[0]);

  const filteredClauses = useMemo(() => {
    return clauseLibrary.filter(clause => {
      const matchesSearch = clause.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          clause.explanation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || clause.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6 animate-in fade-in duration-500">
      {/* Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-4 shadow-sm border-slate-200">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search clauses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <button 
              onClick={() => setSelectedCategory(null)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${!selectedCategory ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <BookOpen size={16} /> All Standards
            </button>
            <button 
              onClick={() => setSelectedCategory('SCoTA (Coal Trading)')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'SCoTA (Coal Trading)' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Anchor size={16} /> SCoTA / Global Coal
            </button>
            <button 
              onClick={() => setSelectedCategory('Employment')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'Employment' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Briefcase size={16} /> Employment
            </button>
            <button 
              onClick={() => setSelectedCategory('Sales')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'Sales' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <ShoppingCart size={16} /> Sales & Goods
            </button>
            <button 
              onClick={() => setSelectedCategory('Lease')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === 'Lease' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Home size={16} /> Real Estate / Lease
            </button>
          </div>
        </div>

        <div className="flex-1 glass-panel rounded-2xl overflow-hidden shadow-sm border-slate-200 flex flex-col">
          <div className="p-4 border-b bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clauses ({filteredClauses.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {filteredClauses.map(clause => (
              <button
                key={clause.id}
                onClick={() => setSelectedClause(clause)}
                className={`w-full text-left p-3 rounded-xl transition-all group mb-1 ${selectedClause?.id === clause.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-semibold ${selectedClause?.id === clause.id ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'}`}>
                    {clause.title}
                  </span>
                  <ChevronRight size={14} className={selectedClause?.id === clause.id ? 'text-blue-400' : 'text-slate-300'} />
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{clause.category}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {selectedClause ? (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-8 shadow-sm border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    selectedClause.category.includes('SCoTA') ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedClause.category} Standard
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mt-3">{selectedClause.title}</h2>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                <div className="flex gap-3">
                  <Info className="text-blue-500 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Legal Summary & Practical Meaning</h4>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      {selectedClause.explanation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Official Standard Language</h3>
                  <div className="p-5 bg-white border border-slate-200 rounded-2xl font-mono text-sm text-slate-700 leading-relaxed shadow-inner border-l-4 border-l-blue-500">
                    "{selectedClause.standardLanguage}"
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                      <User size={16} /> Pro-Buyer Variation
                    </h3>
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm italic text-emerald-900 leading-relaxed">
                      "{selectedClause.proBuyerVariation}"
                    </div>
                  </section>
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
                      <Building size={16} /> Pro-Seller Variation
                    </h3>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm italic text-amber-900 leading-relaxed">
                      "{selectedClause.proSellerVariation}"
                    </div>
                  </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-lg">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Implications for the Buyer</h4>
                    <p className="text-sm opacity-90 leading-relaxed">{selectedClause.buyerImplications}</p>
                  </div>
                  <div className="p-6 bg-slate-800 rounded-2xl text-white shadow-lg">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Implications for the Seller</h4>
                    <p className="text-sm opacity-90 leading-relaxed">{selectedClause.sellerImplications}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center glass-panel rounded-3xl border-dashed border-2 border-slate-200">
            <div className="text-center text-slate-400">
              <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
              <p>Select a clause from the sidebar to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClauseLibrary;
