export type SortOrder = 'ASC' | 'DESC';

export type LeaderboardQueryParams = {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
  sortBy?: string;
  isPagination?: boolean;
};

export type LeaderboardUser = {
  rank: number;
  userId: number;
  fullName: string;
  profilePic: string | null;
  totalScore: number;
  totalCorrect: number;
};

export type LeaderboardApiResponse = {
  status: boolean;
  message: string;
  data: {
    totalParticipants: number;
    currentPage: number;
    totalPages: number;
    userRank: number | null;
    leaderboard: LeaderboardUser[];
  };
};

export type LeaderboardTransformedResponse = LeaderboardApiResponse & {
  data: LeaderboardApiResponse['data'] & {
    topThreeUsers: LeaderboardUser[];
  };
};
