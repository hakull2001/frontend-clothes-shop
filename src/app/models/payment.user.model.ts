import { Model } from "./model";
export class PaymentUser extends Model {
    id: number;
    vnpAmount: string;
    vnpBankCode: string;
    vnpTxnref : string
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