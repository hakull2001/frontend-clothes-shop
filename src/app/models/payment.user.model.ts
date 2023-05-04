import { Model } from "./model";
import { User } from "./user.model";
export class PaymentUser extends Model {
    id: number;
    vnpAmount: string;
    vnpBankCode: string;
    vnpTxnref : string
    user : User;
    vnpOrderInfo: string;
    vnpPayDate: string;
    orderId: string;
    paymentStatus : number;
    createdAt?: Date;
    
    constructor(data: any) {
      super();
      this.fill(data);
    }
  }