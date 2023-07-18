import { ApiService } from "@/api/api-service";

/*
  NOTE: this file serves only as an example and is not used.
  You can remove it altogether or repurpose it by changing its name.
  Learn more about our networking architecture on:
  https://blog.xmartlabs.com/2020/07/09/frontend-architecture-and-best-practices/
*/

interface IExample {}

class Example {
  static async getExamples(): Promise<IExample[]> {
    const response = await ApiService.get<IExample[]>("example-route");
    return response.data || [];
  }

  static createExample(example: IExample) {
    return ApiService.post("example-route", {
      example,
    });
  }
}

export { Example };
