import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, Shield } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await register(name, email, password, role);
      toast.success('Registration successful. Welcome!');
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join the platform to verify and approve documents"
    >
      <form className="space-y-5" onSubmit={submitHandler}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="pl-10 appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm bg-slate-50 transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="pl-10 appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm bg-slate-50 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="pl-10 appearance-none relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm bg-slate-50 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Account Type</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-slate-400" />
              </div>
              <select
                id="role"
                name="role"
                className="pl-10 block w-full px-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm bg-slate-50 text-slate-900 transition-all appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="admin">Admin / Authority</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md shadow-blue-500/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                Register Account
                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
