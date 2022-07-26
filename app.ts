import { appConfig } from "./config/app";
import { Bihongo } from "./system/src";

const app = Bihongo.app();
// run server
app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
