import { Router } from 'express';

import authRoutes from '../modules/auth/index.route.js';
import usersRoutes from '../modules/users/index.route.js';
import customersRoutes from '../modules/customers/index.route.js';
import productsRoutes from '../modules/products/index.route.js';
import priceListsRoutes from '../modules/price-lists/index.route.js';
import discountTiersRoutes from '../modules/discount-tiers/index.route.js';
import approvalChainsRoutes from '../modules/approval-chains/index.route.js';
import quotationsRoutes from '../modules/quotations/index.route.js';
import approvalsRoutes from '../modules/approvals/index.route.js';
import warehousesRoutes from '../modules/warehouses/index.route.js';
import fulfillmentRoutes from '../modules/fulfillment/index.route.js';
import subscriptionsRoutes from '../modules/subscriptions/index.route.js';
import billingRoutes from '../modules/billing/index.route.js';
import upsellRoutes from '../modules/upsell/index.route.js';
import negotiationRoutes from '../modules/negotiation/index.route.js';
import dashboardRoutes from '../modules/dashboard/index.route.js';
import reportsRoutes from '../modules/reports/index.route.js';
import auditRoutes from '../modules/audit/index.route.js';
import notificationsRoutes from '../modules/notifications/notifications.route.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/customers', customersRoutes);
router.use('/products', productsRoutes);
router.use('/price-lists', priceListsRoutes);
router.use('/discount-tiers', discountTiersRoutes);
router.use('/approval-chains', approvalChainsRoutes);
router.use('/quotations', quotationsRoutes);
router.use('/approvals', approvalsRoutes);
router.use('/warehouses', warehousesRoutes);
router.use('/fulfillment', fulfillmentRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/billing', billingRoutes);
router.use('/upsell', upsellRoutes);
router.use('/portal', negotiationRoutes);
router.use('/negotiation', negotiationRoutes);
router.use('/deal-health', dashboardRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportsRoutes);
router.use('/audit-log', auditRoutes);
router.use('/audit', auditRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
