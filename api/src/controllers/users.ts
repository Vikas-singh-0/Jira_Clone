import { catchErrors } from '../errors';

export const getCurrentUser = catchErrors((req, res) => {
  res.json({ currentUser: req.currentUser });
});
