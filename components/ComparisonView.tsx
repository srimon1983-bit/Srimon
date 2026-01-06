
import React from 'react';
import { 
  AlertCircle, CheckCircle2, Crown, Info, 
  ArrowRightLeft, ShieldAlert, Target, Zap, 
  FileWarning, Edit3, Lightbulb
} from 'lucide-react';
import { ComparisonResult, RiskLevel } from '../types';

interface Props {
  data: ComparisonResult;
}

const ComparisonView: React.FC<Props> = ({ data }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
      case 'Major': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      {/* Executive Summary */}
      <div className="glass-panel rounded-3xl p-8 shadow-sm border-l-8 border-indigo-600 bg-white">
        <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
          <Target className="text-indigo-600" /> Executive Vetting Summary
        </h2>
        <p className="text-slate-700 leading-relaxed text-lg font-medium italic">
          "{data.summary}"
        </p>
      </div>

      {/* Spotted Errors & Inconsistencies */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 px-2">
          <FileWarning className="text-red-500" /> Spotted Errors & Contradictions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.spottedErrors.map((error, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border-2 flex flex-col gap-3 transition-all hover:shadow-md ${getSeverityColor(error.severity)}`}>
              <div className="flex justify-between items-start">
                <span className="text-xs font-black uppercase tracking-widest">{error.location}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-white">{error.severity} Severity</span>
              </div>
              <p className="text-sm font-bold text-slate-800 leading-relaxed">{error.description}</p>
            </div>
          ))}
          {data.spottedErrors.length === 0 && (
            <div className="col-span-full p-8 bg-green-50 border-2 border-dashed border-green-200 rounded-3xl text-center text-green-700 font-bold">
              No logical errors or contradictory terms detected across documents.
            </div>
          )}
        </div>
      </div>

      {/* Suggested Improvements */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 px-2">
          <Edit3 className="text-blue-500" /> Suggested Redline Improvements
        </h3>
        <div className="space-y-4">
          {data.suggestedImprovements.map((imp, idx) => (
            <div key={idx} className="glass-panel rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Language / Issue</span>
                  <p className="text-sm text-slate-600 italic leading-relaxed">"{imp.originalClause}"</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Optimized Recommendation</span>
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-sm font-bold text-blue-900 leading-relaxed">
                    {imp.suggestedChange}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center pt-4 border-t border-slate-100">
                <Lightbulb size={18} className="text-amber-500" />
                <p className="text-xs font-bold text-slate-500"><span className="text-slate-800">Benefit:</span> {imp.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorical Variance Map */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 px-2">
          <ArrowRightLeft className="text-indigo-600" /> Cross-Document Exposure Map
        </h3>
        <div className="space-y-8">
          {data.crossContractExposures.map((category, idx) => (
            <div key={idx} className="glass-panel rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <div className="bg-slate-50 px-8 py-5 border-b flex justify-between items-center">
                <h4 className="font-black text-slate-700 uppercase tracking-tighter text-base">{category.category}</h4>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black shadow-sm">
                  <Crown size={14} /> Favorable: {category.winner}
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.findings.map((finding, fIdx) => (
                    <div key={fIdx} className={`p-6 rounded-2xl border-2 ${
                      category.winner === finding.contractName ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-black text-slate-500 uppercase">{finding.contractName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${finding.riskLevel === 'Critical' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {finding.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{finding.summary}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900 text-white p-6 rounded-2xl flex gap-5 items-start shadow-xl">
                  <div className="p-2.5 bg-indigo-600 rounded-xl shrink-0"><Zap size={22} /></div>
                  <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Strategic Vetting Recommendation</h5>
                    <p className="text-sm font-medium opacity-90 leading-relaxed">{category.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conflict & Holistic Exposure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-lg font-black text-slate-900 px-2 flex gap-2"><AlertCircle className="text-red-500" /> Critical Conflict Alerts</h3>
           <div className="space-y-3">
            {data.conflictAlerts.map((alert, idx) => (
              <div key={idx} className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-700 flex gap-3">
                <span className="shrink-0 text-red-400 mt-0.5">•</span>
                {alert}
              </div>
            ))}
            {data.conflictAlerts.length === 0 && <p className="text-sm text-slate-400 italic px-2">No critical execution conflicts identified.</p>}
           </div>
        </div>
        <div className="space-y-4">
           <h3 className="text-lg font-black text-slate-900 px-2">Party Exposure</h3>
           <div className="space-y-4">
              {data.holisticExposureForParties.map((party, idx) => (
                <div key={idx} className="p-5 glass-panel rounded-2xl border border-slate-200 shadow-sm space-y-2">
                   <div className="flex justify-between font-black uppercase tracking-widest text-[10px]">
                      <span className="text-slate-500">{party.party}</span>
                      <span className={party.exposureLevel.includes('High') ? 'text-red-500' : 'text-emerald-500'}>{party.exposureLevel}</span>
                   </div>
                   <p className="text-xs font-bold text-slate-700 leading-relaxed">{party.criticalWarning}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
