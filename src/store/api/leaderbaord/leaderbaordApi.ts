import { baseApi } from '../baseApi';
import type {
  LeaderboardApiResponse,
  LeaderboardQueryParams,
  LeaderboardTransformedResponse,
} from './leaderboardTypes';

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardTransformedResponse, LeaderboardQueryParams | void>({
      query: (params) => ({
        url: '/testpanel/leaderboard/global',
        params: {
          Page: params?.page ?? 1,
          Limit: params?.limit ?? 10,
          SortOrder: params?.sortOrder ?? 'DESC',
          SortBy: params?.sortBy ?? 'CreatedAt',
          IsPagination: params?.isPagination ?? true,
        },
      }),
      transformResponse: (response: LeaderboardApiResponse): LeaderboardTransformedResponse => ({
        ...response,
        data: {
          ...response.data,
          topThreeUsers: response.data.leaderboard.slice(0, 3),
        },
      }),
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;
