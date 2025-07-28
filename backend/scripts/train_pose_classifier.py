import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

def train_pose_classifier(csv_file='../../data/processed/yoga_keypoints.csv', model_file='../models/pose_classifier.pkl'):
    """
    Train a pose classifier using extracted keypoints data
    """
    print("Loading keypoints data...")
    
    # Load the CSV file
    try:
        df = pd.read_csv(csv_file)
        print(f"Loaded {len(df)} samples with {len(df.columns)-1} features")
    except FileNotFoundError:
        print(f"Error: {csv_file} not found!")
        print("Make sure you've run extract_keypoints.py first and the CSV file exists.")
        return None
    
    # Check if we have enough data
    if len(df) < 10:
        print("Warning: Very few samples found. You may need more data for good classification.")
    
    # Separate features (keypoints) and labels (pose names)
    # The first column should be the pose label, rest are keypoints
    X = df.iloc[:, 1:].values  # All columns except the first (pose label)
    y = df.iloc[:, 0].values   # First column (pose label)
    
    print(f"Features shape: {X.shape}")
    print(f"Labels shape: {y.shape}")
    print(f"Unique poses: {len(np.unique(y))}")
    print("Pose classes:", np.unique(y))
    
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")
    
    # Train a Random Forest classifier
    print("\nTraining Random Forest classifier...")
    classifier = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1  # Use all CPU cores
    )
    
    classifier.fit(X_train, y_train)
    
    # Make predictions on test set
    y_pred = classifier.predict(X_test)
    
    # Evaluate the model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.2f}")
    
    # Detailed classification report
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance (which keypoints are most important)
    feature_importance = classifier.feature_importances_
    print(f"\nTop 10 most important keypoints:")
    top_features = np.argsort(feature_importance)[-10:]
    for i, feature_idx in enumerate(reversed(top_features)):
        print(f"  {i+1}. Keypoint {feature_idx}: {feature_importance[feature_idx]:.4f}")
    
    # Save the trained model
    print(f"\nSaving model to {model_file}...")
    joblib.dump(classifier, model_file)
    print("Model saved successfully!")
    
    return classifier

def test_model_on_sample(model_file='../models/pose_classifier.pkl', csv_file='../../data/processed/yoga_keypoints.csv'):
    """
    Test the trained model on a few samples
    """
    if not os.path.exists(model_file):
        print(f"Model file {model_file} not found!")
        return
    
    print("\nTesting model on sample data...")
    
    # Load the model
    classifier = joblib.load(model_file)
    
    # Load some test data
    df = pd.read_csv(csv_file)
    X_sample = df.iloc[:5, 1:].values  # First 5 samples
    y_sample = df.iloc[:5, 0].values
    
    # Make predictions
    predictions = classifier.predict(X_sample)
    
    print("\nSample Predictions:")
    for i, (true_label, pred_label) in enumerate(zip(y_sample, predictions)):
        status = "✓" if true_label == pred_label else "✗"
        print(f"  {i+1}. True: {true_label} | Predicted: {pred_label} {status}")

if __name__ == "__main__":
    print("=== Yoga Pose Classifier Training ===")
    
    # Train the classifier
    model = train_pose_classifier()
    
    if model is not None:
        # Test the model
        test_model_on_sample()
        
        print("\n=== Training Complete! ===")
        print("Next steps:")
        print("1. The model is saved as 'pose_classifier.pkl'")
        print("2. You can now integrate this model into your Flask backend")
        print("3. The model will classify poses based on MediaPipe keypoints")
    else:
        print("\nTraining failed. Please check your data and try again.") 