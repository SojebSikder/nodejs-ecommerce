import { belongsTo, column, ORM } from "../../system/core/ORM";

export class Cart extends ORM {
  @column()
  quantity: number;
  @column()
  productId: number;
  @column()
  userId: number;

  @belongsTo({
    relationTable: "product",
    foreignKey: "user_id",
    localKey: "id",
  })
  product;
}
