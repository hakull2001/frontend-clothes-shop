import { map } from "rxjs/operators";
import HttpService, { PaginationOption, ResponseResult } from "@core/services/http/http.service";
import { ProductRate, ProductRateDto } from "@app/models/product-rate.model";



class _ProductRateService {
  public createReview(productRateDto: ProductRateDto) {
    const formData = {
      productId: productRateDto.productId,
      value: productRateDto.value,
      comment : productRateDto.comment
    };

    return HttpService.post("/product-rates", {
      body: formData
    }).pipe(map<any, ProductRate>((response) => response.result.data));
  }

  public getProductRate(productId: number) {
    return HttpService.get(`/product-rates/detail/?productId=${productId}`).pipe(
      map<any, ProductRate[]>((response) => response.result.data)
    );
  }

  public getList(productId : number) {
    return HttpService.get(`/product-rates/?productId=${productId}`, {
    }).pipe(map<any, any>((response) => response.result));
  }
}

const ProductRateService = new _ProductRateService();
export default ProductRateService;
