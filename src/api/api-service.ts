import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

import { constants } from "@/config/constants";
import { ApiError } from "@/api/api-error";

enum HttpMethod {
  Get = "get",
  Post = "post",
  Patch = "patch",
  Put = "put",
  Delete = "delete",
}

type Headers = {
  [key: string]: string;
};

type ApiServiceConfig = AxiosRequestConfig & {
  body?: {
    [key: string]: unknown;
  };
};

class ApiServiceClass {
  axios: AxiosInstance;

  private addedHeaders: Headers;

  constructor(url?: string) {
    this.axios = axios.create({
      baseURL: url ? url : constants.apiBaseURL,
    });
    this.addedHeaders = {};
  }

  async _sendRequest<ReturnType>(method: HttpMethod, url: string, config: ApiServiceConfig = {}) {
    try {
      const updatedConfig = { ...config };
      updatedConfig.headers = {
        ...this.addedHeaders,
        ...(config.headers || {}),
      };
      if (method === HttpMethod.Get || method === HttpMethod.Delete) {
        return await this.axios[method]<ReturnType>(url, updatedConfig);
      }
      const body = updatedConfig.body || {};
      delete updatedConfig.body;
      return await this.axios[method]<ReturnType>(url, body, updatedConfig);
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response && error.response.data) {
        throw new ApiError({
          message: error.message,
          statusCode: error.response.status,
        });
      }
      throw new ApiError({
        message: error.message,
        statusCode: null,
      });
    }
  }

  setHeaders(newHeaders: Headers) {
    Object.assign(this.addedHeaders, newHeaders);
  }

  get<ReturnType>(url: string, params = {}, config = {}) {
    return this._sendRequest<ReturnType>(HttpMethod.Get, url, {
      ...config,
      params,
    });
  }

  post<ReturnType>(url: string, body = {}, config = {}) {
    return this._sendRequest<ReturnType>(HttpMethod.Post, url, {
      ...config,
      body,
    });
  }

  patch<ReturnType>(url: string, body = {}, config = {}) {
    return this._sendRequest<ReturnType>(HttpMethod.Patch, url, {
      ...config,
      body,
    });
  }

  put<ReturnType>(url: string, body = {}, config = {}) {
    return this._sendRequest<ReturnType>(HttpMethod.Put, url, {
      ...config,
      body,
    });
  }

  delete<ReturnType>(url: string, params = {}, config = {}) {
    return this._sendRequest<ReturnType>(HttpMethod.Delete, url, {
      ...config,
      params,
    });
  }
}

const ApiService = new ApiServiceClass();

export { ApiService, HttpMethod };
