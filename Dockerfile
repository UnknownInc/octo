FROM node:14

COPY package*.json /app/

WORKDIR /app
# You have to specify "--unsafe-perm" with npm install
# when running as root.  Failing to do this can cause
# install to appear to succeed even if a preinstall
# script fails, and may have other adverse consequences
# as well.
# This command will also cat the npm-debug.log file after the
# build, if it exists.
RUN npm ci --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

COPY uiapp/package*.json /app/uiapp/

WORKDIR /app/uiapp

RUN npm ci --unsafe-perm || \
  ((if [ -f npm-debug.log ]; then \
      cat npm-debug.log; \
    fi) && false)

COPY . /app/

RUN npm run build

WORKDIR /app

RUN npm run build
ENV NODE_ENV production
CMD npm start
