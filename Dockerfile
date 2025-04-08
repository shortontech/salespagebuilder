# Use the official Node 18 Alpine base image
FROM node:23-alpine

# Install Python and pip so we can install and run Semgrep for SAST
RUN apk add --no-cache python3 py3-pip pipx

# Install Semgrep
RUN pipx install semgrep

# Set the working directory
WORKDIR /app

# By default, do nothing. We'll override with "docker run" commands in the workflow.
CMD ["sh"]
