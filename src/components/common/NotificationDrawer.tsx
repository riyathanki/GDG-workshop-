import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, AlertTriangle, CheckCircle, Info, ExternalLink } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { 
    notifications, 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    markNotificationRead, 
    markAllNotificationsRead,
    setCurrentView,
    setActiveTrackingAppId,
    setActiveReviewAppId,
    currentUser
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  // Filter relevant notifications for current user or all if officer/admin
  const relevantNotifications = notifications.filter(n => {
    if (currentUser.role === 'citizen') {
      return n.userId === currentUser.id || n.targetRole === 'citizen';
    }
    return n.targetRole === currentUser.role || n.userId === currentUser.id;
  });

  const handleNotificationClick = (item: any) => {
    markNotificationRead(item.id);
    if (item.applicationId) {
      if (currentUser.role === 'officer') {
        setActiveReviewAppId(item.applicationId);
        setCurrentView('officer_portal');
      } else {
        setActiveTrackingAppId(item.applicationId);
        setCurrentView('citizen_tracking');
      }
      setIsNotificationDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-semibold text-slate-900">Notification Center</h2>
              <span className="text-xs font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">
                {relevantNotifications.filter(n => !n.read).length} Unread
              </span>
            </div>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Real-time alerts for {currentUser.name}</span>
            <button
              onClick={markAllNotificationsRead}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {relevantNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">Updates on your documents and review status will appear here.</p>
              </div>
            ) : (
              relevantNotifications.map((notif) => {
                const isWarning = notif.type === 'warning' || notif.type === 'alert';
                const isSuccess = notif.type === 'success';

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                      !notif.read 
                        ? 'bg-indigo-50/50 border-indigo-200 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {isWarning ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        ) : isSuccess ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Info className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className={`text-xs font-semibold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            {notif.timestamp.split(',')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>

                        {notif.applicationId && (
                          <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-indigo-600">
                            <span>Open {notif.applicationId}</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
