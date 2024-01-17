FROM python:3.9

WORKDIR /app


COPY requirements.txt /app/
COPY . /app/

#RUN pip install --no-cache-dir -r requirements.txt

RUN python -m venv venv && . venv/bin/activate && pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

CMD ["python", "manage.py", "runserver", "0.0.0.0:8080", "--noreload"]

