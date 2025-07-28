import { useState } from 'react';
import { ArrowLeft, Save, Camera, Bell, Settings as SettingsIcon, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out ${
        checked ? 'bg-green-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-all duration-300 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function RangeSlider({ value, onChange, min = 0, max = 100 }) {
  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider transition-all duration-300"
        style={{
          background: `linear-gradient(to right, #10b981 0%, #10b981 ${(value / max) * 100}%, #e5e7eb ${(value / max) * 100}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
}

function Settings() {
  const [activeTab, setActiveTab] = useState('camera');
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [cameraResolution, setCameraResolution] = useState('720p');
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [soundNotifications, setSoundNotifications] = useState(true);
  const [poseDetectionAlerts, setPoseDetectionAlerts] = useState(true);
  const [sessionSummary, setSessionSummary] = useState(true);

  const tabs = [
    { id: 'camera', label: 'Camera', icon: Camera },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'performance', label: 'Performance', icon: SettingsIcon },
    { id: 'display', label: 'Display', icon: Monitor },
  ];

  const resolutionOptions = [
    { value: '480p', label: '480p (Low)' },
    { value: '720p', label: '720p (High)' },
    { value: '1080p', label: '1080p (Ultra)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl mt-16">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-base text-gray-600">Customize your yoga practice experience</p>
          </div>
          <div className="flex gap-3 ml-8">
            <Link
              to="/practice"
              className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Practice
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#679A6F] text-white rounded-md hover:bg-[#5a8a62] transition-colors text-sm">
              <Save className="h-3 w-3" />
              Save Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-8 justify-center w-full max-w-3xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-all duration-300 ease-in-out rounded-md text-sm flex-1 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Icon className={`h-3 w-3 transition-all duration-300 ${
                  activeTab === tab.id ? 'text-gray-900' : 'text-gray-700'
                }`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content with Animation */}
        <div className="relative w-full max-w-3xl mx-auto">
          {/* Camera Settings Content */}
          <div className={`transition-all duration-500 ease-in-out ${
            activeTab === 'camera' 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4 absolute top-0 left-0 right-0 pointer-events-none'
          }`}>
            {activeTab === 'camera' && (
              <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn w-full">
                <h2 className="text-lg text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Camera Settings</h2>
                
                <div className="space-y-6">
                  {/* Enable Camera */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-gray-900 text-sm" style={{ fontFamily: 'Playfair Display, serif' }}>Enable Camera</h3>
                      <p className="text-xs text-gray-600" style={{ fontFamily: 'Playfair Display, serif' }}>Toggle camera access for pose detection</p>
                    </div>
                    <ToggleSwitch checked={cameraEnabled} onChange={setCameraEnabled} />
                  </div>

                  {/* Camera Resolution */}
                  <div className="py-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-900 mb-2 text-sm">Camera Resolution</h3>
                    <p className="text-xs text-gray-600 mb-3">Choose your preferred camera quality</p>
                    <select
                      value={cameraResolution}
                      onChange={(e) => setCameraResolution(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm"
                    >
                      {resolutionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Confidence Threshold */}
                  <div className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">Confidence Threshold: {confidenceThreshold}%</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">Minimum confidence level for pose detection</p>
                    <RangeSlider
                      value={confidenceThreshold}
                      onChange={setConfidenceThreshold}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Settings Content */}
          <div className={`transition-all duration-500 ease-in-out ${
            activeTab === 'notifications' 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4 absolute top-0 left-0 right-0 pointer-events-none'
          }`}>
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn w-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h2>
                <div className="space-y-6">
                  {/* Sound Notifications */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Sound Notifications</h3>
                      <p className="text-xs text-gray-600">Play sounds for pose detection events</p>
                    </div>
                    <ToggleSwitch checked={soundNotifications} onChange={setSoundNotifications} />
                  </div>

                  {/* Pose Detection Alerts */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Pose Detection Alerts</h3>
                      <p className="text-xs text-gray-600">Receive alerts when a new pose is detected</p>
                    </div>
                    <ToggleSwitch checked={poseDetectionAlerts} onChange={setPoseDetectionAlerts} />
                  </div>

                  {/* Session Summary */}
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Session Summary</h3>
                      <p className="text-xs text-gray-600">Get a summary at the end of each practice session</p>
                    </div>
                    <ToggleSwitch checked={sessionSummary} onChange={setSessionSummary} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Performance Settings Content */}
          <div className={`transition-all duration-500 ease-in-out ${
            activeTab === 'performance' 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4 absolute top-0 left-0 right-0 pointer-events-none'
          }`}>
            {activeTab === 'performance' && (
              <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn w-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Settings</h2>
                <p className="text-gray-600 text-sm">Performance settings will be implemented here.</p>
              </div>
            )}
          </div>

          {/* Display Settings Content */}
          <div className={`transition-all duration-500 ease-in-out ${
            activeTab === 'display' 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4 absolute top-0 left-0 right-0 pointer-events-none'
          }`}>
            {activeTab === 'display' && (
              <div className="bg-white rounded-lg shadow-sm p-6 animate-fadeIn w-full">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Display Settings</h2>
                <p className="text-gray-600 text-sm">Display settings will be implemented here.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease-in-out;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

export default Settings;
