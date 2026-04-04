'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { safetyAlerts } from '@/lib/data';
import { formatDate, formatMonthYear, formatWeekdayMonthDay } from '@/lib/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface TimelineEvent {
  date: string;
  alert: (typeof safetyAlerts)[0];
}

export default function TimelinePage() {
  // Sort alerts by issue date
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = safetyAlerts.map((alert) => ({
      date: alert.issueDate,
      alert,
    }));
    return events.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    timelineEvents.forEach((event) => {
      const date = new Date(event.date);
      const monthKey = formatMonthYear(event.date);
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(event);
    });
    return groups;
  }, [timelineEvents]);

  const getRecallColor = (level: string) => {
    if (level === 'Class I')
      return 'bg-red-100 text-red-800 border-red-300';
    if (level === 'Class II')
      return 'bg-orange-100 text-orange-800 border-orange-300';
    if (level === 'Class III')
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'resolved')
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'active')
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  };

  const formatIssueType = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/alerts"
            className="text-blue-600 hover:text-blue-900 flex items-center gap-2 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Safety Alerts
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Safety Events Timeline
              </h1>
              <p className="text-gray-600">
                Chronological view of safety alerts and drug recalls
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Summary */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle>Timeline Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {timelineEvents.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Months Covered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.keys(groupedByMonth).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {safetyAlerts.filter((a) => a.status === 'active').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {safetyAlerts.filter((a) => a.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-yellow-500 to-green-500"></div>

          {/* Events */}
          <div className="space-y-8">
            {Object.entries(groupedByMonth).map(([month, events]) => (
              <div key={month}>
                <h2 className="text-xl font-bold text-gray-900 mb-6 ml-20">
                  {month}
                </h2>

                <div className="space-y-6">
                  {events.map((event, idx) => (
                    <div key={idx} className="flex gap-6 ml-0">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-full border-4 border-red-500 flex items-center justify-center flex-shrink-0 relative z-10">
                          {event.alert.status === 'resolved' ? (
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          ) : event.alert.status === 'active' ? (
                            <AlertCircle className="w-8 h-8 text-red-600" />
                          ) : (
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                          )}
                        </div>
                      </div>

                      {/* Event card */}
                      <Card className="flex-1 hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900">
                                {event.alert.medicineName}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {event.alert.details}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 font-medium">
                              {formatWeekdayMonthDay(event.date)}
                              </p>
                              <p className="text-xs text-gray-500 font-mono mt-1">
                                {event.alert.alertNumber}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge
                              className={`${getRecallColor(
                                event.alert.recallLevel
                              )} border`}
                            >
                              {event.alert.recallLevel}
                            </Badge>
                            <Badge
                              variant={
                                event.alert.status === 'active'
                                  ? 'destructive'
                                  : event.alert.status === 'resolved'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {event.alert.status
                                .split('-')
                                .map(
                                  (w) =>
                                    w.charAt(0).toUpperCase() + w.slice(1)
                                )
                                .join(' ')}
                            </Badge>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {formatIssueType(event.alert.issueType)}
                            </span>
                          </div>

                          <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 font-medium">
                                Batch Number
                              </p>
                              <p className="font-mono text-gray-900">
                                {event.alert.batchNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">
                                Manufacturer
                              </p>
                              <p className="text-gray-900">
                                {event.alert.manufacturerName}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 font-medium">
                                Reported By
                              </p>
                              <p className="text-gray-900">
                                {event.alert.reportedBy}
                              </p>
                            </div>
                            {event.alert.resolutionDate && (
                              <div>
                                <p className="text-gray-600 font-medium">
                                  Resolved
                                </p>
                                <p className="text-gray-900">
                                  {formatDate(event.alert.resolutionDate)}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/alerts"
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            ← Back to Safety Alerts
          </Link>
        </div>
      </div>
    </div>
  );
}
