import Badge from './Badge';
import { Clock, CheckCircle, XCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react';

const RequestCard = ({ req, onClick, isAdmin = false }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Approved': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      case 'Modification Required': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className={`bg-white rounded-2xl p-5 border shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-200' : 'border-slate-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-mono font-medium mb-2">
            {req.requestId}
          </span>
          <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            {req.documentType}
          </h3>
          {isAdmin && req.user && (
            <p className="text-sm text-slate-500 mt-1">
              From: <span className="font-medium text-slate-700">{req.user.name}</span>
            </p>
          )}
        </div>
        <Badge status={req.status}>
          <span className="flex items-center gap-1.5">
            {getStatusIcon(req.status)}
            {req.status}
          </span>
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 font-medium">
          Submitted: {new Date(req.submissionDate).toLocaleDateString()}
        </div>
        
        {onClick && (
          <button className="text-sm text-blue-600 font-medium flex items-center gap-1 group">
            {isAdmin ? 'Review Request' : 'View Details'}
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {req.remarks && !onClick && (
         <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
           <p className="text-xs text-slate-500 font-semibold mb-1 uppercase tracking-wider">Remarks</p>
           <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">{req.remarks}</p>
         </div>
      )}
    </div>
  );
};

export default RequestCard;
