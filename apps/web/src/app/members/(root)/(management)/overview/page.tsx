'use client';

import StatCard from '@/components/shared/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrganizer } from '@/hooks/use-organizer';
import { toast } from '@/hooks/use-toast';
import { fadeInUp, opacityUp } from '@/lib/animation-template';
import { cn, formatRupiah } from '@/lib/utils';
import { GetEventsStatistic } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Calendar, Star, Users2, WalletCards } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function OverviewPage() {
  const { apiclient, user, status } = useOrganizer();
  const { data, isPending, error } = useQuery({
    queryKey: ['dashboard-overview', user?.id],
    queryFn: async () => {
      const { data } = await apiclient.get('/events/statistic');
      return data.statistic as GetEventsStatistic['statistic'];
    },
    enabled: !!user?.id && status !== 'pending',
  });

  const [selectedView, setSelectedView] = useState<'yearly' | 'monthly'>(
    'yearly',
  );
  const [chartData, setChartData] = useState<
    | GetEventsStatistic['statistic']['yearly']
    | GetEventsStatistic['statistic']['monthly']
  >(data?.yearly || []);

  useEffect(() => {
    if (data?.yearly && data?.monthly) {
      setChartData(selectedView === 'yearly' ? data.yearly : data.monthly);
    }
  }, [data, selectedView]);

  if (isPending) {
    return (
      <div className="p-8 text-center">
        <div className="text-base text-muted-foreground">
          🤔 Preparing your data...
        </div>
      </div>
    );
  }

  if (error && error instanceof AxiosError) {
    toast({
      title: 'Failed to Load Data',
      description:
        'Sorry we have problem in our server. Please try again later!',
      variant: 'destructive',
    });
    return null;
  }

  if (!data || status === 'pending') return null;

  return (
    <div className="my-8">
      <motion.div {...opacityUp} className="space-y-8">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700">
            Dashboard Overview
          </h3>
          <Separator className="mt-4" />
        </div>

        <motion.div
          {...fadeInUp}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Total Events"
            value={data.stats.totalEvents}
            description="Across all time periods"
            icon={<Calendar className="size-6 text-brand-rose-500" />}
          />
          <StatCard
            title="Total Attendees"
            value={data.stats.totalTicketSold}
            description="People attending your events"
            icon={<Users2 className="size-6 text-green-500" />}
          />
          <StatCard
            title="Average Rating"
            value={data.stats.averageRating.toFixed(2)}
            description="Based on attendee feedback"
            icon={<Star className="size-6 text-yellow-500" />}
          />
          <StatCard
            title="Revenue Generated"
            value={formatRupiah(data.stats.totalRevenue)}
            description="Total earnings from events"
            icon={<WalletCards className="size-6 text-brand-blue-500" />}
          />
        </motion.div>

        <div className="grid gap-6">
          <motion.div {...fadeInUp}>
            <Card className="grainy-light">
              <CardHeader>
                <CardTitle>Event Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <XAxis
                        dataKey={selectedView === 'yearly' ? 'month' : 'day'}
                      />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="events"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Card className="grainy-light">
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey={selectedView === 'yearly' ? 'month' : 'day'}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="ticketSold"
                        name="attendees"
                        fill="#82ca9d"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedView('yearly')}
            className={cn(
              'px-4 py-2 rounded-lg transition-all duration-200 font-medium',
              selectedView === 'yearly'
                ? 'bg-brand-rose-600 text-white'
                : 'bg-gray-100',
            )}
          >
            Yearly View
          </button>
          <button
            onClick={() => setSelectedView('monthly')}
            className={cn(
              'px-4 py-2 rounded-lg transition-all duration-200',
              selectedView === 'monthly'
                ? 'bg-brand-rose-600 text-white'
                : 'bg-gray-100',
            )}
          >
            Monthly View
          </button>
        </div>
      </motion.div>
    </div>
  );
}
