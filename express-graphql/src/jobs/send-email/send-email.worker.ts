import { SandboxedJob } from "bullmq";
import { prisma } from "../../providers/database/prisma";

module.exports = async (job: SandboxedJob) => {
  // Do something with job
  console.log("sandboxed");
  const data = await prisma.housekeeper.findMany();
  console.log(data);

  let operations = 0;

  // Fibonacci calculation function
  function fibonacci(num: number): number {
    operations++;
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
  }

  // Start the time
  const start = Date.now();

  // You can set the parameter value depending on your hardware capacity.
  // Be careful, this number exponentially increases the number of operations required
  const fibNum = fibonacci(45);

  // Calculate elapsed time
  const elapsedSeconds = (Date.now() - start) / 1000;
  const used = process.memoryUsage().heapUsed / 1024 / 1024;

  console.log(`Time elapsed: ${elapsedSeconds} seconds`);
  console.log(`Memory used: ${Math.round(used * 100) / 100} MB`);
};
