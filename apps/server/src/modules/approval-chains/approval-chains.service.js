import { ApprovalChainRule, ApprovalChainStep } from '../../models/index.js';

export class ApprovalChainsService {
  async getAll() {
    const rules = await ApprovalChainRule.find();
    const result = await Promise.all(
      rules.map(async (rule) => {
        const steps = await ApprovalChainStep.find({ rule_id: rule._id }).sort({ step_order: 1 });
        return { ...rule.toObject(), steps };
      })
    );
    return result;
  }

  async create(data) {
    const { steps = [], ...ruleData } = data;
    const rule = await ApprovalChainRule.create(ruleData);

    const createdSteps = [];
    for (const step of steps) {
      const createdStep = await ApprovalChainStep.create({
        rule_id: rule._id,
        step_order: step.step_order,
        approver_role: step.approver_role
      });
      createdSteps.push(createdStep);
    }

    return { ...rule.toObject(), steps: createdSteps };
  }

  async update(id, data) {
    const rule = await ApprovalChainRule.findById(id);
    if (!rule) {
      const err = new Error('Approval chain rule not found');
      err.statusCode = 404;
      throw err;
    }
    const { steps, ...ruleData } = data;
    Object.assign(rule, ruleData);
    await rule.save();

    if (steps && Array.isArray(steps)) {
      await ApprovalChainStep.deleteMany({ rule_id: id });
      for (const step of steps) {
        await ApprovalChainStep.create({
          rule_id: id,
          step_order: step.step_order,
          approver_role: step.approver_role
        });
      }
    }

    const updatedSteps = await ApprovalChainStep.find({ rule_id: id }).sort({ step_order: 1 });
    return { ...rule.toObject(), steps: updatedSteps };
  }
}

export const approvalChainsService = new ApprovalChainsService();
export default approvalChainsService;
