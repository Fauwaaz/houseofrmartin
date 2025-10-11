"use client";

import { useState } from 'react';
import { Layout } from '../components';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [focusedField, setFocusedField] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFocus = (fieldName) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to send message';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (jsonError) {
                    errorMessage = response.statusText || `HTTP ${response.status}`;
                }
                throw new Error(errorMessage);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned non-JSON response');
            }

            const result = await response.json();

            if (result.success) {
                setSubmitStatus('success');
                setErrorMessage('');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                throw new Error(result.error || 'Unknown error occurred');
            }

        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage(error.message);
            console.error('Submission error:', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFieldActive = (fieldName) => {
        return focusedField === fieldName || formData[fieldName];
    };

    return (
        <Layout>
            <div className="mt-[80px] lg:mt-[50px] py-6 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="roboto-condensed text-4xl md:text-6xl lg:text-6xl text-[#242222] pt-10">Get In Touch</h1>
                        <p className="text-gray-600 text-lg animate-fade-in-delay">
                            We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you as soon as possible.
                        </p>
                    </div>

                    {submitStatus === 'success' && (
                        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 animate-fade-in">
                            <p className="font-medium">Message sent successfully!</p>
                            <p className="text-sm mt-1">We&apos;ve sent you a confirmation email and will get back to you as soon as possible.</p>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 animate-fade-in">
                            <p className="font-medium">Failed to send message</p>
                            <p className="text-sm mt-1">{errorMessage || 'Please try again or contact us directly at info@dboundmedia.com'}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name Field */}
                        <div className="relative group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onFocus={() => handleFocus('name')}
                                onBlur={handleBlur}
                                className="w-full px-0 py-4 text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black transition-all duration-300 peer"
                                placeholder=" "
                                required
                                disabled={isSubmitting}
                                autoComplete='off'
                            />
                            <label
                                className={`absolute left-0 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none ${isFieldActive('name')
                                    ? '-translate-y-2 scale-90 text-black font-medium'
                                    : 'translate-y-0 scale-100 top-4'
                                    }`}
                            >
                                Full Name *
                            </label>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-focus-within:w-full"></div>
                        </div>

                        {/* Email Field */}
                        <div className="relative group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => handleFocus('email')}
                                onBlur={handleBlur}
                                className="w-full px-0 py-4 text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black transition-all duration-300 peer"
                                placeholder=" "
                                required
                                disabled={isSubmitting}
                                autoComplete='off'
                            />
                            <label
                                className={`absolute left-0 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none ${isFieldActive('email')
                                    ? '-translate-y-2 scale-90 text-black font-medium'
                                    : 'translate-y-0 scale-100 top-4'
                                    }`}
                            >
                                Email Address *
                            </label>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-focus-within:w-full"></div>
                        </div>

                        {/* Phone Field */}
                        <div className="relative group">
                            <input
                                type="number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onFocus={() => handleFocus('phone')}
                                onBlur={handleBlur}
                                className="w-full px-0 py-4 text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black transition-all duration-300 peer"
                                placeholder=" "
                                disabled={isSubmitting}
                                minLength={10}
                                maxLength={10}
                                autoComplete='off'
                            />
                            <label
                                className={`absolute left-0 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none ${isFieldActive('phone')
                                    ? '-translate-y-2 scale-90 text-black font-medium'
                                    : 'translate-y-0 scale-100 top-4'
                                    }`}
                            >
                                Phone Number
                            </label>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-focus-within:w-full"></div>
                        </div>

                        {/* Message Field */}
                        <div className="relative group">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                onFocus={() => handleFocus('message')}
                                onBlur={handleBlur}
                                rows="1"
                                className="w-full px-0 py-4 text-lg text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black transition-all duration-300 peer resize-none"
                                placeholder=" "
                                required
                                disabled={isSubmitting}
                                autoComplete='off'
                            />
                            <label
                                className={`absolute left-0 text-gray-500 transition-all duration-300 transform origin-left pointer-events-none ${isFieldActive('message')
                                    ? '-translate-y-2 scale-90 text-black font-medium'
                                    : 'translate-y-0 scale-100 top-4'
                                    }`}
                            >
                                What do you have in mind? *
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 flex justify-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`group relative w-full sm:w-auto px-12 py-4 rounded-full text-white font-medium text-lg overflow-hidden transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-black hover:shadow-2xl focus:ring-black'
                                    }`}
                            >
                                <span className={`relative z-10 transition-transform duration-300 uppercase ${!isSubmitting ? 'group-hover:scale-110' : ''
                                    }`}>
                                    {isSubmitting ? (
                                        <>
                                            <svg className="inline w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </span>
                                {!isSubmitting && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }
      `}</style>
            </div>
        </Layout>
    )
}

export default Contact