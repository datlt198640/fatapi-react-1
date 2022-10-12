from celery import Celery
from celery_config import broker_url, result_backend


celery = Celery(
    __name__,
    broker=broker_url,
    backend=result_backend,
    include=['user.utils']
)