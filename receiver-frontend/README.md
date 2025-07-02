# receiver-frontend
A web UI application (Typescript and NextJS) to display event data received by the receiver service.

### Run and build using docker

#### Build
```
docker -t receiver-frontend .
```

#### Run
```
docker run -p 3002:3002 --name receiver-frontend receiver-frontend
```

Open `http://localhost:3002` to view service

Alternatively, all services can be build and run using `docker-compose.yaml` in the root folder

### Run and build without docker
#### Build
```
npm run build
```

#### Run
```
npm run start
```

Port `3002` is already set in `package.json` `script`
#### Development
```
npm run dev
```

Open `http://localhost:3002` to view service

### 3rd Party Libraries
- Mantine https://mantine.dev/
- 