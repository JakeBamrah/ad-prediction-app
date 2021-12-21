FROM amazon/aws-lambda-python:3.8.2021.09.29.18

RUN /var/lang/bin/python3.8 -m pip install --upgrade pip

COPY requirements.txt .

# AWS lambda's strict permissions will not allow numba to cache it's results
# inside it's library root directory. To bypass this we explicitly set the
# cache dir to something accessible ourselves.
# https://stackoverflow.com/questions/59290386/runtimeerror-at-cannot-cache-function-shear-dense-no-locator-available-fo
ENV NUMBA_CACHE_DIR=/tmp/numba_cache

RUN pip install -r requirements.txt

COPY src/ .

CMD ["app.handler"]
