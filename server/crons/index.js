import cronJobs from "node-cron"

/**
* Empty tmp folder from physical location
* Run @ Every morning 3:00 am
*
* @return Void
*/
cronJobs.schedule("0 * * * *", () => {
  console.log("cron job started ---------------")
});
