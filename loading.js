export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinning Circle */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        
        {/* Loading Text */}
        <p className="text-gray-600 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}