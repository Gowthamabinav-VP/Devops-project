import { motion } from 'framer-motion';
import { FileText, ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-stretch h-full lg:min-h-[600px] z-10">
        
        {/* Left Side: Illustration / Branding Panel (Hidden on smaller screens) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex w-1/2 bg-blue-600 rounded-l-3xl p-12 flex-col justify-between text-white relative overflow-hidden shadow-2xl z-10"
        >
          {/* Internal decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />

          <div>
            <div className="flex items-center gap-3 mb-12 relative z-10">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight">DocVerify</span>
            </div>
            
            <div className="space-y-6 relative z-10">
              <h1 className="text-4xl font-extrabold leading-tight">
                Secure Document <br />
                <span className="text-blue-200">Verification & Approval</span>
              </h1>
              <p className="text-blue-100 text-lg max-w-md leading-relaxed">
                Streamline your college workflows. Submit, track, and approve official document requests in a modern, secure platform.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/10">
            <ShieldCheck className="h-10 w-10 text-blue-200 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white">Institutional Grade Security</p>
              <p className="text-sm text-blue-200">End-to-end encrypted approval chains.</p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Shared Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 w-full flex flex-col justify-center bg-white lg:rounded-r-3xl rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-slate-100 z-20"
        >
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="text-center lg:text-left">
              {/* Mobile branded header */}
              <div className="lg:hidden flex justify-center mb-6">
                 <div className="bg-blue-50 p-3 rounded-2xl">
                    <FileText className="h-8 w-8 text-blue-600" />
                 </div>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                {subtitle}
              </p>
            </div>
            
            {/* The main form mounts here */}
            {children}
            
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AuthLayout;
