FROM python:3.10.13

# https://stackoverflow.com/questions/55313610/importerror-libgl-so-1-cannot-open-shared-object-file-no-such-file-or-directo
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

RUN mkdir /app
WORKDIR /app

COPY . .

RUN python -m pip install --upgrade pip
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt

EXPOSE 5000

CMD ["python", "app.py"]