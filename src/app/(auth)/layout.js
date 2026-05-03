export const metadata = {
  title: 'TaskFlow — Sign In',
  description: 'Sign in to your TaskFlow account',
};

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-indigo-200/20 dark:bg-indigo-500/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {children}
      </div>
    </div>
  );
}
