import { ORM } from "../../system/core/ORM";

export class Cart extends ORM {
  quantity: number;
  productId: number;
  userId: number;
}
