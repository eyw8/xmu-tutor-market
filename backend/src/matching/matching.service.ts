import { Injectable } from '@nestjs/common';

import {
  computeMatchScore,
  MatchScore,
  RequestForMatch,
  StudentForMatch,
} from './score.util';

@Injectable()
export class MatchingService {
  score(student: StudentForMatch, request: RequestForMatch): MatchScore {
    return computeMatchScore(student, request);
  }
}
