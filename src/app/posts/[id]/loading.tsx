export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-pulse">
      <div className="h-4 w-20 bg-gray-200 rounded mb-4" />
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="h-6 w-24 bg-indigo-100 rounded-full mb-3" />
        <div className="h-7 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-32 bg-gray-100 rounded mb-4" />
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
        <div className="space-y-2 mb-5">
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-5/6 bg-gray-100 rounded" />
          <div className="h-4 w-4/6 bg-gray-100 rounded" />
        </div>
        <div className="h-12 bg-indigo-50 rounded-lg mb-4" />
        <div className="border-t border-gray-100 pt-5">
          <div className="h-5 w-24 bg-gray-100 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-12 bg-gray-50 rounded" />
            <div className="h-12 bg-gray-50 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
