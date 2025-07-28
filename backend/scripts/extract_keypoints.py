# import os
# import cv2
# import mediapipe as mp
# import csv

# # Path to your dataset
# DATASET_DIR = r"C:/Users/Raj/Desktop/New folder (12)/yoga-kaggle-dataset"
# OUTPUT_CSV = "yoga_keypoints.csv"

# mp_pose = mp.solutions.pose
# pose = mp_pose.Pose(static_image_mode=True)

# header = ['label']
# for i in range(33):
#     header += [f'x{i}', f'y{i}', f'z{i}', f'v{i}']

# rows = []

# for pose_name in os.listdir(DATASET_DIR):
#     pose_folder = os.path.join(DATASET_DIR, pose_name)
#     if not os.path.isdir(pose_folder):
#         continue
#     print(f"Processing pose: {pose_name}")
#     for img_name in os.listdir(pose_folder):
#         img_path = os.path.join(pose_folder, img_name)
#         try:
#             img = cv2.imread(img_path)
#             if img is None:
#                 print(f"Could not read image: {img_path}")
#                 continue
#             img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#             results = pose.process(img_rgb)
#             if results.pose_landmarks:
#                 row = [pose_name]
#                 for lm in results.pose_landmarks.landmark:
#                     row.extend([lm.x, lm.y, lm.z, lm.visibility])
#                 rows.append(row)
#             else:
#                 print(f"No pose detected in: {img_path}")
#         except Exception as e:
#             print(f"Error processing {img_path}: {e}")

# # Write to CSV
# with open(OUTPUT_CSV, 'w', newline='') as f:
#     writer = csv.writer(f)
#     writer.writerow(header)
#     writer.writerows(rows)

# print(f"Keypoints extraction complete! Saved to {OUTPUT_CSV}")
import os
import cv2
import mediapipe as mp
import csv

# Set this to your dataset folder (adjust as needed)
# DATASET_DIR = r"C:/Users/Raj/Desktop/New folder (12)/yoga-kaggle-dataset"
DATASET_DIR = r"C:/Users/Raj/Desktop/New folder (12)/yoga-dataset/dataset"
OUTPUT_CSV = "yoga_keypoints.csv"

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True)

header = ['label']
for i in range(33):
    header += [f'x{i}', f'y{i}', f'z{i}', f'v{i}']

rows = []

for pose_name in os.listdir(DATASET_DIR):
    pose_folder = os.path.join(DATASET_DIR, pose_name)
    if not os.path.isdir(pose_folder):
        continue
    print(f"Processing pose: {pose_name}")
    for img_name in os.listdir(pose_folder):
        # Only process image files
        if not img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue
        img_path = os.path.join(pose_folder, img_name)
        try:
            img = cv2.imread(img_path)
            if img is None:
                print(f"Could not read image: {img_path}")
                continue
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            results = pose.process(img_rgb)
            if results.pose_landmarks:
                row = [pose_name]
                for lm in results.pose_landmarks.landmark:
                    row.extend([lm.x, lm.y, lm.z, lm.visibility])
                rows.append(row)
            else:
                print(f"No pose detected in: {img_path}")
        except Exception as e:
            print(f"Error processing {img_path}: {e}")

# Write to CSV
with open(OUTPUT_CSV, 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print(f"Keypoints extraction complete! Saved to {OUTPUT_CSV}")