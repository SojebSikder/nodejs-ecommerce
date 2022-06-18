import { appConfig } from "../config/app";

test("port number", () => {
  expect(Number(appConfig.port)).toBe(3000);
});
