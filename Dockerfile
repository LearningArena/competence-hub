## Build dotnet app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS dotnet-build
WORKDIR /app

COPY ./backend/ ./
COPY ./backend_structs/ ./
COPY ./backend_extapi/ ./

# Run restore
RUN dotnet restore --interactive

# Build app
RUN dotnet build --configuration Release
RUN dotnet publish --configuration Release --no-build --output out

# Install dotnet EF tools, set path to run them and create migrations
# SQL script. We need to set the POSTGRES_{x} variables for dotnet ef
# to work (due to our code), we set them to dummies since they are not
# used
RUN dotnet tool install --global dotnet-ef
ENV PATH="/root/.dotnet/tools:${PATH}"
ENV POSTGRES_HOST=x \
    POSTGRES_PORT=x \
    POSTGRES_DB=x \
    POSTGRES_USER=x \
    POSTGRES_PASSWORD=x
RUN dotnet ef migrations script --idempotent --output out/migrations.sql


## Build frontend
FROM node:14-alpine3.16 AS node-build
WORKDIR /frontend

COPY ./frontend ./

# Run npm
ARG DOMAIN=localhost:8000
ENV REACT_APP_DOMAIN=$DOMAIN
ENV REACT_APP_SERVICE_NAME=CompetenceHub
ENV REACT_APP_GQL_URL=/graphql
RUN npm install
RUN npm run build


## Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

# In order to run migrations, we need psql
RUN apt-get update && apt-get install -y postgresql-client

# Copy artifacts from previous steps to this image
WORKDIR /app
COPY ./wwwroot /wwwroot/
COPY ./devzone /devzone/
COPY --from=dotnet-build /app/out .
COPY --from=node-build /frontend/build /wwwroot/
COPY ./run.sh .

EXPOSE 8000

CMD ["./run.sh"]
