import React, { useState } from 'react';
import { ShieldCheck, Scale, Globe, AlertTriangle, CheckCircle2, Search, FileText, Lock, Building, Cpu, Award } from 'lucide-react';
import { REGULATORY_FRAMEWORKS, GLOBAL_JURISDICTIONS, SANCTIONED_ADDRESS_DATABASE } from '../data/complianceData';

export const GlobalCompliance: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState(REGULATORY_FRAMEWORKS[0]);
  const [searchAddress, setSearchAddress] = useState('');
  const [screeningResult, setScreeningResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'frameworks' | 'jurisdictions' | 'aml-screener' | 'disclosures'>('frameworks');

  const handleScreenAddress = (addrToTest?: string) => {
    const target = (addrToTest || searchAddress).trim().toLowerCase();
    if (!target) return;

    const matched = SANCTIONED_ADDRESS_DATABASE.find(
      (r) => r.address.toLowerCase() === target
    );

    if (matched) {
      setScreeningResult(matched);
    } else {
      setScreeningResult({
        address: target,
        label: 'Not present in bundled demo fixtures',
        riskCategory: 'Not screened',
        riskScore: null,
        sanctionSource: 'No live sanctions provider was queried. Absence from this local demo list is NOT a clearance.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">Regulatory & Compliance Research Center</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  Legal review required
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Design-time research mapping for MiCA, AML/CFT, privacy and AI-regulation considerations. No compliance certification is claimed.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Certification</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">Not assessed</span>
            </div>
            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Research scope</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">Selected markets</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation */}
        <div className="flex space-x-2 pt-2 border-t border-slate-800/80">
          {[
            { id: 'frameworks', label: 'Regulatory Frameworks', icon: ShieldCheck },
            { id: 'jurisdictions', label: 'Global Jurisdictions Matrix', icon: Globe },
            { id: 'aml-screener', label: 'AML & Sanctions Screener', icon: Search },
            { id: 'disclosures', label: 'Legal Disclosures & Whitepaper', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Regulatory Frameworks */}
      {activeTab === 'frameworks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Framework List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Research Checklists</h3>
            <div className="space-y-2">
              {REGULATORY_FRAMEWORKS.map((f) => {
                const isSelected = f.id === selectedFramework.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFramework(f)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/50 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{f.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${f.badgeColor}`}>
                        {f.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-cyan-400/80 mt-1 block">{f.jurisdiction}</span>
                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{f.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Framework Detail View */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Award className="w-5 h-5 text-cyan-400" />
                  <span>{selectedFramework.name}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Reference body: {selectedFramework.standardBody}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-lg border font-semibold ${selectedFramework.badgeColor}`}>
                {selectedFramework.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/60">
              {selectedFramework.summary}
            </p>

            {/* Key Articles Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Requirements & Design Mapping
              </h3>
              <div className="space-y-3">
                {selectedFramework.keyArticles.map((art, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-cyan-300">{art.article}</span>
                      <span className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{art.auditStatus}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <strong className="text-slate-300">Research requirement:</strong> {art.requirement}
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400">Prototype mapping:</strong> {art.qmoosaImplementation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Global Jurisdictions Matrix */}
      {activeTab === 'jurisdictions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Jurisdiction Research Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              High-level research prompts only. Actual token/service classification requires qualified, jurisdiction-specific legal analysis.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Jurisdiction</th>
                  <th className="px-4 py-3">Regulator</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Possible classification</th>
                  <th className="px-4 py-3">Travel Rule Trigger</th>
                  <th className="px-4 py-3">Research notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {GLOBAL_JURISDICTIONS.map((j, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40">
                    <td className="px-4 py-3.5 font-bold text-white font-sans">{j.country}</td>
                    <td className="px-4 py-3.5 text-slate-400">{j.regulator}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {j.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-cyan-300">{j.qmsTokenClass}</td>
                    <td className="px-4 py-3.5 text-amber-400 font-bold">{j.travelRuleThresholdUsd === null ? 'Requires legal review' : `${j.travelRuleThresholdUsd.toLocaleString()}`}</td>
                    <td className="px-4 py-3.5 text-slate-400 text-[11px] font-sans">{j.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: AML & Sanctions Screener */}
      {activeTab === 'aml-screener' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Demo Watchlist Matching</h2>
              <p className="text-xs text-slate-400">
                UI demonstration only. This repository does not query a live OFAC, UN, EU, commercial or government sanctions provider.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter Ethereum or Solana address (e.g. 0x8576acc5...)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => handleScreenAddress()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              Check Demo Fixtures
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Synthetic presets:</span>
            {SANCTIONED_ADDRESS_DATABASE.map((record, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchAddress(record.address);
                  handleScreenAddress(record.address);
                }}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 transition-all cursor-pointer"
              >
                {record.label.substring(0, 24)}...
              </button>
            ))}
          </div>

          {/* Screening Output */}
          {screeningResult && (
            <div
              className={`p-5 rounded-xl border space-y-3 ${
                typeof screeningResult.riskScore === 'number' && screeningResult.riskScore > 30
                  ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                  : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {typeof screeningResult.riskScore === 'number' && screeningResult.riskScore > 30 ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="font-bold text-sm">{screeningResult.riskCategory}</span>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                  Risk Score: {typeof screeningResult.riskScore === 'number' ? `${screeningResult.riskScore}/100` : 'Not assessed'}
                </span>
              </div>

              <div className="font-mono text-xs text-slate-300 break-all bg-slate-950 p-3 rounded-lg border border-slate-800">
                Target: {screeningResult.address}
              </div>

              <p className="text-xs text-slate-300">{screeningResult.sanctionSource}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Legal Disclosures */}
      {activeTab === 'disclosures' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Legal / Product Design Disclosures</h2>
          </div>

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-cyan-400">1. Non-Custodial Design Goal</h3>
              <p>
                The repository explores a non-custodial smart-account design. Whether a deployed service is legally or operationally non-custodial depends on the actual contracts, keys, operators, upgrade controls and service architecture.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-purple-400">2. Tokenomics Design & Legal Review</h3>
              <p>
                The source includes a proposed hard-cap token model. This repository does not determine the token's legal classification and does not claim MiCA, securities or payments compliance.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-bold text-sm text-amber-400">3. Human-in-the-Loop Design Goal</h3>
              <p>
                The prototype includes configurable human-approval thresholds. This is a product-control concept, not evidence of EU AI Act or other regulatory compliance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
