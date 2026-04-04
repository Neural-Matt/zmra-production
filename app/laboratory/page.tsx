'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { laboratoryTests } from '@/lib/data';
import { formatDate } from '@/lib/dateUtils';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Beaker,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ITEMS_PER_PAGE = 15;

export default function LaboratoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTestType, setSelectedTestType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLab, setSelectedLab] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique values for filters
  const testTypes = useMemo(
    () =>
      Array.from(new Set(laboratoryTests.map((t) => t.testType))).sort(),
    []
  );
  const laboratories = useMemo(
    () =>
      Array.from(new Set(laboratoryTests.map((t) => t.laboratory))).sort(),
    []
  );

  // Filter and search
  const filteredTests = useMemo(() => {
    return laboratoryTests.filter((test) => {
      const matchesSearch =
        test.medicineName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        test.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.analyst.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTestType =
        selectedTestType === 'all' || test.testType === selectedTestType;
      const matchesStatus =
        selectedStatus === 'all' || test.status === selectedStatus;
      const matchesLab =
        selectedLab === 'all' || test.laboratory === selectedLab;

      return (
        matchesSearch &&
        matchesTestType &&
        matchesStatus &&
        matchesLab
      );
    });
  }, [searchTerm, selectedTestType, selectedStatus, selectedLab]);

  // Pagination
  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Statistics
  const stats = {
    total: laboratoryTests.length,
    passed: laboratoryTests.filter((t) => t.status === 'passed').length,
    failed: laboratoryTests.filter((t) => t.status === 'failed').length,
    pending: laboratoryTests.filter((t) => t.status === 'pending').length,
    averageQuality:
      Math.round(
        laboratoryTests.reduce((sum, t) => sum + t.qualityScore, 0) /
          laboratoryTests.length
      ) + '%',
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (
    status: string
  ): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (status) {
      case 'passed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-blue-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="canvas-bg min-h-screen flex-1 overflow-auto p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Beaker className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Laboratory Testing
              </h1>
              <p className="text-gray-600">
                Quality control test results and sample analysis
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700">
                Passed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.passed}
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700">
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.failed}
              </div>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-700">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700">
                Avg Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {stats.averageQuality}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Search by Medicine, Batch, Sample ID or Analyst
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
                  Test Type
                </label>
                <Select value={selectedTestType} onValueChange={(value) => {
                  setSelectedTestType(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Test Types</SelectItem>
                    {testTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Result Status
                </label>
                <Select value={selectedStatus} onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Laboratory
                </label>
                <Select value={selectedLab} onValueChange={(value) => {
                  setSelectedLab(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Laboratories</SelectItem>
                    {laboratories.map((lab) => (
                      <SelectItem key={lab} value={lab}>
                        {lab}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {paginatedTests.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredTests.length)} of{' '}
          {filteredTests.length} results
        </div>

        {/* Table */}
        <Card className="mb-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">
                    Sample ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Medicine Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Batch Number
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Test Type
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900">
                    Laboratory
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">
                    Test Date
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">
                    Result
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">
                    Quality Score
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">
                    Analyst
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTests.length > 0 ? (
                  paginatedTests.map((test) => (
                    <TableRow
                      key={test.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-mono text-sm text-blue-600">
                        {test.sampleId}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {test.medicineName}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">
                        {test.batchNumber}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {test.testType}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {test.laboratory}
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-600">
                        {formatDate(test.testDate)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(test.status)}
                          <Badge variant={getStatusColor(test.status)}>
                            {test.status.charAt(0).toUpperCase() +
                              test.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-semibold ${getQualityColor(
                            test.qualityScore
                          )}`}
                        >
                          {test.qualityScore}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-sm text-gray-700">
                        {test.analyst}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link
                          href={`/laboratory/${test.id}`}
                          className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      No test records found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination */}
        {filteredTests.length > ITEMS_PER_PAGE && (
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
      </div>
    </div>
  );
}
