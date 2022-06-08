import { Command } from "../system";
import { Inspiring } from "../system/Inspire";

// custom command
Command.set("inspire", function () {
  Command.comment(Inspiring.quote());
}).describe("Display an inspiration quote");
