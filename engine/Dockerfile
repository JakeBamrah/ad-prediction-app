FROM amazon/aws-lambda-python:3.8.2021.09.29.18

RUN /var/lang/bin/python3.8 -m pip install --upgrade pip

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY src/ .

COPY data/ .
RUN ls .

# update permissions to compensate for aws lambda's limited default permissions
RUN chmod 744 $(find . -type f)

CMD ["app.handler"]
