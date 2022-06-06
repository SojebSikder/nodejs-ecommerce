import { test } from "uvu";
import assert from "uvu/assert";

import { appConfig } from "../config/app";

test("port number", () => {
  assert.is(Number(appConfig.port), 3000);
});

test.run();
