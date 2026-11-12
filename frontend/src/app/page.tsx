export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-pantry-border">
        <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-coral font-bold text-2xl">
          🍿
        </div>
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Snack Overflow</h1>
        <p className="text-sm text-gray-600 mb-6">
          Office Pantry & Snack Inventory Management System
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          ● Phase 1 Environment Ready
        </div>
      </div>
    </main>
  );
}
