import os
from metadata import job_table, video_table
from sqlalchemy import create_engine, select, update
import time
from ultralytics import YOLO
import cv2
import moviepy.editor as moviepy
from dotenv import dotenv_values

config = dotenv_values(".flaskenv")

engine = create_engine(config['DATABASE_URL'])
app_env = config['APP_ENV']

absolute_path = os.path.abspath("")

mapping_model = {
    "YOLOv8-Medium": os.path.join(absolute_path, "model", 'YOLOv8_Japan.pt') 
}

def get_job(id):
  stmt = select(job_table).where(job_table.c.id == id)
  
  with engine.connect() as conn:
    for row in conn.execute(stmt):
        return row
      
def get_video(id):
  stmt = select(video_table).where(video_table.c.id == id)
  
  with engine.connect() as conn:
    for row in conn.execute(stmt):
        return row
      
def update_data_job(id, data):
  stmt = (
      update(job_table)
      .where(job_table.c.id == id)
      .values(**data)
  )

  with engine.begin() as conn:
      conn.execute(stmt)

def detect_video(id):
  job = get_job(id)
  status = job[1]
  
  
  if status != "PENDING":
    return
  
  modelName = job[2]
  videoId = job[3]
  
  video = get_video(videoId)
  video_name = f"{video[2]}"
    
  print("====================")
  print(f"Detecting Job: {job[5]} ({modelName}) - {job[0]}")
  print("====================")
  
  update_data_job(id, {
    "status": "DETECTING",
    "started_at": time.strftime('%Y-%m-%d %H:%M:%S')
  })
  
  if app_env != 'production':  
    path_app = '/'.join(absolute_path.split("/")[:-1])
    path_video = os.path.join(path_app, 'rdd-web', 'public', 'videos', video_name)
    path_project = os.path.join(path_app, 'rdd-web', 'public', 'detections')
  else:
    path_app = absolute_path
    path_video = os.path.join(path_app, 'videos', video_name)
    path_project = os.path.join(path_app, 'detections')
  
  
  results = detect(
      model=modelName, 
      path_video=path_video,
      video_name=".".join(video_name.split(".")[:-1]),
      configuration={
          "project": path_project, "name": id, 
          "show_conf": job[6], "show_labels": job[7], 
          "conf": job[8]
      }
  )
  
  update_data_job(id, {
    "status": "DETECTED",
    "finished_at": time.strftime('%Y-%m-%d %H:%M:%S'),
    "result": results
  })
  
  
  
def detect(model, path_video, configuration, video_name):
    model_path = mapping_model.get(model, None)

    if model_path is None:
        raise Exception("Model not found")

    model = YOLO(model_path)

    results = model.predict(path_video, stream=True, save=True, **configuration)

    save_crops_folder = os.path.join(configuration['project'], configuration['name'], 'crops')
    detections = []
    number_of_detection = 0
    
    cam = cv2.VideoCapture(path_video)
    fps = cam.get(cv2.CAP_PROP_FPS)

    start_time = time.time()
    for i, frame in enumerate(results):
      
        detection_json = []

        for f in frame:
            temp = eval(f.tojson())[0]        

            number_of_detection += 1
            crop_file_name = f"detection_{number_of_detection}"
            f.save_crop(save_crops_folder, file_name=crop_file_name)

            temp['crop_file_name'] = os.path.join('crops', temp['name'], f"{crop_file_name}.jpg")

            detection_json.append(temp)
        
        detections.append(detection_json)
    detection_time = time.time() - start_time

    # ============ Post Preprocessing ==================
    

    seconds = []

    per_second = []

    for i, detection in enumerate(detections):
        i = i + 1
        per_second.append(detection)

        if i % fps == 0:
            seconds.append(per_second)
            per_second = []
        
        if (i == len(detections)) and (len(per_second) != 0):
            seconds.append(per_second)

    # Break per seconds
    detail = []
    total_detection = 0

    for i, second in enumerate(seconds):
        detail_per_second = {
            "second_to_total": i,
            "second": i % 60,
            "minute": i // 60,
            "hour": i // 3600
        }

        detail_per_frame = []
        total_detection_in_second = 0

        for j, frame in enumerate(second):
            total_detection_in_second += len(frame)

            detail_per_frame.append({
                "frame": j + 1,
                "total_detection": len(frame),
                "detections": frame
            })

        detail_per_second['total_detection'] = total_detection_in_second
        detail_per_second['per_frame'] = detail_per_frame

        total_detection += total_detection_in_second

        detail.append(detail_per_second)
    
    # Sparse
    sparse = []
    for d in detail:
        for f in d['per_frame']:
            for t in f['detections']:
                sparse.append({
                    'second_to_total': d['second_to_total'],
                    'second': d['second'],
                    'minute': d['minute'],
                    'hour': d['hour'],
                    'frame': f['frame'],
                    'name': t['name'],
                    "confidence": t['confidence'],
                    "crop_file_name": t['crop_file_name']
                })
    
    path = os.path.join(configuration['project'], configuration['name'])
    clip = moviepy.VideoFileClip(f"{path}/{video_name}.avi")
    clip.write_videofile(f"{path}/{video_name}.mp4")
    
    return {
        "video_name": video_name,
        "fps": fps,
        "total_frame": len(detections),
        "total_detection": total_detection,
        "per_second": detail,
        "detection_time": detection_time,
        "sparse": sparse
    }

  



        
  