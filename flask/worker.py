import os
import redis
from rq import Worker, Queue, Connection
from dotenv import dotenv_values

config = dotenv_values(".flaskenv")

listen = ['default']

redis_url = config['REDIS_FULL_URL']

conn = redis.from_url(redis_url)

if __name__ == '__main__':
    with Connection(conn):
      worker = Worker(list(map(Queue, listen)))
      worker.work()