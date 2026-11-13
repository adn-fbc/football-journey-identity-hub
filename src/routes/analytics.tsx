import { createFileRoute } from '@tanstack/react-router';
import { pageHead } from '@/lib/seo';
import { AnalyticsPage } from '@/features/analytics/analytics-page';
export const Route = createFileRoute('/analytics')({
  head: () => pageHead('Analytics', 'Organization health and competition insights.'),
  component: AnalyticsPage,
});
