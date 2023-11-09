from sqlalchemy import Table, Column, Integer, String, JSON, Boolean, TIMESTAMP
from sqlalchemy import MetaData

metadata_obj = MetaData()

job_table = Table(
    "job",
    metadata_obj,
    Column("id", String, primary_key=True, nullable=False),
    Column("status", String, nullable=False),
    Column("model_name", String, nullable=False),
    Column("id_video", String, nullable=False),
    Column("result", JSON, nullable=True),
    Column("name", String, nullable=False),
    Column("show_conf", Boolean, nullable=False),
    Column("show_labels", Boolean, nullable=False),
    Column("conf", Integer, nullable=False),
    Column("started_at", TIMESTAMP, nullable=True),
    Column("finished_at", TIMESTAMP, nullable=True)
)

video_table = Table(
    "video",
    metadata_obj,
    Column("id", String, primary_key=True, nullable=False),
    Column("name", String, nullable=False),
    Column("path", String, nullable=False),
    Column("id_user", String, nullable=False),
)