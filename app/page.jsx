"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Mail, Eye, EyeOff, ArrowRight, Box } from "lucide-react"
import Button from "@/components/button"
import Input from "@/components/InputForm"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Username atau password salah")
        setIsLoading(false)
        return
      }

      // Redirect will be handled by middleware based on role
      router.push("/admin") // This will be redirected by middleware to appropriate dashboard
      router.refresh()
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-16 bg-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#196885] rounded-xl flex items-center justify-center">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">SistemAlat</span>
        </div>

        {/* Form Container */}
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <p className="text-slate-500 mb-2">Mulai perjalanan Anda</p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 text-balance">
              Masuk ke Sistem Peminjaman Alat
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Username/Email Field */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  label="Username atau Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username atau email@example.com"
                  required
                  size="md"
                  rounded="xl"
                  fullWidth
                  className="px-4 py-3.5 pr-12 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <Mail className="absolute right-4 top-[46px] -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  size="md"
                  rounded="xl"
                  fullWidth
                  className="px-4 py-3.5 pr-12 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[46px] -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              // variant="primary"
              size="lg"
              rounded="xl"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#207591] hover:bg-[#99bfcc] shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-sm">atau masuk dengan</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Social Login */}
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left">
          <p className="text-slate-500">
            Belum punya akun?{" "}
            <a href="#" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
              Daftar
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/vibrant-yellow-blue-waves-showcase-modern-creativity-generated-by-ai.jpg"
          alt="Abstract fluid art"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-pink-500/10" />
      </div>
    </div>
  )
}
