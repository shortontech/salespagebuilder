# Use the official Node 18 Alpine base image
FROM node:23-alpine

# Install Python and pip so we can install and run Semgrep for SAST
RUN apk add --no-cache python3 py3-pip

# Install Semgrep
RUN pip3 install --no-cache-dir semgrep

# Set the working directory
WORKDIR /app

# By default, do nothing. We'll override with "docker run" commands in the workflow.
CMD ["sh"]
