# Stage 1, "builder" based on Node.js, to build and compile the frontend.
FROM node:14 as builder
WORKDIR /app

COPY ./ /app/

RUN npm install
RUN npm run build

# Stage 2, based on Nginx, to take the compiled app and config, ready for production with Nginx.
FROM nginx:stable
ENV REACT_APP_NAME="DEFAULT APP NAME"

COPY ./addAppName.js /usr/share/script/
COPY ./entrypoint.sh /usr/share/script/

# Copy nginx configuration
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
# Copy react build
COPY --from=builder /app/build /usr/share/nginx/html

# Install node
ENV NODE_VERSION=16.13.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

EXPOSE 80

ENTRYPOINT [ "/usr/share/script/entrypoint.sh" ]