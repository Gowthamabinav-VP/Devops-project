import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import RequestCard from '../components/ui/RequestCard';
import { FileUp, FileText, UploadCloud, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';

  const [requests, setRequests] = useState([]);
  const [documentType, setDocumentType] = useState('Bonafide Certificate');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setFetchLoading(true);
      const { data } = await api.get('/requests/user');
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load your requests');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    try {
      await api.post('/requests/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Request submitted successfully!');
      setFile(null);
      // Reset file input by re-setting the tab state or manual DOM reset
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      
      // Auto switch to history
      setSearchParams({ tab: 'history' });
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    const pending = requests.filter(r => r.status === 'Pending').length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 font-medium text-sm mb-1">Total Requests</h3>
            <p className="text-3xl font-bold text-slate-800">{requests.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 font-medium text-sm mb-1">Pending Approval</h3>
            <p className="text-3xl font-bold text-amber-600">{pending}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 font-medium text-sm mb-1">Approved Documents</h3>
            <p className="text-3xl font-bold text-emerald-600">{approved}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {fetchLoading ? (
              <p className="text-slate-500 animate-pulse text-sm">Loading activity...</p>
            ) : requests.length === 0 ? (
              <p className="text-slate-500 text-sm">No activity found.</p>
            ) : (
              requests.slice(0, 3).map(req => (
                 <RequestCard key={req._id} req={req} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSubmitForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileUp className="h-5 w-5 text-blue-600" />
            Submit New Request
          </h2>
          <p className="text-sm text-slate-500 mt-1">Upload your documents for official verification.</p>
        </div>

        <form onSubmit={submitHandler} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 outline-none transition-all cursor-pointer"
            >
              <option value="Bonafide Certificate">Bonafide Certificate</option>
              <option value="Project Proposal">Final Year Project Proposal</option>
              <option value="Leave Request">Leave Permission Request</option>
              <option value="Other">Other Document</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-10 pb-12 border-2 border-slate-300 border-dashed rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative group">
              <div className="space-y-2 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none px-2"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Selected: {file.name}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto mt-4 px-6 flex justify-center py-3 rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Submitting...' : 'Submit Request Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-lg font-bold text-slate-900">Document History</h2>
           <p className="text-sm text-slate-500">Track the status of your submitted documents.</p>
        </div>
      </div>
      
      {fetchLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => (
             <div key={i} className="animate-pulse bg-white p-5 rounded-2xl h-40 border border-slate-100"></div>
           ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-2 text-sm font-medium text-slate-900">No requests found</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by creating a new document request.</p>
          <div className="mt-6">
            <button
              onClick={() => setSearchParams({ tab: 'submit' })}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FileUp className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              New Request
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {requests.map((req) => (
            <RequestCard key={req._id} req={req} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout title={currentTab === 'dashboard' ? 'Overview' : currentTab === 'submit' ? 'Submit Request' : 'My Requests'}>
      <div className="pb-12">
        {currentTab === 'dashboard' && renderOverview()}
        {currentTab === 'submit' && renderSubmitForm()}
        {currentTab === 'history' && renderHistory()}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
