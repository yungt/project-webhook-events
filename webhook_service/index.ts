import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL || "";
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Webhook Service is running!");
});

const getRandomInterval = () => Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
const mockEventType1 = {
  id: '',
  timestamp: '',
  event_type: "woof",
  payload: {
    actor: "platform_engineer",
  }
}

const mockEventType2 = {
  id: '',
  timestamp: '',
  event_type: "bark",
  payload: {
    actor: "data_engineer",
  }
}

const mockEventType3 = {
  id: '',
  timestamp: '',
  event_type: "bark",
  payload: {
    actor: "platform_engineer",
  }
}

const mockEventTypes = [mockEventType1, mockEventType2, mockEventType3];
const getRandomEventType = () => mockEventTypes[Math.floor(Math.random() * mockEventTypes.length)];
const generateMockData = () => (getRandomEventType());

const sendMockRequest = async () => {
  const data = generateMockData();
  data.id = uuidv4();
  data.timestamp = new Date().toISOString();
  try {
    console.log('Webhook POST data', data)
    await axios.post(WEBHOOK_URL, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log("Webhook sent successfully:", data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error sending webhook to ${WEBHOOK_URL}`, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

const startRandomRequests = () => {
  const interval = getRandomInterval();
  setTimeout(async () => {
    await sendMockRequest();
    startRandomRequests();
  }, interval);
};

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  startRandomRequests();
});