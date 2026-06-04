import Message from '../models/Message.js';
import User from '../models/User.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get messages for a user (or for a specific user if Admin)
// @route   GET /api/messages
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  let targetUserId = req.user._id;

  // If Admin/Super Admin is looking at a customer's chat
  if ((req.user.role === 'admin' || req.user.role === 'super_admin') && req.params.userId) {
    targetUserId = req.params.userId;
  }

  const messages = await Message.find({ userId: targetUserId })
    .populate('sender', 'name email role')
    .sort('createdAt');

  res.json(messages);
});

// @desc    Send a message (Customer or Admin)
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message content is required');
  }

  let finalUserId = req.user._id;
  let senderRole = 'customer';

  if (req.user.role === 'admin' || req.user.role === 'super_admin') {
    if (!userId) {
      res.status(400);
      throw new Error('Target user ID is required for admins');
    }
    finalUserId = userId;
    senderRole = 'admin';
  }

  const newMessage = await Message.create({
    userId: finalUserId,
    sender: req.user._id,
    senderRole,
    message,
    isSystem: false,
  });

  const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name email role');

  res.status(201).json(populatedMessage);
});

// @desc    Get list of all users who have chat history (Admin only)
// @route   GET /api/messages/users
// @access  Private/Admin
const getChatUsers = asyncHandler(async (req, res) => {
  // Find distinct userIds in messages
  const userIds = await Message.distinct('userId');

  // Fetch user details for those IDs
  const users = await User.find({ _id: { $in: userIds } })
    .select('name email role phone createdAt')
    .sort('-updatedAt');

  // Let's also attach the last message for each user to make the admin chat UI look beautiful
  const chatUsers = await Promise.all(users.map(async (user) => {
    const lastMessage = await Message.findOne({ userId: user._id })
      .sort('-createdAt')
      .select('message createdAt senderRole');
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      lastMessage: lastMessage ? lastMessage.message : '',
      lastMessageTime: lastMessage ? lastMessage.createdAt : user.createdAt,
      lastSenderRole: lastMessage ? lastMessage.senderRole : '',
    };
  }));

  // Sort by last message time descending
  chatUsers.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

  res.json(chatUsers);
});

export { getMessages, sendMessage, getChatUsers };
