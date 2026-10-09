# RTK Query API Setup - Usage Guide

## Overview
RTK Query setup complete hai with automatic token injection. Jab bhi aap authenticated API call karenge, token automatically header mein add ho jayega.

## Basic Usage

### 1. Component mein API call karna

```tsx
'use client';

import { useGetProductsQuery, useCreateProductMutation } from '@/store/api/products';

export default function ProductsPage() {
  // Query - automatically fetches data
  const { data, isLoading, error } = useGetProductsQuery({ page: 1, limit: 10 });
  
  // Mutation - for POST/PUT/DELETE
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const handleCreate = async () => {
    try {
      const result = await createProduct({
        name: 'New Product',
        price: 100,
      }).unwrap();
      console.log('Product created:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

### 2. Naya API slice banana

```tsx
// src/store/api/myFeature/myFeatureApi.ts
import { baseApi } from '../baseApi';

export const myApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET request - token auto-add hoga
    getData: builder.query({
      query: (id: string) => ({
        url: `/data/${id}`,
        method: 'GET',
      }),
    }),

    // POST request - token auto-add hoga
    createData: builder.mutation({
      query: (data: { name: string }) => ({
        url: '/data',
        method: 'POST',
        body: data,
      }),
    }),

    // PUT request
    updateData: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/data/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),

    // DELETE request
    deleteData: builder.mutation({
      query: (id: string) => ({
        url: `/data/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Hooks export karo
export const {
  useGetDataQuery,
  useCreateDataMutation,
  useUpdateDataMutation,
  useDeleteDataMutation,
} = myApi;
```

### 3. Query parameters ke saath

```tsx
// API slice mein
getFilteredData: builder.query({
  query: (params: { category?: string; page?: number }) => ({
    url: '/data',
    method: 'GET',
    params, // RTK Query automatically converts to query string
  }),
}),

// Component mein
const { data } = useGetFilteredDataQuery({ 
  category: 'electronics', 
  page: 1 
});
```

### 4. Environment Variable Setup

`.env.local` file mein API URL add karo:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com/api
```

Agar environment variable nahi hai, to default `http://localhost:3000/api` use hoga.

## Important Points

1. **Automatic Token Injection**: Har authenticated request mein token automatically add hota hai from `localStorage.getItem('auth_token')`

2. **Token Format**: Token `Authorization: Bearer <token>` format mein header mein jata hai

3. **No Manual Token Handling**: Aapko manually token add karne ki zarurat nahi hai

4. **401 Handling**: Agar 401 error aata hai, to aap `baseApi.ts` mein refresh token logic add kar sakte ho

## Example: Complete API Slice

```tsx
import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile (requires auth)
    getUserProfile: builder.query({
      query: () => ({
        url: '/user/profile',
        method: 'GET',
      }),
    }),

    // Update user profile (requires auth)
    updateUserProfile: builder.mutation({
      query: (profileData: { name?: string; email?: string }) => ({
        url: '/user/profile',
        method: 'PUT',
        body: profileData,
      }),
    }),

    // Get user orders (requires auth)
    getUserOrders: builder.query({
      query: (params?: { status?: string; page?: number }) => ({
        url: '/user/orders',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserOrdersQuery,
} = userApi;
```

## Troubleshooting

1. **Token nahi ja raha?**: Check karo ki `localStorage` mein `auth_token` key exist karti hai
2. **CORS Error?**: Backend mein CORS headers properly set hone chahiye
3. **401 Error?**: Token invalid ho sakta hai, login karke naya token le lo

