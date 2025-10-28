import express from 'express';
import {
  createGroup,
  getMyGroups,
  getSuggestedGroups,
  joinGroup,
  leaveGroup,
  getAdminGroupsWithRequests,
  approveJoinRequest,
  rejectJoinRequest,
  updateGroup,
  deleteGroup,
  removeUserFromGroup,
  getGroupMembers,
} from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateGroup, validateGroupUpdate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/create', validateGroup, createGroup);
router.get('/my', getMyGroups);
router.get('/suggested', getSuggestedGroups);

router.post('/:groupId/join', joinGroup);
router.delete('/:groupId/leave', leaveGroup);

router.get('/admin/requests', getAdminGroupsWithRequests);
router.post('/:groupId/requests/:userId/approve', approveJoinRequest);
router.delete('/:groupId/requests/:userId/reject', rejectJoinRequest);

router.put('/:groupId', validateGroupUpdate, updateGroup);
router.delete('/:groupId', deleteGroup);
router.get('/:groupId/members', getGroupMembers);
router.delete('/:groupId/members/:userId', removeUserFromGroup);

export default router;
