import React, { Suspense, lazy, useState, Component, ErrorInfo, ReactNode } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface ErrorBoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class SplineErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Spline runtime crashed with error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [hasError, setHasError] = useState(false)

  const fallbackUI = (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 rounded-[2.5rem] relative overflow-hidden">
      {/* Glowing backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle grid mesh overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      {/* Orbital particles visual simulation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-slate-800/40 rounded-full animate-[spin_24s_linear_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-dashed border-primary-500/15 rounded-full animate-[spin_16s_linear_infinite_reverse] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-slate-800/40 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md text-center p-8 space-y-4 animate-fadeIn">
        <div className="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center text-primary-400">
          <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-200">SDN 3 Purwosari</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Menghubungkan masa depan dengan inovasi dan kreativitas. Sistem kami menyajikan tata kelola pendidikan modern dan berkualitas tinggi.
        </p>
      </div>
    </div>
  )

  if (hasError) {
    return fallbackUI
  }

  return (
    <SplineErrorBoundary fallback={fallbackUI}>
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-slate-950 rounded-[2.5rem]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
              <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">Memuat Objek 3D...</span>
            </div>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
          onError={() => {
            console.warn("Spline failed to load. Using rich interactive fallback.")
            setHasError(true)
          }}
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}

