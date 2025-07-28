import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_dataset(csv_file='../../data/processed/yoga_keypoints.csv'):
    """Analyze the current dataset and provide improvement recommendations"""
    print("=== Dataset Analysis ===")
    
    # Load the data
    df = pd.read_csv(csv_file)
    
    # Analyze pose distribution
    pose_counts = df.iloc[:, 0].value_counts()
    print(f"\n📊 Dataset Statistics:")
    print(f"Total samples: {len(df)}")
    print(f"Number of poses: {len(pose_counts)}")
    print(f"Average samples per pose: {len(df) / len(pose_counts):.1f}")
    
    # Find poses with few samples
    low_samples = pose_counts[pose_counts < 10]
    print(f"\n⚠️  Poses with <10 samples ({len(low_samples)} poses):")
    for pose, count in low_samples.items():
        print(f"  {pose}: {count} samples")
    
    # Find poses with many samples
    high_samples = pose_counts[pose_counts > 50]
    print(f"\n✅ Poses with >50 samples ({len(high_samples)} poses):")
    for pose, count in high_samples.head(10).items():
        print(f"  {pose}: {count} samples")
    
    return df, pose_counts

def train_improved_models(df, pose_counts):
    """Train multiple models to find the best one"""
    print("\n=== Training Improved Models ===")
    
    # Filter out poses with very few samples (<5)
    valid_poses = pose_counts[pose_counts >= 5].index
    filtered_df = df[df.iloc[:, 0].isin(valid_poses)]
    
    print(f"Using {len(filtered_df)} samples from {len(valid_poses)} poses")
    
    # Prepare data
    X = filtered_df.iloc[:, 1:].values
    y = filtered_df.iloc[:, 0].values
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train multiple models
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=200, max_depth=8, random_state=42),
        'SVM': SVC(kernel='rbf', C=10, gamma='scale', random_state=42)
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        results[name] = accuracy
        print(f"{name} Accuracy: {accuracy:.3f}")
    
    # Find best model
    best_model_name = max(results, key=results.get)
    best_model = models[best_model_name]
    
    print(f"\n🏆 Best Model: {best_model_name} ({results[best_model_name]:.3f})")
    
    return best_model, results

def create_enhanced_dataset_recommendations():
    """Provide recommendations for creating a better dataset"""
    print("\n=== Dataset Enhancement Recommendations ===")
    
    recommendations = [
        "1. 📸 Collect More Data:",
        "   - Aim for 50-100 samples per pose",
        "   - Use different angles (front, side, 45°)",
        "   - Include different body types and sizes",
        "   - Vary lighting conditions",
        "",
        "2. 🎯 Focus on Common Poses:",
        "   - Start with 20-30 most common yoga poses",
        "   - Ensure each pose has at least 30 samples",
        "   - Remove poses with <5 samples",
        "",
        "3. 📱 Data Collection Tips:",
        "   - Use consistent camera distance (3-6 feet)",
        "   - Ensure full body is visible",
        "   - Good lighting on entire body",
        "   - Clean, uncluttered background",
        "   - Multiple people performing same poses",
        "",
        "4. 🔄 Data Augmentation:",
        "   - Mirror/flip existing images",
        "   - Slight rotations (±10°)",
        "   - Brightness/contrast variations",
        "   - Add noise to keypoints",
        "",
        "5. 🎨 Quality Control:",
        "   - Remove blurry or unclear images",
        "   - Ensure poses are correctly labeled",
        "   - Check for consistent pose execution",
        "   - Validate keypoint extraction quality"
    ]
    
    for rec in recommendations:
        print(rec)

def generate_improved_training_script():
    """Generate an improved training script"""
    script_content = '''import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import StandardScaler
import joblib
import os

def train_high_accuracy_model(csv_file='yoga_keypoints.csv', model_file='high_accuracy_pose_classifier.pkl'):
    """
    Train a high-accuracy pose classifier with improved preprocessing
    """
    print("=== High Accuracy Model Training ===")
    
    # Load and preprocess data
    df = pd.read_csv(csv_file)
    
    # Filter poses with sufficient samples
    pose_counts = df.iloc[:, 0].value_counts()
    valid_poses = pose_counts[pose_counts >= 10].index  # At least 10 samples per pose
    filtered_df = df[df.iloc[:, 0].isin(valid_poses)]
    
    print(f"Using {len(filtered_df)} samples from {len(valid_poses)} poses")
    
    # Prepare features and labels
    X = filtered_df.iloc[:, 1:].values
    y = filtered_df.iloc[:, 0].values
    
    # Normalize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train multiple models
    models = {
        'Random Forest': RandomForestClassifier(
            n_estimators=300, 
            max_depth=20, 
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        ),
        'Gradient Boosting': GradientBoostingClassifier(
            n_estimators=300,
            max_depth=10,
            learning_rate=0.1,
            subsample=0.8,
            random_state=42
        )
    }
    
    best_model = None
    best_accuracy = 0
    
    for name, model in models.items():
        print(f"\\nTraining {name}...")
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train, y_train, cv=5)
        print(f"Cross-validation accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
        
        # Train on full training set
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"Test accuracy: {accuracy:.3f}")
        
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_model = model
    
    # Save the best model and scaler
    model_data = {
        'model': best_model,
        'scaler': scaler,
        'accuracy': best_accuracy,
        'poses': list(valid_poses)
    }
    
    joblib.dump(model_data, model_file)
    print(f"\\n✅ Best model saved with {best_accuracy:.3f} accuracy")
    
    return model_data

if __name__ == "__main__":
    train_high_accuracy_model()
'''
    
    with open('train_high_accuracy.py', 'w') as f:
        f.write(script_content)
    
    print("✅ Generated 'train_high_accuracy.py' script")

if __name__ == "__main__":
    # Analyze current dataset
    df, pose_counts = analyze_dataset()
    
    # Train improved models
    best_model, results = train_improved_models(df, pose_counts)
    
    # Provide recommendations
    create_enhanced_dataset_recommendations()
    
    # Generate improved training script
    generate_improved_training_script()
    
    print("\n=== Next Steps ===")
    print("1. Run: python train_high_accuracy.py")
    print("2. Collect more data for poses with <10 samples")
    print("3. Focus on 20-30 most common poses")
    print("4. Ensure consistent pose execution")
    print("5. Use the new high-accuracy model in your backend") 