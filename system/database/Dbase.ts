import { IAdapter } from "../database/drivers/iAdapter";
export class Dbase {
  protected adapter: IAdapter;

  constructor(adapter: IAdapter) {
    this.adapter = adapter;
  }

  // Select or Read data
  public select = async(query) => {
    return await this.adapter.select(query);
  };

  // Select or Read single data
  public selectOne(query) {
    return this.adapter.selectOne(query);
  }

  // Insert data
  public insert(query) {
    return this.adapter.insert(query);
  }

  // Update data
  public update(query) {
    return this.adapter.update(query);
  }

  // Delete data
  public delete(query) {
    return this.adapter.delete(query);
  }

  // Statement data
  public statement(query) {
    return this.adapter.statement(query);
  }
}
