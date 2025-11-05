import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor("customers")
export class CustomersProcessor extends WorkerHost {
  async process(job: Job): Promise<void> {
    if (job.name === "customer_created") {
      console.log("Processed job:", job.name, job.data);
    }
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job | undefined, err: Error) {
    console.error("Job failed", job?.name, err.message);
  }
}
