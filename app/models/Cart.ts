import { ORM } from "../../system/src/Database/ORM";

export class Cart extends ORM {
  quantity: number;
  productId: number;
  userId: number;
}
