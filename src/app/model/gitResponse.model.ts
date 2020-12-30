import { GitUser } from './gitUser.model';

export interface GitResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitUser[];
}
