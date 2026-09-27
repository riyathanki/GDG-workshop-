import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileCheck, 
  Building, 
  Users, 
  ShieldCheck, 
  Calendar,
  Layers,
  Search,
  Download,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    applications, 
    auditLogs, 
    services, 
    allUsers, 
    setCurrentView, 
    setActiveReviewAppId 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'workload' | 'audit_trail'>('analytics');
  const [auditSearch, setAuditSearch] = useState('');

  // Analytics aggregations
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.status === 'approved').length;
  const rejectedApps = applications.filter(a => a.status === 'rejected').length;
  const correctionApps = applications.filter(a => a.status === 'correction_required').length;
  const pendingApps = applications.filter(a => a.status === 'under_officer_review' || a.status === 'initial_verification').length;

  const approvalRate = totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 85;
  const correctionRate = totalApps > 0 ? Math.round((correctionApps / totalApps) * 100) : 18;

  // Filter audit logs
  const filteredAuditLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.entityId.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.details.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header Card */}
      <div className="rounded-xl bg-slate-900 text-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>State Department & Administrative Reforms Directorate</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            GovFlow Executive Service Operations Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Public Service Guarantee Act (PSGA) SLA Compliance & Real-Time Performance Analytics
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-medium">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'analytics' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Analytics & SLAs
          </button>

          <button
            onClick={() => setActiveTab('workload')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'workload' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Department Workload
          </button>

          <button
            onClick={() => setActiveTab('audit_trail')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'audit_trail' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            Immutable Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS & STATS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          {/* 4 Core Summary Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Gross Application Volume</span>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">{totalApps} Applications</div>
              <div className="text-[10px] text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12.4% vs preceding month</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Average Processing Time</span>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">3.8 Days</div>
              <div className="text-[10px] text-emerald-600 mt-1 font-medium">
                Within 7-day statutory mandate
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Approval / Rejection Ratio</span>
              <div className="text-2xl font-bold text-emerald-600 font-mono mt-1 tabular-nums">{approvalRate}% Approved</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {approvedApps} Approved · {rejectedApps} Rejected
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Document Correction Rate</span>
              <div className="text-2xl font-bold text-amber-600 font-mono mt-1 tabular-nums">{correctionRate}% Flagged</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Resolved within 24h by citizens
              </div>
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Applications Volume Trend per Day (Synthetic Bar Simulation) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Applications Volume by Day (Last 7 Days)
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Total: 482 Applications</span>
              </div>

              <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                {[
                  { day: '20 Sep', count: 42, pct: 45 },
                  { day: '21 Sep', count: 58, pct: 62 },
                  { day: '22 Sep', count: 74, pct: 78 },
                  { day: '23 Sep', count: 86, pct: 90 },
                  { day: '24 Sep', count: 94, pct: 100 },
                  { day: '25 Sep', count: 68, pct: 72 },
                  { day: '26 Sep', count: 60, pct: 64 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div 
                      style={{ height: `${item.pct}%` }} 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-t transition-all shadow-2xs"
                    />
                    <span className="text-[10px] text-slate-400 font-mono mt-1">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Applications by Public Service Category */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Service Distribution Breakdown
                </h3>
                <span className="text-[11px] font-mono text-slate-400">By Service Type</span>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                {[
                  { name: 'Income Certificate', count: 218, pct: 45, color: 'bg-indigo-600' },
                  { name: 'Caste Certificate', count: 124, pct: 26, color: 'bg-teal-600' },
                  { name: 'Domicile Certificate', count: 82, pct: 17, color: 'bg-amber-500' },
                  { name: 'Residence Certificate', count: 36, pct: 7, color: 'bg-rose-500' },
                  { name: 'Scholarships & Vital Statistics', count: 22, pct: 5, color: 'bg-slate-500' }
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold">{s.name}</span>
                      <span className="font-mono text-slate-500">{s.count} ({s.pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div style={{ width: `${s.pct}%` }} className={`h-full ${s.color} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: DEPARTMENT WORKLOAD & OFFICER PRODUCTIVITY */}
      {activeTab === 'workload' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Department Caseload & Officer Performance Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live capacity and resolution throughput across administrative divisions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Sub-Division / Office</th>
                  <th className="py-3 px-4">Supervising Officer</th>
                  <th className="py-3 px-4">Total Assigned</th>
                  <th className="py-3 px-4">Pending Scrutiny</th>
                  <th className="py-3 px-4">Average Resolution Time</th>
                  <th className="py-3 px-4">SLA Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">Revenue Sub-Division West</td>
                  <td className="py-3 px-4">Rajesh Verma (SDM)</td>
                  <td className="py-3 px-4 font-mono">148</td>
                  <td className="py-3 px-4 font-mono text-amber-600 font-bold">12</td>
                  <td className="py-3 px-4 font-mono">3.2 Days</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      98.2% Within SLA
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">Social Welfare Vadodara</td>
                  <td className="py-3 px-4">Pooja Trivedi (SWO)</td>
                  <td className="py-3 px-4 font-mono">112</td>
                  <td className="py-3 px-4 font-mono text-amber-600 font-bold">18</td>
                  <td className="py-3 px-4 font-mono">5.4 Days</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      95.0% Within SLA
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-slate-900">District Collectorate Gandhinagar</td>
                  <td className="py-3 px-4">Manish Desai (ADM)</td>
                  <td className="py-3 px-4 font-mono">222</td>
                  <td className="py-3 px-4 font-mono text-amber-600 font-bold">9</td>
                  <td className="py-3 px-4 font-mono">2.8 Days</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      99.1% Within SLA
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: IMMUTABLE AUDIT TRAIL */}
      {activeTab === 'audit_trail' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
          
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Cryptographically Anchored Immutable Audit Trail
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Every application creation, document upload, optical check, officer review remark, and certificate signing event is permanently logged with IP and actor role.
              </p>
            </div>

            {/* Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={auditSearch}
                onChange={e => setAuditSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Statutory Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Scrutiny Particulars</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No audit events matched.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 font-mono">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 font-sans">
                        {log.actorName}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                          log.actorRole === 'officer'
                            ? 'bg-amber-100 text-amber-900'
                            : log.actorRole === 'citizen'
                            ? 'bg-indigo-100 text-indigo-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 font-sans">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-indigo-700 font-bold">
                        {log.entityId}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
