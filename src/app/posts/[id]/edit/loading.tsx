export default function Loading() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-32 bg-gray-200 rounded mb-6" />
      <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-4">
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-24 bg-gray-100 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-10 bg-gray-100 rounded-lg" />
          <div className="h-10 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 bg-gray-100 rounded-lg" />
        <div className="h-10 bg-indigo-200 rounded-lg" />
      </div>
    </div>
  );
}
