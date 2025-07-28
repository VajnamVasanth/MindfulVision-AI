function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen fixed inset-0 bg-white bg-opacity-80 z-50">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-green-600 animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-400 animate-spin delay-150"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-8 w-8 rounded-full border-t-4 border-b-4 border-green-200 animate-spin delay-300"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
