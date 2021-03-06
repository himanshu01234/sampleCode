const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { skillService } = require('../services');

const create = catchAsync(async (req, res) => {
  const serviceType = await skillService.createSkill(req.body);
  res.send({ code: 200, message: 'Skill fetched', data: serviceType });
});

const getSkills = catchAsync(async (req, res) => {
  const result = await skillService.querySkillsForUser();
  res.send({ code: 200, message: 'Skill fetched', data: result });
});

const getSkillsForUser = catchAsync(async (req, res) => {
  const result = await skillService.querySkillsUser();
  res.send({ code: 200, message: 'Skill fetched', data: result });
});

const getSkill = catchAsync(async (req, res) => {
  const serviceType = await skillService.getSkillById(req.params.serviceTypeId);
  res.send(serviceType);
});

const deleteSkill = catchAsync(async (req, res) => {
  await skillService.deleteSkillById(req.params.skillId, { status: 'deleted' });
  res.send({ code: 200, message: 'Skill Deleted' });
});

const updateSkill = catchAsync(async (req, res) => {
  const result = await skillService.updateSkill(req.body);
  res.send({ code: 200, message: 'Skill updated', data: result });
});

module.exports = {
  create,
  getSkills,
  getSkill,
  deleteSkill,
  getSkillsForUser,
  updateSkill,
};
