export interface IAchievement {
  id: string;
  userId: string;
  name: string;
  description: string;
  progress: number;
  achieved: boolean;
  achievedDate?: Date;
  badgeImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IAchievementFilters = {
  userId?: string;
  achieved?: boolean;
};
