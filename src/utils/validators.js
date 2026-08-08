const Joi = require('joi');

// Validators aligned to the provided MySQL schema

const idClassSchema = Joi.string().trim().max(8);
const classNameSchema = Joi.string().trim().max(10);
const userIdSchema = Joi.string().trim().max(6);
const passwordSchema = Joi.string().trim().max(100);
const userNameSchema = Joi.string().trim().max(10);
const userClassSchema = Joi.string().trim().max(7);
const roleSchema = Joi.string().trim().max(10);
const gradeSchema = Joi.number().integer();
const weekIdSchema = Joi.string().trim().max(4);
const weekNameSchema = Joi.string().trim().max(10);
const shortString25 = Joi.string().trim().max(25);
const nameVpSchema = Joi.string().trim().max(100);
const minusPntSchema = Joi.number().integer();
const ruleTypeSchema = Joi.string().trim().max(100);
const integerSchema = Joi.number().integer();
const nameStudentSchema = Joi.string().trim().max(1000);
const byWhoSchema = Joi.string().trim().max(15);
const bonusSchema = Joi.string().trim().max(100);
const modifiedBySchema = Joi.string().trim().max(15);
const sdtSchema = Joi.string().trim().max(15);
const addressSchema = Joi.string().trim().max(500);
const feedSchema = Joi.string().trim().max(1000);
const schoolSchema = Joi.string().trim().max(50);
const studentNameSchema = Joi.string().trim().max(100);

function validate(schema, payload) {
  const { error, value } = schema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    const err = new Error(message);
    err.name = 'ValidationError';
    err.details = error.details;
    throw err;
  }
  return value;
}

// Class
const createClassSchema = Joi.object({
  class_id: idClassSchema.required(),
  class_name: classNameSchema.required(),
  grade: gradeSchema
}).unknown(false);
const updateClassSchema = Joi.object({
  class_name: classNameSchema.required(),
  grade: gradeSchema
}).unknown(false);

// Users
const createUserSchema = Joi.object({
  user_id: userIdSchema.required(),
  password: passwordSchema.required(),
  user_name: userNameSchema.required(),
  user_class: userClassSchema.allow(null),
  role: roleSchema.allow(null),
  grade_scope: gradeSchema.allow(null)
}).unknown(false);
const updateUserSchema = Joi.object({
  password: passwordSchema,
  user_name: userNameSchema,
  user_class: userClassSchema.allow(null),
  role: roleSchema.allow(null),
  grade_scope: gradeSchema.allow(null)
}).unknown(false).min(1);

// Week
const createWeekSchema = Joi.object({
  week_id: weekIdSchema.required(),
  week_name: weekNameSchema.required(),
  start_date: shortString25.allow(null),
  end_date: shortString25.allow(null)
}).unknown(false);
const updateWeekSchema = Joi.object({
  week_name: weekNameSchema,
  start_date: shortString25.allow(null),
  end_date: shortString25.allow(null)
}).unknown(false).min(1);

// Rules
const createRulesSchema = Joi.object({
  name_vp: nameVpSchema.required(),
  minus_pnt: minusPntSchema.required(),
  type: ruleTypeSchema.allow(null)
}).unknown(false);
const updateRulesSchema = Joi.object({
  name_vp: nameVpSchema,
  minus_pnt: minusPntSchema,
  type: ruleTypeSchema.allow(null)
}).unknown(false).min(1);

// Vipham
const createViphamSchema = Joi.object({
  week_id: weekIdSchema.required(),
  class_id: idClassSchema.required(),
  name_vp_id: integerSchema.allow(null),
  quantity: integerSchema.required(),
  student_id: integerSchema.allow(null),
  name_student: nameStudentSchema.allow(null),
  create_by: byWhoSchema.required(),
  bonus: bonusSchema.allow(null),
  modified_by: modifiedBySchema.allow(null),
  day: integerSchema.allow(null)
}).unknown(false);
const updateViphamSchema = Joi.object({
  name_vp_id: integerSchema,
  quantity: integerSchema,
  student_id: integerSchema.allow(null),
  name_student: nameStudentSchema.allow(null),
  modified_by: modifiedBySchema.allow(null),
  bonus: bonusSchema.allow(null),
  day: integerSchema.allow(null)
}).unknown(false).min(1);

// Score
const createScoreSchema = Joi.object({
  week_id: weekIdSchema.required(),
  class_id: idClassSchema.required(),
  score: integerSchema.required(),
  deft: integerSchema.allow(null),
  note: Joi.string().allow(null)
}).unknown(false);
const updateScoreSchema = Joi.object({
  score: integerSchema,
  deft: integerSchema,
  note: Joi.string().allow(null)
}).unknown(false).min(1);

// Lichtruc
const createLichTrucSchema = Joi.object({
  week_id: weekIdSchema.required(),
  class_active: idClassSchema.required(),
  class_passive: idClassSchema.allow(null)
}).unknown(false);
const updateLichTrucSchema = Joi.object({
  class_passive: idClassSchema.allow(null)
}).unknown(false).min(1);

// Feedback
const createFeedbackSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  sdt: sdtSchema.required(),
  address: addressSchema.allow(null),
  feed: feedSchema.allow(null),
  school: schoolSchema.allow(null)
}).unknown(false);
const updateFeedbackSchema = Joi.object({
  address: addressSchema,
  feed: feedSchema,
  school: schoolSchema
}).unknown(false).min(1);

// Student
const createStudentSchema = Joi.object({
  student_id: integerSchema.allow(null),
  student_name: studentNameSchema.required(),
  class_id: idClassSchema.required()
}).unknown(false);
const updateStudentSchema = Joi.object({
  student_name: studentNameSchema,
  class_id: idClassSchema
}).unknown(false).min(1);

module.exports = {
  validate,
  // class
  createClassValidator: payload => validate(createClassSchema, payload),
  updateClassValidator: payload => validate(updateClassSchema, payload),
  // users
  createUserValidator: payload => validate(createUserSchema, payload),
  updateUserValidator: payload => validate(updateUserSchema, payload),
  // week
  createWeekValidator: payload => validate(createWeekSchema, payload),
  updateWeekValidator: payload => validate(updateWeekSchema, payload),
  // rules
  createRulesValidator: payload => validate(createRulesSchema, payload),
  updateRulesValidator: payload => validate(updateRulesSchema, payload),
  // vipham
  createViphamValidator: payload => validate(createViphamSchema, payload),
  updateViphamValidator: payload => validate(updateViphamSchema, payload),
  // score
  createScoreValidator: payload => validate(createScoreSchema, payload),
  updateScoreValidator: payload => validate(updateScoreSchema, payload),
  // lichtruc
  createLichTrucValidator: payload => validate(createLichTrucSchema, payload),
  updateLichTrucValidator: payload => validate(updateLichTrucSchema, payload),
  // feedback
  createFeedbackValidator: payload => validate(createFeedbackSchema, payload),
  updateFeedbackValidator: payload => validate(updateFeedbackSchema, payload),
  // student
  createStudentValidator: payload => validate(createStudentSchema, payload),
  updateStudentValidator: payload => validate(updateStudentSchema, payload)
};
