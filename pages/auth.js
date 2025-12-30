"use client";
import { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowRight, XCircle, Phone, Loader2 } from 'lucide-react';
import { InputField } from '../components/InputField';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("+971");


  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const COUNTRY_CODES = [
    { code: "+971", country: "🇦🇪" },
    { code: "+91", country: "🇮🇳" },
    { code: "+966", country: "🇸🇦" },
    { code: "+973", country: "🇧🇭" },
    { code: "+974", country: "🇶🇦" },
    { code: "+965", country: "🇰🇼" },
    { code: "+968", country: "🇴🇲" },
    { code: "+44", country: "🇬🇧" },
    { code: "+1", country: "🇺🇸" },
    { code: "+61", country: "🇦🇺" },
  ];


  useEffect(() => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
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
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';

    if (!isLogin) {
      if (!formData.first_name) newErrors.first_name = 'First name required';
      if (!formData.last_name) newErrors.last_name = 'Last name required';
      if (!formData.phone) newErrors.phone = 'Phone number required';
      else if (!/^\d{7,12}$/.test(formData.phone)) newErrors.phone = "Enter valid phone number";
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password required';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: `${countryCode}${formData.phone}`,
          isLogin
        }),
      });

      const data = await res.json();
      console.log("Auth API Response:", data);

      if (!res.ok || !data.success) {
        setErrors({ submit: data.message || 'Invalid credentials' });
        return;
      }

      toast.success(data.message || 'Login successful');

      if (isLogin) {
        const lastPage = localStorage.getItem("lastVisited") || "/";

        const me = await fetch("/api/me", { credentials: "include" })
          .then(res => res.json());

        if (me?.user?.id) {
          const u = {
            id: me.user.id,
            email: me.user.email,
            phone: me.user.meta?.billing_phone || null,
            name: me.user.name,
          };

          localStorage.setItem("user", JSON.stringify(u));
          window.dispatchEvent(new Event("user-ready"));
        }

        router.push(lastPage);
      }


    } catch (err) {
      console.error("Auth error:", err);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Sign In' : 'Sign Up'} - House Of R-Martin</title>
        <meta name="description" content="Authentication page for House Of R-Martin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-300 p-8">
          <Link href="/" className="text-black hover:underline flex gap-1 items-center">
            <HiOutlineChevronLeft size={20} /> Back
          </Link>

          <div className="text-center my-8">
            <Image src="https://dashboard.houseofrmartin.com/wp-content/uploads/2025/10/logo.webp" alt="Logo" width={250} height={40} className='object-contain mx-auto' />
            <h1 className="text-3xl font-bold text-black mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600">{isLogin ? 'Sign in to your account' : 'Join us today'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {!isLogin && (
                <>
                  <InputField name="first_name" placeholder="First Name" icon={User} value={formData.first_name} onChange={handleInputChange} error={errors.first_name} />
                  <InputField name="last_name" placeholder="Last Name" icon={User} value={formData.last_name} onChange={handleInputChange} error={errors.last_name} />
                  <div>
                    <div className="flex items-center gap-2 mt-1">

                      {/* Country code dropdown */}
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value);
                        }}
                        className="border border-gray-400 p-2 rounded-md bg-white text-gray-600"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.code} ({c.country})
                          </option>
                        ))}
                      </select>

                      {/* Actual phone input */}
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`border border-gray-400 p-2 rounded-md flex-1 min-w-[140px] ${errors.phone ? "border-red-500" : ""}`}
                      />
                    </div>

                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </>
              )}

              <InputField type="email" name="email" placeholder="Email Address" icon={Mail} value={formData.email} onChange={handleInputChange} error={errors.email} />
              {/* Password Field */}
              <InputField
                type="password"
                name="password"
                placeholder="Password"
                icon={Lock}
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Confirm Password Field (Signup only) */}
              {!isLogin && (
                <InputField
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  showPasswordToggle={true}
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}

              {errors.submit && (
                <div className="flex items-center text-red-600 text-sm">
                  <XCircle size={14} className="mr-1" /> {errors.submit}
                </div>
              )}

              {isLogin && (
                <div className="text-left">
                  <Link href='/forgot-password' className="text-sm text-black hover:underline">Forgot Password?</Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 focus:ring-2 focus:ring-black transition flex items-center justify-center"
              >
                {loading ? (
                  <><Loader2 className="animate-spin mr-2" size={20} />{isLogin ? 'Signing In...' : 'Creating Account...'}</>
                ) : (
                  <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} className="ml-2" /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 text-black font-medium hover:underline">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-8 px-4 pb-4">
          By {isLogin ? 'signing in' : 'creating an account'}, you agree to our{' '}
          <Link href="/terms-condition" className="text-black hover:underline">&nbsp;Terms of Service&nbsp;</Link> and{' '} <Link href="/privacy-policy" className="text-black hover:underline">&nbsp;Privacy Policy</Link> </p>
      </div>
    </>
  );
};

export default AuthPage;