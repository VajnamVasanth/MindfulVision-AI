from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
import joblib
import os
import base64
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,
    enable_segmentation=False,
    min_detection_confidence=0.5
)

# Load the trained pose classifier
# Updated to use the new high-accuracy model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'high_accuracy_model.pkl')
pose_classifier = None

def load_classifier():
    """Load the trained pose classifier"""
    global pose_classifier
    try:
        if os.path.exists(MODEL_PATH):
            model_data = joblib.load(MODEL_PATH)
            
            # Check if it's the new high-accuracy model structure
            if isinstance(model_data, dict) and 'model' in model_data:
                pose_classifier = model_data['model']
                scaler = model_data.get('scaler')
                accuracy = model_data.get('accuracy', 0)
                poses = model_data.get('poses', [])
                print(f"✅ High-accuracy pose classifier loaded successfully!")
                print(f"   Accuracy: {accuracy:.1%}")
                print(f"   Poses: {len(poses)}")
                print(f"   Scaler: {'Yes' if scaler else 'No'}")
                return True
            else:
                # Old model structure
                pose_classifier = model_data
                print("✅ Pose classifier loaded successfully!")
                return True
        else:
            print(f"❌ Model file not found at: {MODEL_PATH}")
            print("Make sure you've trained the model first using train_pose_classifier.py")
            return False
    except Exception as e:
        print(f"❌ Error loading classifier: {e}")
        return False

def extract_keypoints_from_image(image):
    """Extract MediaPipe keypoints and visibility from an image"""
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    if results.pose_landmarks:
        keypoints = []
        visibility = []
        for landmark in results.pose_landmarks.landmark:
            keypoints.extend([landmark.x, landmark.y, landmark.z])
            visibility.append(landmark.visibility)
        while len(keypoints) < 132:
            keypoints.append(0.0)
        keypoints = keypoints[:132]
        # Pad/truncate visibility to 33
        while len(visibility) < 33:
            visibility.append(0.0)
        visibility = visibility[:33]
        return keypoints, visibility, results.pose_landmarks
    else:
        return None, None, None

def classify_pose(keypoints, visibility):
    """Classify pose using the trained model and visibility info"""
    if pose_classifier is None:
        return None, 0.0
    try:
        # Use visibility for valid keypoints
        valid_keypoints = sum(1 for v in visibility if v > 0.5)
        if valid_keypoints < 20:
            return "Insufficient pose data", 0.0
        # Check if key body parts are visible (nose, shoulders, hips, knees)
        key_landmarks = [0, 11, 12, 23, 24, 25, 26]
        visible_key_parts = sum(1 for idx in key_landmarks if idx < len(visibility) and visibility[idx] > 0.5)
        if visible_key_parts < 4:
            return "Body not fully visible", 0.0
        keypoints_array = np.array(keypoints).reshape(1, -1)
        try:
            model_data = joblib.load(MODEL_PATH)
            if isinstance(model_data, dict) and 'scaler' in model_data:
                keypoints_array = model_data['scaler'].transform(keypoints_array)
        except:
            pass
        prediction = pose_classifier.predict(keypoints_array)[0]
        confidence = min(0.95, 0.6 + (valid_keypoints / 33) * 0.35)
        if valid_keypoints < 25:
            confidence *= 0.8
        return prediction, confidence
    except Exception as e:
        print(f"Error in pose classification: {e}")
        return None, 0.0

@app.route('/detect-pose', methods=['POST'])
def detect_pose():
    """Endpoint for pose detection and classification"""
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Read image data
        img_bytes = file.read()
        if len(img_bytes) == 0:
            return jsonify({'error': 'Empty image file'}), 400
        
        print(f"Received image: {len(img_bytes)} bytes")
        
        # Decode image
        nparr = np.frombuffer(img_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'error': 'Could not decode image'}), 400
        
        print(f"Image decoded: {image.shape}")
        
        # Extract keypoints
        keypoints, visibility, landmarks = extract_keypoints_from_image(image)
        
        if keypoints is None:
            return jsonify({
                'error': 'No pose detected in image',
                'keypoints': None,
                'pose_classification': None,
                'confidence': 0.0
            }), 200
        
        # Classify pose if classifier is loaded
        pose_name = None
        confidence = 0.0
        
        if pose_classifier is not None:
            pose_name, confidence = classify_pose(keypoints, visibility)
        
        # Convert landmarks to list for JSON serialization
        landmarks_list = []
        if landmarks:
            for landmark in landmarks.landmark:
                landmarks_list.append({
                    'x': landmark.x,
                    'y': landmark.y,
                    'z': landmark.z,
                    'visibility': landmark.visibility
                })
        
        response = {
            'keypoints': keypoints,
            'landmarks': landmarks_list,
            'pose_classification': pose_name,
            'confidence': confidence,
            'image_shape': image.shape
        }
        
        print(f"Pose detected: {pose_name} (confidence: {confidence:.2f})")
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in detect_pose: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    classifier_loaded = pose_classifier is not None
    return jsonify({
        'status': 'healthy',
        'classifier_loaded': classifier_loaded,
        'model_path': MODEL_PATH
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Yoga Pose AI Backend',
        'endpoints': {
            'detect_pose': '/detect-pose (POST)',
            'health': '/health (GET)'
        },
        'classifier_loaded': pose_classifier is not None
    })

if __name__ == '__main__':
    print("🚀 Starting Yoga Pose AI Backend...")
    
    # Load the classifier
    if load_classifier():
        print("✅ Backend ready with pose classification!")
    else:
        print("⚠️  Backend running without pose classification")
        print("   Train the model first: python train_pose_classifier.py")
    
    print("📡 Server starting on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000) 