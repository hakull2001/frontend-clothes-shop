import { map } from "rxjs/operators";
import HttpService, {
  PaginationOption,
  ResponseResult,
} from "@core/services/http/http.service";

class _PaymentUserService {
    public getList(options?: PaginationOption) {
        return HttpService.get("/payment", {
          queryParams: { ...options },
        }).pipe(map<any, ResponseResult>((response) => response.result));
      }
    
      public getTotalPayment(){
        return HttpService.get("/payment/total")
        .pipe(map<any, ResponseResult>((response) => response));      }
}


const PaymentUserService = new _PaymentUserService();
export default PaymentUserService;
