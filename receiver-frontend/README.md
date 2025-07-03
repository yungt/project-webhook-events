# receiver-frontend
A web UI application (Typescript and Next.js) to display event data received by the receiver service.
This application subscribes to receiver-service to obtain webhook event data.

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

#### Test
```
npm run test
```

#### Build
```
npm run build
```
Notes: `prebuild` also triggers `test`

#### Run
```
npm run start -p 3002
```

#### Development
```
npm run dev -p 3002
```

Open `http://localhost:3002` to view service

### 3rd Party Libraries
- UI Components: https://mantine.dev/