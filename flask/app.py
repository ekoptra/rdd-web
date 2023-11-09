import os
from rq import Queue
from flask import Flask, request
from redis import Redis
from detector import detect_video
from dotenv import dotenv_values


app = Flask(__name__)
config = dotenv_values(".flaskenv")

q = Queue(connection=Redis(host=config['REDIS_URL'], port="6379"))

@app.route('/', methods=['GET'])
def home():
  return {"message": "Welcomee"}

@app.route('/', methods=['POST'])
def index():
    job_id = request.json['jobId']

    if job_id is None:
      return {'id': ""}

    job = q.enqueue(
            detect_video, job_timeout= "24h",
            args=(job_id,), result_ttl=0
      )
    return {'id': job.get_id()}
  
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)    
