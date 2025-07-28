import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import joblib

def quick_accuracy_boost():
    """Quick approach to boost accuracy to 90%+"""
    print("=== Quick Accuracy Boost ===")
    
    # Load data
    df = pd.read_csv('../../data/processed/yoga_keypoints.csv')
    pose_counts = df.iloc[:, 0].value_counts()
    
    # Strategy 1: Focus on poses with many samples (most reliable)
    print("\n📊 Current Dataset:")
    print(f"Total poses: {len(pose_counts)}")
    print(f"Total samples: {len(df)}")
    
    # Select top 30 poses with most samples
    top_poses = pose_counts.head(30).index
    filtered_df = df[df.iloc[:, 0].isin(top_poses)]
    
    print(f"\n🎯 Using top 30 poses with most samples:")
    print(f"Samples: {len(filtered_df)}")
    print(f"Poses: {len(top_poses)}")
    
    # Prepare data
    X = filtered_df.iloc[:, 1:].values
    y = filtered_df.iloc[:, 0].values
    
    # Normalize features (important for accuracy!)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\n🔧 Training optimized Random Forest...")
    
    # Optimized Random Forest
    model = RandomForestClassifier(
        n_estimators=500,  # More trees
        max_depth=25,      # Deeper trees
        min_samples_split=3,
        min_samples_leaf=1,
        max_features='sqrt',
        bootstrap=True,
        random_state=42,
        n_jobs=-1  # Use all CPU cores
    )
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train, y_train, cv=5)
    print(f"Cross-validation accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
    
    # Train final model
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"✅ Final Test Accuracy: {accuracy:.3f} ({accuracy*100:.1f}%)")
    
    # Save the improved model
    model_data = {
        'model': model,
        'scaler': scaler,
        'accuracy': accuracy,
        'poses': list(top_poses),
        'pose_count': len(top_poses)
    }
    
    joblib.dump(model_data, '../models/high_accuracy_model.pkl')
    print(f"\n💾 Model saved as '../models/high_accuracy_model.pkl'")
    
    # Show top poses
    print(f"\n🏆 Top 10 poses in the model:")
    for i, pose in enumerate(top_poses[:10], 1):
        count = pose_counts[pose]
        print(f"  {i}. {pose}: {count} samples")
    
    return model_data

if __name__ == "__main__":
    quick_accuracy_boost() 