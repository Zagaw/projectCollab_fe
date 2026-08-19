import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //
  //   try {
  //     await login(formData.email, formData.password);
  //     toast.success('Welcome back!');
  //     navigate('/dashboard');
  //   } catch (error) {
  //     const message =
  //         error.response?.data?.message ||
  //         'Login failed. Please try again.';
  //
  //     toast.error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Sample account
    const sampleEmail = 'sample@gmail.com';
    const samplePassword = '123456';

    // Small delay to make it feel like a real login
    setTimeout(() => {
      if (
          formData.email === sampleEmail &&
          formData.password === samplePassword
      ) {
        toast.success('Welcome back!');

        // Save fake login status
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', formData.email);

        navigate('/student-dashboard');
      } else {
        toast.error('Invalid email or password.');
      }

      setLoading(false);
    }, 800);
  };

  return (
      <div className="min-h-screen overflow-hidden bg-[#1B3A68]">

        <div className="min-h-screen grid lg:grid-cols-[52%_48%]">

          {/* =========================================================
            LEFT SIDE - SIGN IN
        ========================================================== */}

          <section className="relative min-h-screen bg-white flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24 overflow-hidden">

            {/* =====================================================
              DEEP BLUE / GOLD AMBIENT GLOW
          ====================================================== */}

            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#285487]/15 blur-3xl pointer-events-none" />

            <div className="absolute top-[15%] -right-40 w-[420px] h-[420px] rounded-full bg-[#ECB44D]/20 blur-3xl pointer-events-none" />

            <div className="absolute bottom-[-180px] left-[10%] w-[500px] h-[500px] rounded-full bg-[#244A7A]/15 blur-3xl pointer-events-none" />

            <div className="absolute bottom-[5%] -right-32 w-[350px] h-[350px] rounded-full bg-[#ECB44D]/10 blur-3xl pointer-events-none" />

            {/* =====================================================
              STARS
          ====================================================== */}

            <div className="absolute inset-0 pointer-events-none overflow-hidden">

              {/* Deep Blue Stars */}

              <span className="absolute top-[8%] left-[7%] text-[#244A7A] text-xl animate-pulse">
              ✦
            </span>

              <span className="absolute top-[15%] left-[23%] text-[#285487] text-lg">
              ✧
            </span>

              <span className="absolute top-[28%] left-[8%] text-[#1B3A68] text-sm">
              ✦
            </span>

              <span className="absolute top-[40%] left-[17%] text-[#285487] text-lg animate-pulse">
              ✦
            </span>

              <span className="absolute top-[55%] left-[6%] text-[#244A7A] text-xl">
              ✧
            </span>

              <span className="absolute top-[69%] left-[20%] text-[#285487] text-sm">
              ✦
            </span>

              <span className="absolute top-[83%] left-[8%] text-[#1B3A68] text-lg animate-pulse">
              ✦
            </span>

              <span className="absolute top-[91%] left-[31%] text-[#285487] text-sm">
              ✧
            </span>

              <span className="absolute top-[10%] right-[18%] text-[#285487] text-lg">
              ✧
            </span>

              <span className="absolute top-[25%] right-[7%] text-[#1B3A68] text-xl animate-pulse">
              ✦
            </span>

              <span className="absolute top-[38%] right-[22%] text-[#244A7A] text-sm">
              ✧
            </span>

              <span className="absolute top-[50%] right-[8%] text-[#285487] text-lg">
              ✦
            </span>

              <span className="absolute top-[64%] right-[18%] text-[#1B3A68] text-xl">
              ✧
            </span>

              <span className="absolute top-[77%] right-[6%] text-[#244A7A] text-sm animate-pulse">
              ✦
            </span>

              <span className="absolute top-[89%] right-[23%] text-[#285487] text-lg">
              ✧
            </span>

              {/* Tiny Blue Stars */}

              <span className="absolute top-[22%] left-[40%] text-[#244A7A] text-xs">
              ✦
            </span>

              <span className="absolute top-[48%] left-[34%] text-[#1B3A68] text-xs">
              ✧
            </span>

              <span className="absolute top-[62%] right-[35%] text-[#285487] text-xs">
              ✦
            </span>

              <span className="absolute top-[75%] left-[43%] text-[#244A7A] text-sm">
              ✧
            </span>

              {/* Gold Stars */}

              <span className="absolute top-[12%] right-[30%] text-[#ECB44D] text-sm animate-pulse">
              ✦
            </span>

              <span className="absolute top-[34%] left-[30%] text-[#F2E199] text-xs">
              ✧
            </span>

              <span className="absolute top-[58%] right-[30%] text-[#ECB44D] text-sm">
              ✦
            </span>

              <span className="absolute top-[82%] right-[40%] text-[#F2E199] text-xs animate-pulse">
              ✧
            </span>

            </div>

            {/* =====================================================
              LOGIN CONTENT
          ====================================================== */}

            <div className="relative z-10 w-full max-w-lg">

              {/* ===================================================
                LOGO
            ==================================================== */}

              <div className="flex items-center gap-3 mb-10">

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
                Collabora
              </span>

              </div>

              {/* ===================================================
                HEADING
            ==================================================== */}

              <div className="mb-9">

                <p className="text-[#C08B22] text-xs font-bold uppercase tracking-[0.3em] mb-4">
                  Welcome Back
                </p>

                <h1 className="text-5xl sm:text-6xl font-serif font-semibold text-[#1B3A68] leading-none">
                  Sign in
                </h1>

                <p className="mt-5 text-[#52708F] text-base">
                  Sign in to your account to continue collaborating
                </p>

              </div>

              {/* ===================================================
                FORM
            ==================================================== */}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* =================================================
                  EMAIL
              ================================================== */}

                <div>

                  <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-[#1B3A68] mb-3"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <svg
                        className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B3A68]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-14 pr-5 py-4 rounded-2xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_22px_rgba(236,180,77,0.40)]"
                    />

                  </div>

                </div>

                {/* =================================================
                  PASSWORD
              ================================================== */}

                <div>

                  <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-[#1B3A68] mb-3"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <svg
                        className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B3A68]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
                      />
                    </svg>

                    <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        className="w-full pl-14 pr-14 py-4 rounded-2xl bg-[#F8FBFD] border-2 border-[#ECB44D] text-[#1B3A68] placeholder-[#8AA0B7] outline-none transition-all duration-300 focus:bg-white focus:border-[#ECB44D] focus:ring-4 focus:ring-[#ECB44D]/20 focus:shadow-[0_0_22px_rgba(236,180,77,0.40)]"
                    />

                    {/* Show / Hide Password */}

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#285487] hover:text-[#1B3A68] transition-colors"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                    >

                      {showPassword ? (
                          <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M3 3l18 18M10.584 10.587a2 2 0 002.829 2.828M9.88 4.24A9.943 9.943 0 0112 4c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-1.293 2.73M6.228 6.228C4.51 7.44 3.22 9.06 2.458 11c1.274 4.057 5.064 7 9.542 7a9.943 9.943 0 004.121-.889"
                            />
                          </svg>
                      ) : (
                          <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="3"
                                strokeWidth="1.8"
                            />
                          </svg>
                      )}

                    </button>

                  </div>

                </div>

                {/* =================================================
                  REMEMBER ME / FORGOT PASSWORD
              ================================================== */}

                <div className="flex items-center justify-between pt-1">

                  <label
                      htmlFor="remember-me"
                      className="flex items-center gap-2.5 cursor-pointer"
                  >

                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#ECB44D] accent-[#1B3A68] cursor-pointer"
                    />

                    <span className="text-sm text-[#52708F]">
                    Remember me
                  </span>

                  </label>

                  <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-[#1B3A68] hover:text-[#C08B22] transition-colors duration-300"
                  >
                    Forgot password?
                  </Link>

                </div>

                {/* =================================================
                  SIGN IN BUTTON
              ================================================== */}

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-2xl bg-[#1B3A68] text-white py-4 font-bold shadow-[0_8px_25px_rgba(27,58,104,0.35)] transition-all duration-500 hover:bg-[#244A7A] hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(36,74,122,0.75),0_10px_35px_rgba(27,58,104,0.45)] disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {/* Golden Light Sweep */}

                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F2E199]/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  {/* Golden Glow */}

                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-20 bg-[#F2E199]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Blue Glow */}

                  <span className="absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />

                  <span className="relative z-10 flex items-center justify-center gap-3">

                  {loading ? (
                      <>
                        <svg
                            className="animate-spin w-5 h-5 text-[#F2E199]"
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
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>

                        Signing in...
                      </>
                  ) : (
                      <>
                      <span>
                        Sign In
                      </span>

                        <span className="text-[#F2E199] text-xl group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                      </>
                  )}

                </span>

                </button>

                {/* =================================================
                  DIVIDER
              ================================================== */}

                <div className="flex items-center gap-4 py-1">

                  <div className="flex-1 h-px bg-[#DCE6EF]" />

                  <span className="text-xs text-[#8AA0B7] tracking-widest">
                  OR
                </span>

                  <div className="flex-1 h-px bg-[#DCE6EF]" />

                </div>

                {/* =================================================
                  CREATE ACCOUNT
              ================================================== */}

                <p className="text-center text-sm text-[#52708F]">

                  Don't have an account?{' '}

                  <Link
                      to="/register"
                      className="font-bold text-[#1B3A68] hover:text-[#C08B22] transition-colors duration-300"
                  >
                    Create an account
                  </Link>

                </p>

              </form>

              {/* Footer */}

              <div className="mt-9 flex items-center justify-center gap-3 text-xs text-[#8AA0B7]">

              <span className="text-[#ECB44D]">
                ✦
              </span>

                <span>
                © 2026 Collabora. All rights reserved.
              </span>

                <span className="text-[#244A7A]">
                ✦
              </span>

              </div>

            </div>

          </section>

          {/* =========================================================
            RIGHT SIDE - ORIGINAL SENTENCES
        ========================================================== */}

          <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#315F91] via-[#285487] to-[#1B3A68] text-white flex items-center">

            {/* =====================================================
              DEEP BLUE / GOLD LIGHT
          ====================================================== */}

            <div className="absolute top-[-180px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#3A6D9E]/25 blur-3xl" />

            <div className="absolute bottom-[-180px] left-[-100px] w-[500px] h-[500px] rounded-full bg-[#ECB44D]/12 blur-3xl" />

            <div className="absolute top-[30%] left-[35%] w-[300px] h-[300px] rounded-full bg-[#244A7A]/20 blur-3xl" />

            {/* =====================================================
              RIGHT SIDE STARS
          ====================================================== */}

            <div className="absolute top-[8%] left-[8%] text-[#F2E199] text-xl animate-pulse">
              ✦
            </div>

            <div className="absolute top-[18%] right-[12%] text-[#3A6D9E] text-sm">
              ✧
            </div>

            <div className="absolute top-[32%] left-[45%] text-[#F2E199] text-xs">
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

            <div className="absolute top-[45%] right-[5%] text-[#F2E199] text-xs animate-pulse">
              ✦
            </div>

            <div className="absolute bottom-[40%] right-[35%] text-[#244A7A] text-xs">
              ✧
            </div>

            <div className="absolute top-[25%] left-[18%] text-[#285487] text-xs">
              ✦
            </div>

            <div className="absolute top-[68%] right-[8%] text-[#3A6D9E] text-sm">
              ✧
            </div>

            {/* =====================================================
              MOON
          ====================================================== */}

            <div className="absolute top-[9%] right-[12%] w-32 h-32">

              <div className="absolute w-32 h-32 rounded-full bg-[#F2E199] shadow-[0_0_60px_rgba(242,225,153,0.30)]" />

              <div className="absolute top-3 left-5 w-32 h-32 rounded-full bg-[#315F91]" />

            </div>

            {/* =====================================================
              RIGHT SIDE CONTENT
          ====================================================== */}

            <div className="relative z-10 px-10 sm:px-14 lg:px-16 xl:px-20 w-full">

              {/* Logo */}

              <div className="flex items-center gap-4 mb-31 -mt-27">

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

              {/* =================================================
                ORIGINAL SENTENCES
            ================================================== */}

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
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v2h8z"
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

            {/* =====================================================
              CURVED BOTTOM
          ====================================================== */}

            <div className="absolute bottom-[-150px] left-[-10%] w-[125%] h-[260px] bg-[#244A7A] rounded-[50%] rotate-[-5deg]" />

            <div className="absolute bottom-[-210px] left-[-15%] w-[130%] h-[270px] bg-[#1B3A68] rounded-[50%] rotate-[5deg]" />

            {/* Footer */}

            <div className="absolute bottom-8 left-10 sm:left-14 lg:left-16 text-xs text-white/60">
              © 2026 Collabora. All rights reserved.
            </div>

          </section>

        </div>
      </div>
  );
};

export default Login;