
# MindfulVision - AI-Powered Yoga Pose Assistant

MindfulVision is a full-stack web application that leverages computer vision and machine learning to provide real-time yoga pose detection and feedback. Built with a React.js frontend (in `/frontend`) and a Python Flask backend (in `/backend`).

## 🚀 Features

- **Real-time Pose Detection**: Live webcam integration for instant pose analysis
- **AI-Powered Classification**: Machine learning model for accurate pose identification
- **Responsive UI**: Modern, accessible interface with smooth animations
- **Pose Library**: Comprehensive collection of yoga poses with instructions
- **Progress Tracking**: Session statistics and pose history
- **Settings Management**: Customizable notification preferences

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Python Flask** - API server
- **OpenCV** - Computer vision
- **MediaPipe** - Pose detection
- **Scikit-learn** - Machine learning
- **NumPy** - Numerical computing

## 📋 Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Webcam access
- Git

## 🚀 Installation

### Frontend Setup

1. Clone the repository
```bash
git clone https://github.com/VajnamVasanth/MindfulVision-.git
cd project
```

2. Navigate to frontend directory
```bash
cd frontend
```

3. Install dependencies
```bash
npm install
```

4. Run the frontend
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to backend directory
```bash
cd ../backend
```

2. Create virtual environment
```bash
python -m venv venv
```

3. Activate virtual environment
```bash
# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

4. Install dependencies
```bash
pip install flask flask-cors opencv-python mediapipe scikit-learn numpy pandas
# Or if you have requirements.txt:
pip install -r requirements.txt
```

5. Run the backend
```bash
python app.py
```
Backend will start on `http://localhost:5000`

### Training the Model

1. Prepare the dataset
```bash
# Create dataset directory
mkdir -p yoga-dataset/dataset

# Place your yoga pose images in respective class folders:
yoga-dataset/dataset/
├── downdog/
│   ├── image1.jpg
│   └── image2.jpg
├── warrior/
│   ├── image1.jpg
│   └── image2.jpg
└── ...
```

2. Generate keypoints data
```bash
python extract_keypoints.py
```
This will create `yoga_keypoints.csv`

3. Train the model
```bash
python quick_accuracy_boost.py
```

## 🎯 Usage

1. **Start the Application**:
   - Frontend: `npm run dev` (runs on http://localhost:5173)
   - Backend: `python app.py` (runs on http://127.0.0.1:5000)

2. **Practice Yoga**:
   - Navigate to the Practice page
   - Allow webcam access
   - Position yourself in view of the camera
   - Click "Capture Pose" or use "Start" for real-time detection

3. **Explore Poses**:
   - Visit the Pose Library to browse different yoga poses
   - View detailed instructions and demonstrations

## 🔧 Configuration & Project Structure

- **Frontend**: All React code and configuration files are in `/frontend`.
- **Backend**: All Flask code and Python scripts are in `/backend`.
- **ML Data & Models**: Large datasets and model files are in `/yoga-dataset` (not tracked by git).
- **Configuration files**: Keep only one config file per tool (e.g., `postcss.config.js`, `tailwind.config.js`) in the relevant directory.

### Environment Variables
Create a `.env` file in the root of `/frontend`:
```env
VITE_API_URL=http://127.0.0.1:5000
```

### Backend Configuration
The Flask backend automatically loads the ML model from the specified path in `app.py`.
