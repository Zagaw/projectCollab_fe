import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    studentId: '',
    phone: '',
    role: 'STUDENT',
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message =
          error.response?.data?.message ||
          error.message ||
          'Registration failed. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen overflow-hidden bg-[#1B3A68]">
        <div className="min-h-screen grid lg:grid-cols-[52%_48%]">

          {/* ================= LEFT SIDE - REGISTER ================= */}
          <section className="relative min-h-screen bg-white px-6 py-10 sm:px-10 lg:px-16 xl:px-20 overflow-y-auto">

            {/* Ambient glow */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#285487]/15 blur-3xl pointer-events-none" />

            <div className="absolute top-[15%] -right-40 w-[420px] h-[420px] rounded-full bg-[#ECB44D]/15 blur-3xl pointer-events-none" />

            <div className="absolute bottom-[-180px] left-[10%] w-[500px] h-[500px] rounded-full bg-[#244A7A]/15 blur-3xl pointer-events-none" />

            {/* Decorative stars */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">

            <span className="absolute top-[7%] left-[7%] text-[#244A7A] text-lg animate-pulse">
              ✦
            </span>

              <span className="absolute top-[18%] left-[12%] text-[#ECB44D] text-sm">
              ✧
            </span>

              <span className="absolute top-[35%] left-[5%] text-[#285487] text-xl animate-pulse">
              ✦
            </span>

              <span className="absolute top-[55%] left-[8%] text-[#1B3A68] text-sm">
              ✧
            </span>

              <span className="absolute top-[78%] left-[5%] text-[#244A7A] text-lg">
              ✦
            </span>

              <span className="absolute top-[12%] right-[8%] text-[#ECB44D] text-sm animate-pulse">
              ✦
            </span>

              <span className="absolute top-[40%] right-[5%] text-[#285487] text-lg">
              ✧
            </span>

              <span className="absolute bottom-[15%] right-[8%] text-[#1B3A68] text-xl animate-pulse">
              ✦
            </span>

            </div>

            <div className="relative z-10 w-full max-w-xl mx-auto">

              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">

                <div className="w-14 h-14 rounded-2xl bg-[#1B3A68] flex items-center justify-center shadow-xl shadow-[#1B3A68]/30">

                  <svg
                      className="w-8 h-8 text-[#F2E199]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    />
                  </svg>

                </div>

                <span className="text-2xl font-bold text-[#1B3A68]">
                Collabra
              </span>

              </div>

              {/* Heading */}
              <div className="mb-7">

                <p className="text-[#C08B22] text-xs font-bold uppercase tracking-[0.3em] mb-3">
                  Join Collabra
                </p>

                <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[#1B3A68]">
                  Create Account
                </h1>

                <p className="mt-4 text-[#52708F] text-sm sm:text-base">
                  Join Collabora and start collaborating with your team
                </p>

              </div>

              {/* ================= REGISTER FORM ================= */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* First & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label
                        htmlFor="firstName"
                        className="block text-sm font-semibold text-[#1B3A68] mb-2"
                    >
                      First Name *
                    </label>

                    <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_20px_rgba(236,180,77,0.35)]"
                        placeholder="John"
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="lastName"
                        className="block text-sm font-semibold text-[#1B3A68] mb-2"
                    >
                      Last Name *
                    </label>

                    <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_20px_rgba(236,180,77,0.35)]"
                        placeholder="Doe"
                    />
                  </div>

                </div>

                {/* Username */}
                <div>

                  <label
                      htmlFor="username"
                      className="block text-sm font-semibold text-[#1B3A68] mb-2"
                  >
                    Username *
                  </label>

                  <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_20px_rgba(236,180,77,0.35)]"
                      placeholder="johndoe"
                  />

                </div>

                {/* Email */}
                <div>

                  <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-[#1B3A68] mb-2"
                  >
                    Email Address *
                  </label>

                  <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_20px_rgba(236,180,77,0.35)]"
                      placeholder="you@example.com"
                  />

                </div>

                {/* Password */}
                <div>

                  <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-[#1B3A68] mb-2"
                  >
                    Password * (min. 8 characters)
                  </label>

                  <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_20px_rgba(236,180,77,0.35)]"
                      placeholder="Create a strong password"
                  />

                </div>

                {/* Student ID & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label
                        htmlFor="studentId"
                        className="block text-sm font-semibold text-[#1B3A68] mb-2"
                    >
                      Student ID
                    </label>

                    <input
                        id="studentId"
                        name="studentId"
                        type="text"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_20px_rgba(236,180,77,0.35)]"
                        placeholder="STU12345"
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-[#1B3A68] mb-2"
                    >
                      Phone Number
                    </label>

                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_20px_rgba(236,180,77,0.35)]"
                        placeholder="+1234567890"
                    />
                  </div>

                </div>

                {/* ================= ROLE SELECTION ================= */}
                <div>

                  <label className="block text-sm font-semibold text-[#1B3A68] mb-3">
                    Register as *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* Student */}
                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                              ...formData,
                              role: 'STUDENT',
                            })
                        }
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 font-semibold ${
                            formData.role === 'STUDENT'
                                ? 'border-[#ECB44D] bg-[#1B3A68] text-white shadow-[0_5px_20px_rgba(27,58,104,0.25)]'
                                : 'border-[#ECB44D] bg-[#F8FBFD] text-[#1B3A68] hover:bg-white hover:shadow-[0_0_15px_rgba(236,180,77,0.20)]'
                        }`}
                    >

                      <svg
                          className={`w-5 h-5 ${
                              formData.role === 'STUDENT'
                                  ? 'text-[#F2E199]'
                                  : 'text-[#1B3A68]'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>

                      Student

                    </button>

                    {/* Lecturer */}
                    <button
                        type="button"
                        onClick={() =>
                            setFormData({
                              ...formData,
                              role: 'LECTURER',
                            })
                        }
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 font-semibold ${
                            formData.role === 'LECTURER'
                                ? 'border-[#ECB44D] bg-[#1B3A68] text-white shadow-[0_5px_20px_rgba(27,58,104,0.25)]'
                                : 'border-[#ECB44D] bg-[#F8FBFD] text-[#1B3A68] hover:bg-white hover:shadow-[0_0_15px_rgba(236,180,77,0.20)]'
                        }`}
                    >

                      <svg
                          className={`w-5 h-5 ${
                              formData.role === 'LECTURER'
                                  ? 'text-[#F2E199]'
                                  : 'text-[#1B3A68]'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>

                      Lecturer

                    </button>

                  </div>

                  <p className="mt-2 text-xs text-[#8AA0B7]">
                    Lecturers need to be verified by the system administrator.
                  </p>

                </div>

                {/* ================= CREATE ACCOUNT BUTTON ================= */}
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-[#1B3A68] text-white py-4 font-bold shadow-[0_8px_25px_rgba(27,58,104,0.35)] transition-all duration-500 hover:bg-[#244A7A] hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(36,74,122,0.75),0_10px_35px_rgba(27,58,104,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {/* Golden light sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F2E199]/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {/* Golden glow */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-20 bg-[#F2E199]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <span className="relative z-10 flex items-center justify-center gap-3">

                  {loading ? (
                      <>
                        <svg
                            className="animate-spin w-5 h-5 text-[#F2E199]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                          <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                          />

                          <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>

                        Creating account...
                      </>
                  ) : (
                      <>
                        <span>Create Account</span>

                        <span className="text-[#F2E199] text-xl group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                      </>
                  )}

                </span>

                </button>

                {/* Sign In */}
                <p className="text-center text-sm text-[#52708F] pt-1">

                  Already have an account?{' '}

                  <Link
                      to="/login"
                      className="font-bold text-[#1B3A68] hover:text-[#C08B22] transition-colors duration-300"
                  >
                    Sign in
                  </Link>

                </p>

                <p className="text-center text-xs text-[#8AA0B7]">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>

              </form>

              <div className="mt-8 pb-3 flex items-center justify-center gap-3 text-xs text-[#8AA0B7]">

              <span className="text-[#ECB44D]">
                ✦
              </span>

                <span>
                © 2026 Collabra. All rights reserved.
              </span>

                <span className="text-[#244A7A]">
                ✦
              </span>

              </div>

            </div>

          </section>

          {/* ================= RIGHT SIDE - STARRY THEME ================= */}
          <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#315F91] via-[#285487] to-[#1B3A68] text-white flex">

            {/* Ambient glows */}
            <div className="absolute top-[-180px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#3A6D9E]/25 blur-3xl" />

            <div className="absolute bottom-[-180px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#ECB44D]/12 blur-3xl" />

            <div className="absolute top-[35%] left-[35%] w-[300px] h-[300px] rounded-full bg-[#244A7A]/25 blur-3xl" />

            {/* Stars */}
            <div className="absolute top-[8%] left-[8%] text-[#F2E199] text-xl animate-pulse">
              ✦
            </div>

            <div className="absolute top-[18%] right-[12%] text-[#3A6D9E] text-sm">
              ✧
            </div>

            <div className="absolute top-[32%] left-[45%] text-[#F2E199] text-xs">
              ✦
            </div>

            <div className="absolute top-[25%] left-[18%] text-[#285487] text-xs">
              ✦
            </div>

            <div className="absolute top-[45%] right-[5%] text-[#F2E199] text-sm animate-pulse">
              ✦
            </div>

            <div className="absolute bottom-[28%] left-[12%] text-[#285487] text-lg">
              ✦
            </div>

            <div className="absolute bottom-[18%] right-[20%] text-[#F2E199] text-xl animate-pulse">
              ✦
            </div>

            <div className="absolute bottom-[8%] left-[42%] text-[#3A6D9E] text-sm">
              ✧
            </div>

            <div className="absolute top-[68%] right-[8%] text-[#3A6D9E] text-sm">
              ✧
            </div>

            {/* Moon */}
            <div className="absolute top-[9%] right-[12%] w-32 h-32">

              <div className="absolute w-32 h-32 rounded-full bg-[#F2E199] shadow-[0_0_60px_rgba(242,225,153,0.30)]" />

              <div className="absolute top-3 left-5 w-32 h-32 rounded-full bg-[#315F91]" />

            </div>

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-10 lg:px-16 xl:px-20 w-full">

              <div className="flex items-center gap-4 mb-32 mt-14">

                <div className="w-14 h-14 rounded-2xl bg-[#1B3A68]/70 backdrop-blur-md border border-[#3A6D9E]/40 flex items-center justify-center shadow-lg shadow-[#1B3A68]/30">

                  <svg
                      className="w-8 h-8 text-[#F2E199]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    />
                  </svg>

                </div>

                <span className="text-3xl font-bold">
                Collabora
              </span>

              </div>

              <div className="max-w-xl">

                <h2 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-medium leading-[1.08]">
                  Project Collaboration Made Simple
                </h2>

                <p className="mt-7 text-lg leading-8 text-white/85 max-w-lg">
                  Connect, collaborate, and create amazing projects together with your team members.
                </p>

                <div className="mt-12 space-y-7">

                  {/* Team Collaboration */}
                  <div className="flex gap-4">

                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#1B3A68]/60 border border-[#3A6D9E]/40 backdrop-blur-md flex items-center justify-center text-[#F2E199]">

                      <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>

                    </div>

                    <div>
                      <h3 className="font-bold text-base">
                        Team Collaboration
                      </h3>

                      <p className="text-sm text-white/75 mt-1">
                        Work together seamlessly with your team members
                      </p>
                    </div>

                  </div>

                  {/* Secure & Private */}
                  <div className="flex gap-4">

                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#1B3A68]/60 border border-[#3A6D9E]/40 backdrop-blur-md flex items-center justify-center text-[#F2E199]">

                      <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0 4 4 0 00-8 0v2h8z"
                        />
                      </svg>

                    </div>

                    <div>
                      <h3 className="font-bold text-base">
                        Secure & Private
                      </h3>

                      <p className="text-sm text-white/75 mt-1">
                        Your data is protected with enterprise-grade security
                      </p>
                    </div>

                  </div>

                  {/* Track Progress */}
                  <div className="flex gap-4">

                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[#1B3A68]/60 border border-[#3A6D9E]/40 backdrop-blur-md flex items-center justify-center text-[#F2E199]">

                      <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                            d="M3 3v18h18M7 16l4-5 3 3 5-7"
                        />
                      </svg>

                    </div>

                    <div>
                      <h3 className="font-bold text-base">
                        Track Progress
                      </h3>

                      <p className="text-sm text-white/75 mt-1">
                        Monitor project milestones and team achievements
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Bottom curves */}
            <div className="absolute bottom-[-150px] left-[-10%] w-[125%] h-[260px] bg-[#244A7A] rounded-[50%] rotate-[-5deg]" />

            <div className="absolute bottom-[-210px] left-[-15%] w-[130%] h-[270px] bg-[#1B3A68] rounded-[50%] rotate-[5deg]" />

            <div className="absolute bottom-8 left-10 sm:left-14 lg:left-16 text-xs text-white/60">
              © 2026 Collabora. All rights reserved.
            </div>

          </section>

        </div>
      </div>
  );
};

export default Register;