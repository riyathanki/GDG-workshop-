import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Inbox, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Filter, 
  Search, 
  Eye, 
  Shield, 
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Calendar,
  Layers
} from 'lucide-react';
import { OfficerReviewView } from './OfficerReviewView';

export const OfficerPortal: React.FC = () => {
  const { 
    currentUser, 
    applications, 
    activeReviewAppId, 
    setActiveReviewAppId 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'corrections' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // If currently inspecting an application, render OfficerReviewView
  if (activeReviewAppId) {
    return (
      <OfficerReviewView
        applicationId={activeReviewAppId}
        onBack={() => setActiveReviewAppId(null)}
      />
    );
  }

  // Calculate metrics
  const totalApps = applications.length;
  const pendingReview = applications.filter(a => a.status === 'under_officer_review' || a.status === 'initial_verification').length;
  const correctionsPending = applications.filter(a => a.status === 'correction_required').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const flaggedDocsCount = applications.reduce((acc, a) => 
    acc + a.documents.filter(d => d.status === 'needs_correction' || d.status === 'under_verification').length, 0
  );

  // Filter applications by tab & search
  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'pending') {
      return app.status === 'under_officer_review' || app.status === 'initial_verification';
    }
    if (activeTab === 'corrections') {
      return app.status === 'correction_required';
    }
    if (activeTab === 'approved') {
      return app.status === 'approved';
    }
    if (activeTab === 'rejected') {
      return app.status === 'rejected';
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Officer Header Card */}
      <div className="rounded-xl bg-slate-900 text-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Revenue Officer Scrutiny Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {currentUser.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentUser.designation || 'Sub-Divisional Magistrate (SDM)'} · {currentUser.department}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-4 py-2.5 rounded-lg border border-slate-700">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-slate-300">Active Jurisdiction: <strong>West Sub-Division, Ahmedabad</strong></span>
        </div>
      </div>

      {/* Dashboard Metrics: 5 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Applications</div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">{totalApps}</div>
          <div className="text-[10px] text-slate-400 mt-1">In Revenue Ledger</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-amber-700">Pending Review</div>
          <div className="text-2xl font-bold text-amber-600 font-mono mt-1 tabular-nums">{pendingReview}</div>
          <div className="text-[10px] text-slate-400 mt-1">Requires Officer Action</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-rose-700">Documents Flagged</div>
          <div className="text-2xl font-bold text-rose-600 font-mono mt-1 tabular-nums">{flaggedDocsCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Quality / Seal Inquiries</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-emerald-700">Approved Today</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono mt-1 tabular-nums">{approvedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Statutory Orders Issued</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs font-medium text-indigo-700">Corrections Pending</div>
          <div className="text-2xl font-bold text-indigo-600 font-mono mt-1 tabular-nums">{correctionsPending}</div>
          <div className="text-[10px] text-slate-400 mt-1">With Applicant Citizens</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        
        {/* Table Controls Bar: Tabs & Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          
          {/* Segmented Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `All (${applications.length})` },
              { id: 'pending', label: `Pending Review (${pendingReview})` },
              { id: 'corrections', label: `Corrections (${correctionsPending})` },
              { id: 'approved', label: `Approved (${approvedCount})` },
              { id: 'rejected', label: 'Rejected' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by App ID, Citizen, Service..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Applications Scrutiny Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Citizen Applicant</th>
                <th className="py-3 px-4">Requested Service</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Scrutiny Status</th>
                <th className="py-3 px-4 text-right">Scrutiny Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No applications matching current filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const isNeedsCorrection = app.status === 'correction_required';
                  const isApproved = app.status === 'approved';
                  const isPending = app.status === 'under_officer_review' || app.status === 'initial_verification';

                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setActiveReviewAppId(app.id)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {app.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{app.citizenName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{app.personalDetails.maskedIdentityId}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{app.serviceName}</div>
                        <div className="text-[11px] text-slate-400">{app.department}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          app.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {app.priority}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                          isNeedsCorrection
                            ? 'bg-amber-100 text-amber-900'
                            : isApproved
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-indigo-50 text-indigo-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isNeedsCorrection ? 'bg-amber-600' : isApproved ? 'bg-emerald-600' : 'bg-indigo-600'
                          }`} />
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReviewAppId(app.id);
                          }}
                          className="px-3 py-1.5 rounded bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <span>Review</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
