import { env } from "../system/util";

// local disk storage for development
const filesystemConfig = {
  default: env("FILESYSTEM_DRIVER", "local"),
  disks: {
    // default disk
    local: {
      driver: "local",
      root: "public/uploads",
    },
  },
};

export default filesystemConfig;
