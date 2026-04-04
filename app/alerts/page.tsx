'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { safetyAlerts } from '@/lib/data';
import { formatDate } from '@/lib/dateUtils';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Filter,
  Calendar,
} from 'lucide-react';

export default function SafetyAlertsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecallLevel, setSelectedRecallLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedIssueType, setSelectedIssueType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  // Get unique values for filters
  const recallLevels = useMemo(
    () =>
      Array.from(new Set(safetyAlerts.map((a) => a.recallLevel)))
        .sort()
        .filter((r) => r !== 'none'),
    []
  );
  const issueTypes = useMemo(
    () =>
      Array.from(new Set(safetyAlerts.map((a) => a.issueType))).sort(),
    []
  );

  // Filter and search
  const filteredAlerts = useMemo(() => {
    return safetyAlerts.filter((alert) => {
      const matchesSearch =
        alert.medicineName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        alert.alertNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.manufacturerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRecallLevel =
        selectedRecallLevel === 'all' ||
        alert.recallLevel === selectedRecallLevel;
      const matchesStatus =
        selectedStatus === 'all' || alert.status === selectedStatus;
      const matchesIssueType =
        selectedIssueType === 'all' || alert.issueType === selectedIssueType;

      return (
        matchesSearch &&
        matchesRecallLevel &&
        matchesStatus &&
        matchesIssueType
      );
    });
  }, [searchTerm, selectedRecallLevel, selectedStatus, selectedIssueType]);

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const stats = {
    total: safetyAlerts.length,
    classI: safetyAlerts.filter((a) => a.recallLevel === 'Class I').length,
    classII: safetyAlerts.filter((a) => a.recallLevel === 'Class II').length,
    classIII: safetyAlerts.filter((a) => a.recallLevel === 'Class III').length,
    active: safetyAlerts.filter((a) => a.status === 'active').length,
  };

  const getRecallColor = (
    level: string
  ): 'default' | 'destructive' | 'outline' | 'secondary' => {
    if (level === 'Class I') return 'destructive';
    if (level === 'Class II') return 'secondary';
    if (level === 'Class III') return 'outline';
    return 'default';
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-red-100 text-red-800';
    if (status === 'under-investigation') return 'bg-yellow-100 text-yellow-800';
    if (status === 'recalled') return 'bg-red-50 text-red-700';
    return 'bg-green-100 text-green-800';
  };

  const formatIssueType = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="canvas-bg min-h-screen flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Safety Alerts & Drug Recalls
              </h1>
              <p className="text-gray-600">
                Product safety monitoring and recall management
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700">
                Class I Recalls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.classI}
              </div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-700">
                Class II Recalls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.classII}
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Class III Recalls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.classIII}
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700">
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {stats.active}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search &amp; Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Search by Medicine, Batch, Manufacturer or Alert ID
                </label>
                <Input
                  placeholder="Enter search term..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Recall Level
                </label>
                <Select
                  value={selectedRecallLevel}
                  onValueChange={(value) => {
                    setSelectedRecallLevel(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Recall Levels</SelectItem>
                    {recallLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Issue Type
                </label>
                <Select
                  value={selectedIssueType}
                  onValueChange={(value) => {
                    setSelectedIssueType(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Issue Types</SelectItem>
                    {issueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {formatIssueType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Status
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => {
                    setSelectedStatus(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="under-investigation">
                      Under Investigation
                    </SelectItem>
                    <SelectItem value="recalled">Recalled</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-sm text-gray-600 mb-4">
          Showing{' '}
          {paginatedAlerts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}{' '}
          to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAlerts.length)} of{' '}
          {filteredAlerts.length} results
        </div>

        {/* Alerts List */}
        <div className="space-y-4 mb-6">
          {paginatedAlerts.length > 0 ? (
            paginatedAlerts.map((alert) => (
              <Card
                key={alert.id}
                className="hover:shadow-lg transition-shadow border-l-4 border-red-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {alert.medicineName}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {alert.details}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant={getRecallColor(alert.recallLevel)}>
                              {alert.recallLevel}
                            </Badge>
                            <Badge
                              variant={
                                alert.status === 'active'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {alert.status
                                .split('-')
                                .map(
                                  (w) =>
                                    w.charAt(0).toUpperCase() + w.slice(1)
                                )
                                .join(' ')}
                            </Badge>
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {formatIssueType(alert.issueType)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p className="font-mono text-xs text-gray-500">
                        {alert.alertNumber}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(alert.issueDate)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Manufacturer</p>
                      <p className="text-gray-900">{alert.manufacturerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Batch Number</p>
                      <p className="font-mono text-gray-900">
                        {alert.batchNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Reported By</p>
                      <p className="text-gray-900">{alert.reportedBy}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Issued Date</p>
                      <p className="text-gray-900">
                        {formatDate(alert.reportedDate)}
                      </p>
                    </div>
                  </div>

                  {alert.resolutionDate && (
                    <div className="border-t mt-4 pt-4">
                      <p className="text-sm text-gray-600 font-medium">
                        Resolution Date
                      </p>
                      <p className="text-gray-900">
                        {formatDate(alert.resolutionDate)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                No safety alerts found matching your search criteria.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {filteredAlerts.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* View Timeline Link */}
        <div className="mt-8 text-center">
          <Link
            href="/alerts/timeline"
            className="text-blue-600 hover:text-blue-900 font-medium inline-flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            View Timeline of Safety Events
          </Link>
        </div>
      </div>
    </div>
  );
}
