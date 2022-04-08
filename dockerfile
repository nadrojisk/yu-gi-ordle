FROM python:latest
COPY . /app
WORKDIR /app
ENTRYPOINT ["python"]
EXPOSE 7000
CMD python -m http.server 7000