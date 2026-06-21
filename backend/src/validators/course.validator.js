import Joi from "joi";

const CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "DevOps",
  "Cybersecurity",
  "Business",
  "Marketing",
  "Photography",
  "Music",
  "Other",
];

const LEVELS = ["beginner", "intermediate", "advanced"];

export const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(5).max(150).required(),
  subtitle: Joi.string().trim().max(300).optional().allow(""),
  description: Joi.string().trim().min(20).required(),
  category: Joi.string().valid(...CATEGORIES).required(),
  level: Joi.string().valid(...LEVELS).default("beginner"),
  language: Joi.string().trim().default("English"),
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0).default(0),
  requirements: Joi.array().items(Joi.string().trim()).default([]),
  learningOutcomes: Joi.array().items(Joi.string().trim()).default([]),
  duration: Joi.number().min(0).default(0),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(5).max(150),
  subtitle: Joi.string().trim().max(300).allow(""),
  description: Joi.string().trim().min(20),
  category: Joi.string().valid(...CATEGORIES),
  level: Joi.string().valid(...LEVELS),
  language: Joi.string().trim(),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0),
  requirements: Joi.array().items(Joi.string().trim()),
  learningOutcomes: Joi.array().items(Joi.string().trim()),
  duration: Joi.number().min(0),
}).min(1); // at least one field required for update