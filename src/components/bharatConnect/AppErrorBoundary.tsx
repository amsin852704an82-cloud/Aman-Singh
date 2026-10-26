import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage?: string;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl m-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white">कुछ तकनीकी समस्या हुई</h2>
            <p className="text-xs text-slate-400 max-w-sm">
              पेज लोड करते समय एक अप्रत्याशित समस्या आई। आपका डेटा सुरक्षित है।
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-orange-500/20 active:scale-95 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>पुनः प्रयास करें (Reload)</span>
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>होम पर जाएं</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
