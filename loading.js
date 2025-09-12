export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white w-full">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mr-2"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
  );
}