import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BarChart, Award } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

// Sample pose data - in a real app, this would come from an API or database
const poses = [
  {
    id: 1,
    name: 'Downward Dog',
    sanskritName: 'Adho Mukha Svanasana',
    category: 'standing',
    level: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600',
    description: 'Downward Dog strengthens the arms, shoulders, and back while stretching the hamstrings, calves, and arches of your feet.',
    benefits: [
      'Strengthens the upper body',
      'Stretches the hamstrings and calves',
      'Improves blood circulation',
      'Relieves back pain',
      'Calms the mind'
    ],
    instructions: [
      'Start on your hands and knees, with your hands slightly in front of your shoulders',
      'Press your hands firmly into the mat, tuck your toes, and lift your knees off the floor',
      'Straighten your legs as much as possible and lift your hips up and back',
      'Keep your head between your arms and relax your neck',
      'Hold for 5-10 breaths'
    ],
    duration: '30-60 seconds',
    focus: 'Strength and Flexibility',
    modifications: 'Bend your knees if your hamstrings are tight. Use blocks under your hands if needed.'
  },
  {
    id: 2,
    name: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    category: 'standing',
    level: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=600',
    description: 'Warrior I strengthens your shoulders, arms, legs, ankles and back. It also opens the hips, chest and lungs.',
    benefits: [
      'Strengthens the legs and core',
      'Opens the chest and shoulders',
      'Improves balance and stability',
      'Builds mental focus',
      'Stretches the hip flexors'
    ],
    instructions: [
      'Start in a standing position, then step one foot back about 3-4 feet',
      'Turn your back foot out at a 45-degree angle',
      'Bend your front knee so it stacks over the ankle',
      'Raise your arms overhead, palms facing each other',
      'Look up slightly and hold for 5-10 breaths'
    ],
    duration: '30-60 seconds per side',
    focus: 'Strength and Balance',
    modifications: 'Widen your stance for more stability. Keep hands on hips if shoulder mobility is limited.'
  },
  // Add more poses as needed with the same detailed structure
];

function PoseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pose, setPose] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundPose = poses.find(p => p.id === parseInt(id));
    
    if (foundPose) {
      setPose(foundPose);
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-8">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pose) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Pose Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the pose you're looking for.</p>
            <Button variant="primary" to="/poses">
              Back to Pose Library
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <button 
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
            onClick={() => navigate('/poses')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Pose Library</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="rounded-lg overflow-hidden border bg-card">
              <img 
                src={pose.imageUrl} 
                alt={pose.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>{pose.name}</h1>
              <p className="text-lg text-muted-foreground italic mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>{pose.sanskritName}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {pose.category}
                </span>
                <span className="text-sm px-3 py-1 bg-secondary/10 text-secondary rounded-full" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {pose.level}
                </span>
              </div>

              <p className="text-lg mb-6">{pose.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{pose.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Focus</p>
                    <p className="font-medium">{pose.focus}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Benefits</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {pose.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <Button variant="primary" to="/practice">
                Practice This Pose
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-10">
            <h2 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>How to Practice</h2>
            <div className="bg-card border rounded-lg p-6">
              <ol className="list-decimal pl-5 space-y-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                {pose.instructions.map((instruction, index) => (
                  <li key={index} className="pl-2">{instruction}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Modifications */}
          <div className="mt-8">
            <h2 className="text-2xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Modifications</h2>
            <div className="bg-muted/30 rounded-lg p-6">
              <p>{pose.modifications}</p>
            </div>
          </div>

          {/* Related poses would go here in a real app */}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PoseDetail; 