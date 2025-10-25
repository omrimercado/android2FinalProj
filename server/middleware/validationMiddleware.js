import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  body('birthDate')
    .notEmpty()
    .withMessage('Birth date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),

    (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
      });
    }
    next();
  },
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
      });
    }
    next();
  },
];

export const validatePost = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ min: 1 })
    .withMessage('Post content cannot be empty'),

  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a valid URL string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
      });
    }
    next();
  },
];

export const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1 })
    .withMessage('Comment content cannot be empty'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
      });
    }
    next();
  },
];

export const validatePostUpdate = [
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Post content cannot be empty')
    .isLength({ min: 1 })
    .withMessage('Post content must have at least 1 character'),

  body('image')
    .optional()
    .isString()
    .withMessage('Image must be a valid URL string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
      });
    }

    if (!req.body.content && !req.body.image) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'At least one field (content or image) must be provided for update',
      });
    }

    next();
  },
];

export const validateGroup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Group name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Group name must be between 2 and 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Group description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Group description must be between 10 and 500 characters'),

  body('tags')
    .isArray({ min: 1, max: 5 })
    .withMessage('Group must have between 1 and 5 tags')
    .custom((tags) => {
      return tags.every(
        (tag) =>
          typeof tag === 'string' &&
          tag.trim().length > 0 &&
          tag.trim().length <= 20
      );
    })
    .withMessage('Each tag must be a non-empty string with maximum 20 characters'),

  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean value'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
      });
    }
    next();
  },
];

export const validateAIPostGeneration = [
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required')
    .isLength({ min: 3, max: 500 })
    .withMessage('Topic must be between 3 and 500 characters'),

  body('style')
    .optional()
    .isIn(['professional', 'casual', 'funny', 'inspirational', 'storytelling'])
    .withMessage('Style must be one of: professional, casual, funny, inspirational, storytelling'),

  body('length')
    .optional()
    .isIn(['short', 'medium', 'long'])
    .withMessage('Length must be one of: short, medium, long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
      });
    }
    next();
  },
];

export const validateGroupUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Group name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Group name must be between 2 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Group description cannot be empty')
    .isLength({ min: 10, max: 500 })
    .withMessage('Group description must be between 10 and 500 characters'),

  body('tags')
    .optional()
    .isArray({ min: 1, max: 5 })
    .withMessage('Group must have between 1 and 5 tags')
    .custom((tags) => {
      return tags.every(
        (tag) =>
          typeof tag === 'string' &&
          tag.trim().length > 0 &&
          tag.trim().length <= 20
      );
    })
    .withMessage('Each tag must be a non-empty string with maximum 20 characters'),

  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate must be a boolean value'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: errors.array()[0].msg,
      });
    }

    if (!req.body.name && !req.body.description && !req.body.tags && req.body.isPrivate === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'At least one field (name, description, tags, or isPrivate) must be provided for update',
      });
    }

    next();
  },
];