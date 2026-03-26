import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import RequestCard from '../components/ui/RequestCard';
import Badge from '../components/ui/Badge';
import { Check, X, Edit3, Shield, Inbox, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/requests/admin');
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load system requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(true);
    try {
      await api.put(`/requests/${action}/${id}`, { remarks });
      toast.success(`Request successfully ${action}ed`);
      setRemarks('');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error executing action');
    } finally {
      setActionLoading(false);
    }
  };

  const openReviewModal = (req) => {
    setSelectedRequest(req);
    setRemarks(req.remarks || '');
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'pending') return req.status === 'Pending' || req.status === 'Modification Required';
    if (filter === 'processed') return req.status === 'Approved' || req.status === 'Rejected';
    return true; // 'all'
  });

  return (
    <DashboardLayout title={filter === 'pending' ? 'Pending Approvals' : filter === 'processed' ? 'Processed Requests' : 'All Requests'}>
      
      {/* Search / Filter header could go here */}

      <div className="space-y-6 pb-12">
        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="animate-pulse bg-white p-5 rounded-2xl h-40 border border-slate-100 shadow-sm"></div>
             ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <Inbox className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No requests found</h3>
            <p className="mt-1 text-slate-500">There are no {filter !== 'all' ? filter : ''} document requests requiring your attention.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredRequests.map((req) => (
              <RequestCard 
                key={req._id} 
                req={req} 
                isAdmin={true} 
                onClick={() => openReviewModal(req)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Modern Review Modal Overlay */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => !actionLoading && setSelectedRequest(null)}
            ></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="relative z-10 inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-slate-100">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg leading-6 font-bold text-slate-900" id="modal-title">
                      Review Document Request
                    </h3>
                    <p className="text-sm text-slate-500 font-mono mt-0.5">{selectedRequest.requestId}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 space-y-6">
                
                {/* Information Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Student</p>
                    <p className="text-sm text-slate-900 font-medium">{selectedRequest.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Status</p>
                    <Badge status={selectedRequest.status}>{selectedRequest.status}</Badge>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Document Type</p>
                    <p className="text-sm text-slate-900 font-medium">{selectedRequest.documentType}</p>
                  </div>
                </div>

                {/* Document Access Area */}
                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Attached File</p>
                      <p className="text-xs text-slate-500">Secure storage link</p>
                    </div>
                  </div>
                  <a 
                    href={`http://localhost:5000/${selectedRequest.filePath}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-blue-600 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    Open Document
                  </a>
                </div>
                
                {/* Remarks Textarea */}
                <div>
                  <label htmlFor="remarks" className="block text-sm font-semibold text-slate-700 mb-2">
                    Admin Remarks <span className="text-slate-400 font-normal">(Visible to student)</span>
                  </label>
                  <textarea
                    id="remarks"
                    rows="4"
                    className="w-full border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 outline-none transition-all placeholder:text-slate-400 bg-slate-50 border"
                    placeholder="Enter approval details, rejection reasons, or required modifications..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 flex-wrap sm:flex-nowrap">
                <button
                  type="button"
                  className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setSelectedRequest(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <div className="flex-1"></div>
                <button
                  type="button"
                  disabled={actionLoading}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm rounded-lg text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none transition-colors"
                  onClick={() => handleAction(selectedRequest._id, 'reject')}
                >
                  <X className="h-4 w-4" /> Reject
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm rounded-lg text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none transition-colors"
                  onClick={() => handleAction(selectedRequest._id, 'modify')}
                >
                  <Edit3 className="h-4 w-4" /> Modify
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent shadow-sm rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-colors"
                  onClick={() => handleAction(selectedRequest._id, 'approve')}
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
