import Navbar from '../components/layout/Navbar';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Video, Camera, Play, RefreshCw, Settings as SettingsIcon } from 'lucide-react';

function Practice() {
  const [tab, setTab] = useState('current');
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [keypoints, setKeypoints] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoDims, setVideoDims] = useState({ width: 400, height: 400 });
  const [webcamReady, setWebcamReady] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  const intervalRef = useRef(null);
  const [currentPose, setCurrentPose] = useState('Waiting for pose...');
  const [confidence, setConfidence] = useState(0);
  const [poseHistory, setPoseHistory] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    totalPoses: 0,
    correctPoses: 0,
    averageConfidence: 0
  });
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  // Polling function to wait for video ready
  function waitForVideoReady(video, callback) {
    const checkReady = () => {
      if (video.readyState === 4) {
        callback();
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  }

  const handleUserMedia = () => {
    if (webcamRef.current && webcamRef.current.video) {
      const video = webcamRef.current.video;
      waitForVideoReady(video, () => {
        setVideoDims({ width: video.videoWidth, height: video.videoHeight });
        setWebcamReady(true);
      });
    }
  };

  // Draw keypoints on canvas
  React.useEffect(() => {
    if (!keypoints || !canvasRef.current || !webcamRef.current) return;
    const video = webcamRef.current.video;
    const width = video?.videoWidth || videoDims.width;
    const height = video?.videoHeight || videoDims.height;
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#22c55e'; // green-500
    keypoints.forEach((pt) => {
      if (pt.visibility > 0.5) {
        ctx.beginPath();
        ctx.arc(pt.x * width, pt.y * height, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  }, [keypoints, videoDims]);

  // Helper: Convert dataURL to Blob
  function dataURLtoBlob(dataurl) {
    try {
      if (!dataurl || typeof dataurl !== 'string') {
        console.error('Invalid dataURL:', dataurl);
        return null;
      }

      // Check if the dataURL is properly formatted
      if (!dataurl.startsWith('data:') || !dataurl.includes('base64,')) {
        console.error('Malformed dataURL - missing data: prefix or base64');
        return null;
      }

      // Split the dataURL into the mime type and base64 data
      const [header, base64Data] = dataurl.split('base64,');
      if (!header || !base64Data) {
        console.error('Failed to split dataURL');
        return null;
      }

      // Extract mime type
      const mime = header.match(/data:(.*?);/)?.[1];
      if (!mime) {
        console.error('Could not extract mime type');
        return null;
      }

      // Convert base64 to binary
      const bstr = atob(base64Data);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }

      return new Blob([u8arr], { type: mime });
    } catch (error) {
      console.error('Error in dataURLtoBlob:', error);
      return null;
    }
  }

  // Real-time capture function
  const startRealtime = () => {
    if (isRealtime || loading) return;
    setIsRealtime(true);
    intervalRef.current = setInterval(() => {
      captureAndSend(true); // pass true to indicate real-time (optional)
    }, 800); // adjust interval as needed (ms)
  };

  const stopRealtime = () => {
    setIsRealtime(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Get available cameras on component mount
  React.useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
        
        // Select the first USB camera if available, otherwise use the first camera
        const usbCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('usb') || 
          device.label.toLowerCase().includes('external') ||
          device.label.toLowerCase().includes('webcam')
        );
        
        if (usbCamera) {
          setSelectedCamera(usbCamera.deviceId);
        } else if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error getting cameras:', error);
      }
    };
    
    getCameras();
  }, []);

  // Check API status on component mount
  React.useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/health');
        const data = await response.json();
        if (data.classifier_loaded) {
          setApiStatus('Connected - AI Pose Classification Ready');
        } else {
          setApiStatus('Connected - Basic Pose Detection Only');
        }
      } catch (error) {
        setApiStatus('Not Connected - Start the Flask backend');
      }
    };
    
    checkApiStatus();
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Update captureAndSend to optionally skip loading state in real-time
  const captureAndSend = async (isAuto = false) => {
    try {
      console.log('Starting pose detection...');
      
      if (!webcamRef.current || !webcamRef.current.video) {
        throw new Error('Webcam is not initialized');
      }
      
      if (webcamRef.current.video.readyState !== 4) {
        throw new Error('Webcam is not ready yet. Please wait.');
      }
      
      if (!isAuto) setLoading(true);
      setError(null);
      setKeypoints(null);
      
      console.log('Capturing webcam image...');
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc || typeof imageSrc !== 'string' || !imageSrc.includes(',')) {
        throw new Error('Could not capture image. Please ensure the webcam is active.');
      }
      
      console.log('Converting image to blob...');
      const blob = dataURLtoBlob(imageSrc);
      if (!blob || blob.size === 0) {
        throw new Error('Failed to process webcam image. Please try again.');
      }
      
      console.log('Sending image to API...');
      const formData = new FormData();
      formData.append('image', blob, 'capture.png');
      
      const response = await fetch('http://127.0.0.1:5000/detect-pose', {
        method: 'POST',
        body: formData,
      });
      
      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (response.ok && data) {
        if (data.keypoints) {
          setKeypoints(data.landmarks || data.keypoints);
        }
        
        // Handle pose classification
        if (data.pose_classification) {
          const poseName = data.pose_classification;
          const confidence = data.confidence;
          
          // Check if it's a status message rather than a pose name
          if (poseName === "Insufficient pose data" || poseName === "Body not fully visible") {
            setCurrentPose(poseName);
            setConfidence(0);
          } else {
            setCurrentPose(poseName);
            setConfidence(Math.round(confidence * 100));
            
            // Only update stats for actual pose detections
            if (confidence > 0.3) { // Only count poses with reasonable confidence
              setSessionStats(prev => ({
                totalPoses: prev.totalPoses + 1,
                correctPoses: prev.correctPoses + (confidence > 0.7 ? 1 : 0),
                averageConfidence: Math.round(((prev.averageConfidence * prev.totalPoses) + confidence * 100) / (prev.totalPoses + 1))
              }));
              
              // Add to pose history only for actual poses
              setPoseHistory(prev => [...prev.slice(-9), {
                pose: poseName,
                confidence: confidence,
                timestamp: new Date().toLocaleTimeString()
              }]);
            }
          }
        } else if (data.error) {
          setCurrentPose('No pose detected');
          setConfidence(0);
        }
      } else {
        throw new Error(data.error || 'No keypoints detected.');
      }
    } catch (err) {
      console.error('Pose detection error:', err);
      if (!isAuto) setError(err.message || 'Error processing image.');
      setCurrentPose('Error detecting pose');
      setConfidence(0);
    } finally {
      if (!isAuto) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc]">
      <Navbar />
      <main className="flex-grow pt-16 pb-12 px-2 md:px-0">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-3xl md:text-4xl text-center mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Practice Your Yoga</h1>
          <p className="text-base md:text-lg text-center text-gray-600 mb-6 max-w-xl mx-auto" style={{ fontFamily: 'Playfair Display, serif' }}>
            Use your webcam to get real-time feedback on your yoga poses. Position yourself in view of the camera and strike a pose.
          </p>

          {/* API status bar */}
          <div className={`w-full rounded-lg py-3 px-6 mb-6 text-center font-medium ${
            apiStatus.includes('AI Pose Classification Ready') 
              ? 'bg-green-100 text-green-800' 
              : apiStatus.includes('Basic Pose Detection') 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {apiStatus}
          </div>

          {/* Main grid layout: webcam and pose card side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Webcam panel */}
            <div className="flex flex-col justify-center h-full">
              <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center h-[540px] md:h-[640px] w-full">
                <div className="flex flex-col items-center justify-center h-full w-full">
                  {/* Camera Selection */}
                  {availableCameras.length > 1 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Camera:
                      </label>
                      <select
                        value={selectedCamera || ''}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {availableCameras.map((camera, index) => (
                          <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${index + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Webcam component */}
                  <div className="relative">
                    <Webcam
                      key={selectedCamera} // Force re-render when camera changes
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/png"
                      width={videoDims.width}
                      height={videoDims.height}
                      videoConstraints={{
                        deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
                        width: videoDims.width,
                        height: videoDims.height
                      }}
                      className="rounded-lg border border-gray-300 mb-4"
                      onUserMedia={handleUserMedia}
                      mirrored={true}
                    />
                    {/* Canvas overlay for keypoints */}
                    <canvas
                      ref={canvasRef}
                      width={videoDims.width}
                      height={videoDims.height}
                      className="absolute left-0 top-0 pointer-events-none mb-4"
                      style={{ zIndex: 10 }}
                    />
                  </div>
                  <div className="text-lg font-semibold mb-1 text-gray-700">Webcam Active</div>
                  <div className="text-gray-500 text-base text-center">Click "Capture Pose" to detect your pose</div>
                </div>
              </div>
              {/* Button row below webcam */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <button
                  className="flex items-center gap-2 px-5 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 transition font-medium"
                  onClick={() => captureAndSend(false)}
                  disabled={loading || !webcamReady || isRealtime}
                >
                  <Camera className="w-5 h-5" />
                  {loading ? 'Detecting...' : 'Capture Pose'}
                </button>
                {!webcamReady && (
                  <div className="text-yellow-700 text-center mt-2">
                    Waiting for webcam to initialize...
                  </div>
                )}
                <button
                  className="flex items-center gap-2 px-8 py-2 rounded-lg bg-green-100 text-green-900 font-medium hover:bg-green-200 transition"
                  onClick={startRealtime}
                  disabled={loading || !webcamReady || isRealtime}
                >
                  <Play className="w-5 h-5" />
                  Start
                </button>
                <button
                  className="flex items-center gap-2 px-6 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 transition font-medium"
                  onClick={stopRealtime}
                  disabled={!isRealtime}
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset
                </button>
                <button className="flex items-center gap-2 px-6 py-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-50 transition font-medium" disabled>
                  <SettingsIcon className="w-5 h-5" />
                  Settings
                </button>
              </div>
              {/* Display error only below buttons */}
              <div className="mt-6 w-full max-w-xl mx-auto">
                {error && <div className="text-red-600 text-center mb-2">{error}</div>}
              </div>
            </div>

            {/* Current Pose tabs and card */}
            <div className="flex flex-col justify-center h-full">
              {/* Tabs - 100% match reference, now above the card */}
              <div className="flex bg-gray-100 border border-gray-200 rounded-xl p-1 mb-6 mx-6 mt-0">
                <button
                  className={`flex-1 py-2 text-center font-semibold transition-colors text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${tab === 'current' ? 'bg-white text-black rounded-l-xl z-10 border border-gray-200' : 'text-gray-500 bg-transparent'} ${tab !== 'current' ? 'hover:bg-gray-200' : ''}`}
                  style={{ borderRight: 'none' }}
                  onClick={() => setTab('current')}
                >
                  Current Pose
                </button>
                <button
                  className={`flex-1 py-2 text-center font-semibold transition-colors text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${tab === 'stats' ? 'bg-white text-black rounded-r-xl z-10 border border-gray-200' : 'text-gray-500 bg-transparent'} ${tab !== 'stats' ? 'hover:bg-gray-200' : ''}`}
                  onClick={() => setTab('stats')}
                >
                  Session Stats
                </button>
              </div>
              <div className="bg-gray-100 rounded-xl p-10 flex flex-col justify-center h-[480px] md:h-[580px] w-full">
                {tab === 'current' ? (
                  <>
                    <div className="text-2xl font-serif mb-2">Current Pose</div>
                    <div className="text-base text-gray-500 mb-1">Detected Pose</div>
                    <div className="text-3xl font-bold mb-6 text-gray-900 font-sans break-words">
                      {currentPose}
                    </div>
                    <div className="mb-2">
                      <span className="text-base text-gray-500">Confidence</span>
                      <span className="float-right text-base text-gray-700 font-medium">{confidence}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          confidence > 80 ? 'bg-green-500' : 
                          confidence > 60 ? 'bg-yellow-500' : 
                          confidence > 0 ? 'bg-red-500' : 'bg-gray-400'
                        }`} 
                        style={{ width: `${confidence}%` }}
                      ></div>
                    </div>
                    <div className="mb-6">
                      <span className="text-base text-gray-500">Hold Duration</span>
                      <span className="ml-2 text-2xl font-bold text-gray-900 align-middle">0:00</span>
                    </div>
                    {/* Tips section */}
                    <div className="bg-gray-50 rounded-xl p-6 mt-2">
                      <div className="font-normal text-gray-500 mb-2">Tips</div>
                      <ul className="text-gray-700 text-base list-disc pl-5 space-y-1">
                        <li>Ensure good lighting in your practice area</li>
                        <li>Position yourself so your full body is visible</li>
                        <li>Move slowly and hold poses steadily</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-full w-full">
                    <div className="text-xl font-semibold mb-6">Session Stats</div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Poses Detected</span>
                        <span className="font-bold text-lg">{sessionStats.totalPoses}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">High Confidence Poses</span>
                        <span className="font-bold text-lg">{sessionStats.correctPoses}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Average Confidence</span>
                        <span className="font-bold text-lg">{sessionStats.averageConfidence}%</span>
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <div className="text-gray-600 mb-2">Recent Poses</div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {poseHistory.length > 0 ? (
                            poseHistory.map((entry, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="truncate">{entry.pose}</span>
                                <span className="text-gray-500">{Math.round(entry.confidence * 100)}%</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500 text-sm">No poses detected yet</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Practice;
