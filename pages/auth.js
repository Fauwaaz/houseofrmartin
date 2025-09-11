import { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { InputField } from '../components/InputField';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
        setSuccess('');
    }, [isLogin]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 6;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';

        if (!isLogin) {
            if (!formData.name) newErrors.name = 'Name is required';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
            else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        setErrors({});
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            if (isLogin) {
                setSuccess('Login successful! Redirecting...');
                console.log('Login data:', { email: formData.email, password: formData.password });
            } else {
                setSuccess('Account created successfully! Please check your email.');
                console.log('Signup data:', formData);
            }
        } catch {
            setErrors({ submit: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
                        <User className="text-white" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-black mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-gray-600">
                        {isLogin ? 'Sign in to your account' : 'Join us today'}
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 border border-black rounded-lg flex items-center bg-gray-50">
                        <CheckCircle className="text-black mr-2" size={18} />
                        <span className="text-black">{success}</span>
                    </div>
                )}

                {/* Main Form */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-300 p-8">
                    <div className="space-y-6">
                        {!isLogin && (
                            <InputField type="text" name="name" placeholder="Full Name" icon={User} />
                        )}
                        <InputField type="email" name="email" placeholder="Email Address" icon={Mail} />
                        <InputField
                            type="password"
                            name="password"
                            placeholder="Password"
                            icon={Lock}
                            showPasswordToggle={true}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                        />
                        {!isLogin && (
                            <InputField
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                icon={Lock}
                                showPasswordToggle={true}
                                showPassword={showConfirmPassword}
                                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        )}

                        {errors.submit && (
                            <div className="flex items-center text-black text-sm">
                                <XCircle size={14} className="mr-1" />
                                {errors.submit}
                            </div>
                        )}

                        {isLogin && (
                            <div className="text-right">
                                <button type="button" className="text-sm text-black hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-1/2 bg-black text-white py-3 px-4 rounded-full font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} className="ml-2" />
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Toggle */}
                    <div className="mt-8 text-center">
                        <span className="text-gray-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-black font-medium hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>

                    {/* Social */}
                    {/* <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-400"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-400 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-400 rounded-full shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Facebook
              </button>
            </div>
          </div> */}
                </div>

                <p className="text-center text-sm text-gray-500 mt-8">
                    By {isLogin ? 'signing in' : 'creating an account'}, you agree to our{' '}
                    <a href="#" className="text-black hover:underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-black hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
