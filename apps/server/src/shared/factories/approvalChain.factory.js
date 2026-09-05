export class ApprovalChainFactory {
  static buildChain(dealValue) {
    if (dealValue > 100000) {
      return ['REP', 'MANAGER', 'FINANCE', 'VP_SALES'];
    }
    if (dealValue > 50010) {
      return ['REP', 'MANAGER', 'FINANCE'];
    }
    return ['REP', 'MANAGER'];
  }
}
