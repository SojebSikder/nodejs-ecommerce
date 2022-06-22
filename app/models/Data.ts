import { column, ORM } from "../../system/core/ORM";

export class Data extends ORM {
  @column()
  title: string;
  @column()
  text: string;

  // define custom table name like this:
  // constructor() {
  //   super("table_name");
  // }
}
