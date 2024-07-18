// @ts-nocheck
import * as _ from 'loadsh';
import { Issue } from '../entities';

export const issuePartial = (issue: Issue): Partial<Issue> =>
  _.pick(issue, [
    'id',
    'title',
    'type',
    'status',
    'priority',
    'listPosition',
    'createdAt', 
    'updatedAt',
    'userIds',
  ]);
