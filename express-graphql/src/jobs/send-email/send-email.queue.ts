import { REDIS_CONNECTION } from "@/src/providers/cache/redis";
import { Job, Queue, QueueEvents, Worker } from "bullmq";
import { logger } from "../../lib/logger";
import cluster from "cluster";

// -- Queue
const sendEmailQueue = new Queue("send-email", {
  connection: REDIS_CONNECTION,
});

// -- Queue Events
const sendEmailQueueEvents = new QueueEvents("send-email", {
  connection: REDIS_CONNECTION,
});

if (cluster?.worker?.id === 1) {
  sendEmailQueueEvents.on("completed", ({ jobId, returnvalue }) => {
    console.log(`Job ${jobId} completed!`);
  });

  sendEmailQueueEvents.on("active", ({ jobId }) => {
    console.log(`Job ${jobId} is running..`);
  });

  sendEmailQueueEvents.on("failed", ({ jobId, failedReason }) => {
    logger.error(`Job ${jobId} failed! Reason: ${failedReason}`);
  });

  // -- Workers
  const emailProcess = new Worker(
    "send-email",
    require.resolve("./send-email.worker"),
    {
      connection: REDIS_CONNECTION,
      removeOnComplete: { count: 10 },
    }
  );

  // -- Worker Events
  emailProcess.on("ready", () => {
    console.log("E-mail worker ready.");
  });
}

export { sendEmailQueue, sendEmailQueueEvents };
