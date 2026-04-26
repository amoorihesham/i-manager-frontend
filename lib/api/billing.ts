import client from './client';
import type { ApiSuccess, Subscription, SubscriptionTier } from './types';

export interface CheckoutBody {
	tier: Extract<SubscriptionTier, 'pro' | 'ultra'>;
}

export const createCheckoutSession = (body: CheckoutBody) =>
	client.post<ApiSuccess<{ url: string }>>('/billing/checkout', body).then((r) => r.data);

export const createPortalSession = () =>
	client.post<ApiSuccess<{ url: string }>>('/billing/portal').then((r) => r.data);

export const getMySubscription = () => client.get<ApiSuccess<Subscription>>('/billing/me').then((r) => r.data);
