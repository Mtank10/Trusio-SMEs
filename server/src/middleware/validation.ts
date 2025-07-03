import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    companyName: Joi.string().min(2).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  product: Joi.object({
    name: Joi.string().min(2).required(),
    description: Joi.string().min(10).required()
  }),

  supplier: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    tier: Joi.number().integer().min(1).max(10).required(),
    parentSupplierId: Joi.string().uuid().optional(),
    productId: Joi.string().uuid().required()
  }),

  survey: Joi.object({
    productId: Joi.string().uuid().required(),
    supplierTier: Joi.number().integer().min(1).max(10).required(),
    questions: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        type: Joi.string().valid('text', 'select', 'multiselect', 'file', 'date', 'number').required(),
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).optional(),
        required: Joi.boolean().required(),
        category: Joi.string().valid('general', 'environmental', 'social', 'governance').required()
      })
    ).min(1).required()
  }),

  surveyResponse: Joi.object({
    answers: Joi.object().required()
  }),

  inviteSupplier: Joi.object({
    supplierEmail: Joi.string().email().required(),
    surveyId: Joi.string().uuid().required()
  })
};