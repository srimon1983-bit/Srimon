
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { ShieldAlert, ShieldCheck, Info, ArrowRight, Gavel, Globe, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ContractAnalysis, RiskLevel } from '../types';

interface Props {
  data: ContractAnalysis;
}

const AnalysisDashboard: React.FC<Props> = ({ data }) => {
  const riskCounts = data.exposures.reduce((acc, exp) => {
    acc[exp.riskLevel] = (acc[exp.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(riskCounts).map(([name, value]) => ({ name, value }));
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f87171';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Gavel size={24} />
            </div>
            <h3 className="font-bold text-slate-800">Contract Score</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900">{100 - data.overallRiskScore}</span>
            <span className="text-slate-500 text-sm">/ 100 safety score</span>
          </div>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{data.summary}</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 shadow-sm border-l-4 border-emerald-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-slate-800">Buyer Exposure</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{data.buyerExposureSummary}</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 shadow-sm border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <ShieldAlert size={24} />
            </div>
            <h3 className="font-bold text-slate-800">Seller Exposure</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{data.sellerExposureSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Chart */}
        <div className="glass-panel rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Risk Profile Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Missing Clauses */}
        <div className="glass-panel rounded-2xl p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Critical Missing Elements
          </h3>
          <ul className="space-y-3">
            {data.missingClauses.map((clause, idx) => (
              <li key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-slate-700 text-sm font-medium">{clause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Clause Analysis Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 px-2">Detailed Clause Analysis</h3>
        <div className="space-y-6">
          {data.exposures.map((exp, idx) => (
            <div key={idx} className="glass-panel rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
              <div className={`px-6 py-3 flex justify-between items-center ${
                exp.riskLevel === 'Critical' ? 'bg-red-50 border-b border-red-100' : 
                exp.riskLevel === 'High' ? 'bg-orange-50 border-b border-orange-100' : 'bg-slate-50 border-b'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    exp.riskLevel === 'Critical' ? 'bg-red-500 text-white' : 
                    exp.riskLevel === 'High' ? 'bg-orange-500 text-white' : 
                    exp.riskLevel === 'Medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {exp.riskLevel} Risk
                  </span>
                  <h4 className="font-bold text-slate-800">{exp.clauseTitle}</h4>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Original Language</span>
                    <blockquote className="mt-2 p-3 bg-slate-50 border-l-4 border-slate-300 rounded text-sm italic text-slate-600">
                      "{exp.originalText}"
                    </blockquote>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Analysis</span>
                    <p className="mt-2 text-sm text-slate-700 leading-relaxed">{exp.explanation}</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-xs font-bold text-emerald-600 block mb-1">Impact on Buyer</span>
                      <p className="text-xs text-slate-700">{exp.impactOnBuyer}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <span className="text-xs font-bold text-amber-600 block mb-1">Impact on Seller</span>
                      <p className="text-xs text-slate-700">{exp.impactOnSeller}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase">Suggested Revision (Global Standard)</span>
                    <div className="mt-2 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm font-mono text-blue-900">
                      {exp.suggestedRevision}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
