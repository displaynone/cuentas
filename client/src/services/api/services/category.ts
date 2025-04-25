import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { Role } from "../types/role";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";
import { Category } from "../types/category";

export type CategoriesRequest = {
  page: number;
  limit: number;
  filters?: {
    roles?: Role[];
  };
  sort?: Array<{
    orderBy: keyof Category;
    order: SortEnum;
  }>;
};

export type CategoriesResponse = InfinityPaginationType<Category>;

export function useGetCategoriesService() {
  const fetch = useFetch();

  return useCallback(
    (data: CategoriesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/categories`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.filters) {
        requestUrl.searchParams.append("filters", JSON.stringify(data.filters));
      }
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CategoriesResponse>);
    },
    [fetch]
  );
}

export type CategoryRequest = {
  id: Category["id"];
};

export type CategoryResponse = Category;

export function useGetCategoryService() {
  const fetch = useFetch();

  return useCallback(
    (data: CategoryRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/categories/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CategoryResponse>);
    },
    [fetch]
  );
}

export type CategoryPostRequest = Pick<
  Category,
  "name" | "description" | "match"
>;

export type CategoryPostResponse = Category;

export function usePostCategoryService() {
  const fetch = useFetch();

  return useCallback(
    (data: CategoryPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/categories`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CategoryPostResponse>);
    },
    [fetch]
  );
}

export function usePostCategoriesService() {
  const fetch = useFetch();

  return useCallback(
    (data: CategoryPostRequest[], requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/categories/import`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CategoryPostResponse>);
    },
    [fetch]
  );
}

export type CategoryPatchRequest = {
  id: Category["id"];
  data: Partial<CategoryPostRequest>;
};

export type CategoryPatchResponse = Category;

export function usePatchCategoryService() {
  const fetch = useFetch();

  return useCallback(
    (data: CategoryPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/categories/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CategoryPatchResponse>);
    },
    [fetch]
  );
}

export type CategoriesDeleteRequest = {
  name: Category["name"];
};

export type CategoriesDeleteResponse = undefined;

export function useDeleteCategoriesService() {
  const fetch = useFetch();

  return useCallback(
    (data: CategoriesDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/categories/${data.name}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CategoriesDeleteResponse>);
    },
    [fetch]
  );
}
