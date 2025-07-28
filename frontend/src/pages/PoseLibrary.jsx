import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { cn } from '../lib/utils';

// Sample pose data - in a real app, this would come from an API or database
const poses = [
  {
    id: 1,
    name: 'Downward Dog',
    sanskritName: 'Adho Mukha Svanasana',
    category: 'standing',
    level: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300',
    description: 'Downward Dog strengthens the arms, shoulders, and back while stretching the hamstrings, calves, and arches of your feet.'
  },
  {
    id: 2,
    name: 'Warrior I',
    sanskritName: 'Virabhadrasana I',
    category: 'standing',
    level: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=300',
    description: 'Warrior I strengthens your shoulders, arms, legs, ankles and back. It also opens the hips, chest and lungs.'
  },
  {
    id: 3,
    name: 'Tree Pose',
    sanskritName: 'Vrikshasana',
    category: 'standing',
    level: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e?q=80&w=300',
    description: 'Tree Pose improves your balance and strengthens your legs and core.'
  },
  {
    id: 4,
    name: 'Cobra Pose',
    sanskritName: 'Bhujangasana',
    category: 'prone',
    level: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?q=80&w=300',
    description: 'Cobra Pose strengthens the spine, stretches chest and lungs, shoulders, and abdomen.'
  },
  {
    id: 5,
    name: 'Child\'s Pose',
    sanskritName: 'Balasana',
    category: 'seated',
    level: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=300',
    description: 'Child\'s Pose gently stretches the hips, thighs, and ankles while calming the brain and helping relieve stress and fatigue.'
  },
  {
    id: 6,
    name: 'Crow Pose',
    sanskritName: 'Bakasana',
    category: 'arm balance',
    level: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1566496561430-f9be9943de9b?q=80&w=300',
    description: 'Crow Pose strengthens arms and wrists while building core strength and balance.'
  },
  {
    id: 7,
    name: 'Headstand',
    sanskritName: 'Sirsasana',
    category: 'inversion',
    level: 'advanced',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=300',
    description: 'Headstand improves blood circulation to the brain, strengthens the upper body, and improves balance.'
  },
  {
    id: 8,
    name: 'Bridge Pose',
    sanskritName: 'Setu Bandha Sarvangasana',
    category: 'supine',
    level: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1562088287-bde35a1ea917?q=80&w=300',
    description: 'Bridge Pose strengthens the back, buttocks, and hamstrings while opening the chest and shoulders.'
  }
];

// Filter options
const categories = ['all', 'standing', 'seated', 'prone', 'supine', 'arm balance', 'inversion'];
const levels = ['all', 'beginner', 'intermediate', 'advanced'];

function PoseCard({ pose }) {
  return (
    <div className="bg-card rounded-lg overflow-hidden border hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={pose.imageUrl} 
          alt={pose.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>{pose.name}</h3>
        <p className="text-sm text-muted-foreground italic mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{pose.sanskritName}</p>
        <div className="flex gap-2 mb-3">
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full" style={{ fontFamily: 'Playfair Display, serif' }}>
            {pose.category}
          </span>
          <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
            {pose.level}
          </span>
        </div>
        <p className="text-sm line-clamp-2">{pose.description}</p>
      </div>
    </div>
  );
}

function PoseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter poses based on search term, category, and level
  const filteredPoses = poses.filter(pose => {
    const matchesSearch = 
      pose.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pose.sanskritName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || pose.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || pose.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl mb-4 md:mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>Pose Library</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search input */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search poses..."
                  className="pl-9 pr-4 py-2 w-full rounded-md border border-input bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter button */}
              <button 
                className="flex items-center gap-2 px-4 py-2 border rounded-md bg-background hover:bg-accent transition-colors"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
          
          {/* Filter options */}
          <div className={cn(
            "mb-6 p-4 bg-muted rounded-md transition-all overflow-hidden",
            isFilterOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 p-0"
          )}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={cn(
                        "px-3 py-1 text-sm rounded-full capitalize",
                        selectedCategory === category 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background hover:bg-accent"
                      )}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Level</h3>
                <div className="flex flex-wrap gap-2">
                  {levels.map(level => (
                    <button
                      key={level}
                      className={cn(
                        "px-3 py-1 text-sm rounded-full capitalize",
                        selectedLevel === level 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-background hover:bg-accent"
                      )}
                      onClick={() => setSelectedLevel(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Poses grid */}
          {filteredPoses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPoses.map(pose => (
                <PoseCard key={pose.id} pose={pose} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No poses found matching your criteria.</p>
              <button 
                className="mt-4 text-primary hover:underline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PoseLibrary;
