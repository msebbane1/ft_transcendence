FROM python:3.9

WORKDIR /app

COPY . /app/

RUN python -m venv venv && . venv/bin/activate && pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python", "manage.py", "runsslserver", "0.0.0.0:8080", "--cert", "/app/nginx.crt", "--key", "/app/nginx.key", "--noreload"]

