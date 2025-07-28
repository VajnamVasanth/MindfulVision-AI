import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { cn } from '../lib/utils';
import Navbar from '../components/layout/Navbar';

function Home() {
  // Use yoga-forest-sunlight.jpg as background
  const backgroundImageUrl = '/images/yoga-forest-sunlight.jpg';

  // Benefits data
  const benefits = [
    {
      title: "Improve Your Form",
      description: "Get real-time feedback on your yoga poses to ensure proper alignment and maximize benefits.",
      icon: Check
    },
    {
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed analytics and personalized insights.",
      icon: Check
    },
    {
      title: "Learn New Poses",
      description: "Explore our extensive library of yoga poses with detailed instructions and demonstrations.",
      icon: Check
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Accessibility notifications element */}
      <section 
        aria-label="Notifications alt+T" 
        tabIndex="-1" 
        aria-live="polite" 
        aria-relevant="additions text" 
        aria-atomic="false"
        className="sr-only"
      ></section>

      {/* Hero section with background image */}
      <div className="h-screen relative flex flex-col">
        {/* Full-screen background image with overlay and blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: `url("${backgroundImageUrl}")`,
            filter: 'blur(2px)',
          }}
        >
        </div>
        {/* White overlay for better text visibility - further reduced opacity */}
        <div className="absolute inset-0 bg-white/40 z-0"></div>

        {/* Navigation */}
        <header className="relative z-10 px-6 py-4">
          <div className="container mx-auto">
            <Navbar />
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-4 text-center">
          <div className="max-w-4xl">
            <div className="inline-block px-6 py-2 rounded-full bg-white/70 text-green-800 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Discover Your Practice
            </div>
            
            <h1 className="mb-6" role="heading" aria-label="Yoga Pose Classifier">
              <span
                style={{
                  color: '#111827',
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '72px',
                  fontWeight: 700,
                  outline: 'none',
                }}
                tabIndex={0}
              >
                Yoga Pose{' '}
              </span>
              <span
                style={{
                  color: '#679A6F',
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '72px',
                  fontWeight: 700,
                  outline: 'none',
                }}
                tabIndex={0}
              >
                Classifier
              </span>
            </h1>
            
            <p className="text-xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
              Enhance your yoga practice with real-time pose detection and guidance.
              <br />
              Perfect your form and deepen your understanding of each asana.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/practice" 
                role="link"
                className="inline-flex items-center justify-center gap-2 bg-[#8BAD91] text-white px-5 py-2 rounded-full text-base font-normal whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Start Practice <ArrowRight size={16} />
              </Link>
              <Link 
                to="/poses" 
                role="link"
                className="inline-flex items-center justify-center bg-white text-[#3D6246] px-5 py-2 rounded-full text-base font-normal whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#3D6246]"
              >
                Explore Poses
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl text-center mb-16" style={{ fontFamily: 'Playfair Display, serif' }}>How Yoga Pose AI Helps You</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  <benefit.icon className="text-green-600 w-6 h-6" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{benefit.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: 'Playfair Display, serif' }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl text-green-300 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>MindfulVision</h2>
              <p className="text-gray-400" style={{ fontFamily: 'Playfair Display, serif' }}>Perfect your practice with AI assistance</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Navigation</h3>
                <ul className="space-y-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link to="/practice" className="text-gray-400 hover:text-white">Practice</Link></li>
                  <li><Link to="/poses" className="text-gray-400 hover:text-white">Pose Library</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Support</h3>
                <ul className="space-y-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} MindfulVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
