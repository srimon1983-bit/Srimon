
import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Shield, Loader2, RefreshCcw, Scale, BookOpen, X, File, MessageSquare,
  ArrowRightLeft, Plus, Info, HelpCircle, FileCheck, Search, Globe, ChevronDown, AlertCircle, CheckCircle, Share2
} from 'lucide-react';
import { analyzeContract, compareContracts, AnalysisPayload } from './services/geminiService';
import { AnalysisState, ComparisonState, ContractAnalysis } from './types';
import AnalysisDashboard from './components/AnalysisDashboard';
import ClauseLibrary from './components/ClauseLibrary';
import ChatWindow from './components/ChatWindow';
import ComparisonView from './components/ComparisonView';

interface ComparisonFile {
  name: string;
  base64: string;
  mimeType: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'library' | 'chat' | 'comparison'>('comparison');
  const [jurisdiction, setJurisdiction] = useState('India (Contract Act, 1872)');
  const [arbitrationCountry, setArbitrationCountry] = useState('Singapore (SIAC)');
  
  const [contractText, setContractText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({ isLoading: false, error: null, result: null });

  const [comparisonFiles, setComparisonFiles] = useState<(ComparisonFile | null)[]>([null, null, null, null]);
  const [comparisonQuery, setComparisonQuery] = useState('');
  const [comparison, setComparison] = useState<ComparisonState>({ isLoading: false, error: null, result: null });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  const resetAnalysis = () => {
    setAnalysis({ isLoading: false, error: null, result: null });
    setUploadedFile(null);
    setContractText('');
  };

  const resetComparison = () => {
    setComparison({ isLoading: false, error: null, result: null });
    setComparisonFiles([null, null, null, null]);
    setComparisonQuery('');
  };

  const processFile = (file: File): Promise<ComparisonFile> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          base64: (reader.result as string).split(',')[1],
          mimeType: file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    if (files.length === 0) return;

    const newFiles = [...comparisonFiles];
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        newFiles[i] = await processFile(files[i]);
      }
    }
    setComparisonFiles(newFiles);
    e.target.value = '';
  };

  const handleComparisonFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await processFile(file);
    const newFiles = [...comparisonFiles];
    newFiles[index] = uploaded;
    setComparisonFiles(newFiles);
    e.target.value = '';
  };

  const removeComparisonFile = (index: number) => {
    const newFiles = [...comparisonFiles];
    newFiles[index] = null;
    setComparisonFiles(newFiles);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploaded = await processFile(file);
    setUploadedFile(uploaded);
    setContractText('');
    e.target.value = '';
  };

  const handleAnalyze = async () => {
    const payload: AnalysisPayload = uploadedFile ? { fileData: { data: uploadedFile.base64, mimeType: uploadedFile.mimeType } } : { text: contractText };
    if (!payload.text && !payload.fileData) return;
    setAnalysis({ isLoading: true, error: null, result: null });
    try {
      const result = await analyzeContract(payload, jurisdiction, arbitrationCountry);
      setAnalysis({ isLoading: false, error: null, result });
    } catch (err) {
      setAnalysis({ isLoading: false, error: "Analysis failed. Please try a different document format.", result: null });
    }
  };

  const handleCompare = async () => {
    const activeFiles = comparisonFiles.filter(f => f !== null) as ComparisonFile[];
    if (activeFiles.length < 2) { 
      alert("Please upload at least 2 documents to perform a comprehensive comparison and error audit."); 
      return; 
    }
    setComparison({ isLoading: true, error: null, result: null });
    try {
      const result = await compareContracts(activeFiles.map(f => ({ name: f.name, data: f.base64, mimeType: f.mimeType })), jurisdiction, comparisonQuery);
      setComparison({ isLoading: false, error: null, result });
    } catch (err) {
      setComparison({ isLoading: false, error: "Comparison failed. Ensure files are valid PDFs or Word documents.", result: null });
    }
  };

  const handleShare = (type: 'whatsapp' | 'email') => {
    const url = window.location.href;
    const title = "EasyVetContract - Professional Contract Intelligence";
    const text = "Check out this amazing tool for contract vetting, cross-document comparison, and legal error spotting. It provides deep insights into exposure and suggests improvements under global laws!";
    
    if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n' + text + '\n' + url)}`, '_blank');
    } else {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
    }
  };

  const countries = [
    "Global Standards (UNCITRAL)",
    "India (Contract Act, 1872)",
    "Singapore (Contract Law)",
    "UK (English Common Law)",
    "USA (Uniform Commercial Code)",
    "UAE (DIFC / ADGM Common Law)",
    "Indonesia (Civil Code Book III)",
    "Australia (Contract Law)",
    "Germany (BGB Civil Code)",
    "South Africa (Contract Law)",
    "Hong Kong (Common Law)"
  ];

  const arbitrationCountries = ["Singapore (SIAC)", "UK (LCIA)", "UAE (DIAC)", "USA (AAA/ICDR)", "India (MCIA)", "Hong Kong (HKIAC)"];

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      <nav className="glass-panel sticky top-0 z-50 px-8 py-4 flex items-center justify-between border-b shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2.5 rounded-xl shadow-lg shadow-slate-200">
            <Scale className="text-white" size={24} />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter text-slate-900 leading-none block">EasyVet<span className="text-blue-600">Contract</span></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Multi-Doc Vetting Platform</span>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center bg-white/50 p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <button onClick={() => setActiveTab('comparison')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'comparison' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}><ArrowRightLeft size={16} /> Multi-Vetting (4 Docs)</button>
          <button onClick={() => setActiveTab('analyzer')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'analyzer' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}><Shield size={16} /> Single Auditor</button>
          <button onClick={() => setActiveTab('library')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'library' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}><BookOpen size={16} /> Clause Standards</button>
          <button onClick={() => setActiveTab('chat')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'chat' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}><MessageSquare size={16} /> AI Chat</button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="group relative">
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-2 font-bold text-xs">
              <Share2 size={16} /> Share
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button onClick={() => handleShare('whatsapp')} className="w-full text-left px-4 py-2 hover:bg-green-50 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> WhatsApp
              </button>
              <button onClick={() => handleShare('email')} className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> Email
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {activeTab === 'comparison' ? (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {!comparison.result ? (
              <>
                <div className="text-center space-y-4">
                  <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-tight">Contract <span className="text-blue-600">Multi-Vetting</span></h1>
                  <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto italic">Comprehensive exposure analysis, spotting logical errors, and cross-referencing contradictions across up to 4 legal documents.</p>
                </div>
                
                <div className="glass-panel rounded-[2.5rem] p-12 shadow-2xl border-slate-200 space-y-10 bg-white/90">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-800 flex items-center gap-3"><FileText className="text-blue-600" /> Vetting Queue (Max 4 PDF/Word)</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Selected Law: {jurisdiction}</p>
                    </div>
                    <button 
                      onClick={() => bulkFileInputRef.current?.click()}
                      className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-100"
                    >
                      <Plus size={18} /> Bulk Upload (PDF/Word)
                    </button>
                    <input type="file" ref={bulkFileInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt" multiple onChange={handleBulkUpload} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {comparisonFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square">
                        {file ? (
                          <div className="h-full w-full p-8 bg-blue-50 border-2 border-blue-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-lg relative animate-in zoom-in-90 duration-300">
                            <button onClick={() => removeComparisonFile(idx)} className="absolute top-4 right-4 p-2.5 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-all hover:scale-110"><X size={18} /></button>
                            <div className="p-5 bg-white rounded-[1.5rem] shadow-sm mb-6 text-blue-600"><FileText size={40} /></div>
                            <p className="text-sm font-black text-slate-900 line-clamp-2 leading-tight px-2">{file.name}</p>
                            <div className="mt-auto flex items-center gap-1 text-[10px] text-blue-600 font-black uppercase tracking-widest pt-4"><FileCheck size={14} /> Ready for Audit</div>
                          </div>
                        ) : (
                          <button onClick={() => multiFileInputRefs[idx].current?.click()} className="h-full w-full border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-300 hover:border-blue-400 hover:bg-blue-50/10 hover:text-blue-400 transition-all group bg-slate-50/30">
                            <div className="p-5 bg-white rounded-[1.5rem] group-hover:bg-blue-600 group-hover:text-white shadow-sm transition-all"><Plus size={32} /></div>
                            <div className="text-center">
                              <span className="block text-sm font-black uppercase tracking-widest">Slot {idx + 1}</span>
                              <span className="text-[10px] font-bold opacity-60">Upload PDF/Word</span>
                            </div>
                          </button>
                        )}
                        <input type="file" ref={multiFileInputRefs[idx]} className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={(e) => handleComparisonFileChange(e, idx)} />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Globe size={14} className="text-blue-500"/> Applicable Law Jurisdiction</label>
                       <div className="relative">
                          <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-bold outline-none appearance-none focus:ring-4 focus:ring-blue-100 transition-all">{countries.map(c => <option key={c} value={c}>{c}</option>)}</select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Shield size={14} className="text-blue-500"/> Arbitration Seat</label>
                       <div className="relative">
                          <select value={arbitrationCountry} onChange={(e) => setArbitrationCountry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-bold outline-none appearance-none focus:ring-4 focus:ring-blue-100 transition-all">{arbitrationCountries.map(c => <option key={c} value={c}>{c}</option>)}</select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-black text-slate-700 flex items-center gap-2"><HelpCircle size={18} className="text-blue-600" /> Specific Audit Requirements or User Questions (Optional)</label>
                    <textarea 
                      value={comparisonQuery} 
                      onChange={(e) => setComparisonQuery(e.target.value)} 
                      placeholder="E.g., 'Spot any contradictory payment terms between doc 1 and 2' or 'Point out exposure for me as the Buyer in these contracts'..." 
                      className="w-full h-32 bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 text-lg text-slate-800 placeholder:text-slate-300 resize-none shadow-inner outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>

                  <button onClick={handleCompare} disabled={comparison.isLoading || comparisonFiles.filter(f => f !== null).length < 2} className="w-full bg-slate-900 text-white py-7 rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-4 transition-all">
                    {comparison.isLoading ? <Loader2 className="animate-spin" /> : <><ArrowRightLeft size={24} /> Comprehensive Multi-Audit</>}
                  </button>
                </div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Vetting & Audit <span className="text-blue-600">Report</span></h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Analysis of {comparisonFiles.filter(f => f !== null).length} documents under {jurisdiction}</p>
                  </div>
                  <button onClick={resetComparison} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-all"><RefreshCcw size={18}/> Reset Session</button>
                </div>
                <ComparisonView data={comparison.result} />
              </div>
            )}
          </div>
        ) : activeTab === 'analyzer' ? (
          <div className="max-w-4xl mx-auto space-y-12">
             {!analysis.result ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center space-y-4">
                  <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-tight">Single Contract <span className="text-blue-600">Auditor</span></h1>
                  <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto italic">Deep dive analysis of one document for exposure, errors, and fair improvement suggestions.</p>
                </div>
                
                <div className="glass-panel rounded-[2rem] p-10 shadow-2xl border-slate-200 space-y-8 bg-white/90">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Applicable Jurisdiction</label>
                      <select value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-bold outline-none">{countries.map(c => <option key={c} value={c}>{c}</option>)}</select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Arbitration Seat</label>
                      <select value={arbitrationCountry} onChange={(e) => setArbitrationCountry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 font-bold outline-none">{arbitrationCountries.map(c => <option key={c} value={c}>{c}</option>)}</select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {!uploadedFile ? (
                      <div className="relative group">
                        <textarea value={contractText} onChange={(e) => setContractText(e.target.value)} placeholder="Paste legal text here or upload a file..." className="w-full h-80 bg-white border border-slate-200 rounded-[2rem] px-8 py-8 text-lg text-slate-800 resize-none shadow-inner outline-none focus:border-blue-500" />
                        <div className="absolute bottom-6 right-6 flex gap-3">
                          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-sm font-black hover:scale-105 transition-all shadow-xl"><Upload size={18} /> Upload PDF / Word</button>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={handleFileChange}/>
                      </div>
                    ) : (
                      <div className="p-20 border-4 border-dashed border-blue-100 rounded-[3rem] bg-blue-50/20 flex flex-col items-center justify-center gap-6 animate-in zoom-in-95 duration-500">
                        <div className="p-6 bg-white rounded-[2rem] shadow-xl text-blue-600"><FileText size={48} /></div>
                        <p className="text-xl font-black text-slate-900">{uploadedFile.name}</p>
                        <button onClick={() => setUploadedFile(null)} className="px-6 py-2 bg-white text-red-500 rounded-full text-xs font-black shadow-sm">Clear Selection</button>
                      </div>
                    )}
                  </div>
                  
                  <button onClick={handleAnalyze} disabled={analysis.isLoading || (!contractText.trim() && !uploadedFile)} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-blue-700 transition-all">
                    {analysis.isLoading ? <Loader2 className="animate-spin" /> : <><Shield size={24} /> Audit Contract Now</>}
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{analysis.result.contractTitle}</h2>
                  <button onClick={resetAnalysis} className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-slate-50 transition-all"><RefreshCcw size={18}/> New Session</button>
                </div>
                <AnalysisDashboard data={analysis.result} />
              </div>
            )}
          </div>
        ) : activeTab === 'library' ? <ClauseLibrary /> : <ChatWindow analysisContext={analysis.result} />}
      </main>
      
      <footer className="py-12 border-t border-slate-200 px-8 text-center bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            International Contract Vetting & Error Spotting AI • Privacy Secure • Powered by Gemini
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
