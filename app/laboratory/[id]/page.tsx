'use client';

import React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { laboratoryTests } from '@/lib/data';
import { formatDate } from '@/lib/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  ArrowLeft,
  Beaker,
  ClipboardList,
  BarChart3,
} from 'lucide-react';

type Params = Promise<{ id: string }>;

export default function LaboratoryDetailPage(props: { params: Params }) {
  const params = use(props.params);
  const test = laboratoryTests.find((t) => t.id === params.id);

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/laboratory"
            className="text-blue-600 hover:text-blue-900 flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Laboratory Tests
          </Link>
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Test Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">
                The laboratory test record you are looking for does not exist.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
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
    if (score >= 95) return 'text-green-600 bg-green-50';
    if (score >= 85) return 'text-blue-600 bg-blue-50';
    if (score >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getResultColor = (result: string, specification: string) => {
    if (
      result.includes('>=') ||
      result.includes('ab') ||
      result.includes('No')
    ) {
      return 'bg-green-50 border-green-200';
    }
    return 'bg-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/laboratory"
            className="text-blue-600 hover:text-blue-900 flex items-center gap-2 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Laboratory Tests
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Beaker className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Lab Test {test.testNumber}
                </h1>
                <p className="text-gray-600">
                  {test.medicineName} - Batch {test.batchNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(test.status)}
              <Badge variant={getStatusColor(test.status)} className="text-sm">
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sample ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-mono font-bold text-blue-600">
                {test.sampleId}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Test Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900">
                {formatDate(test.testDate)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Completion Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-gray-900">
                {formatDate(test.completionDate)}
              </div>
            </CardContent>
          </Card>
          <Card className={getQualityColor(test.qualityScore)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{test.qualityScore}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="results" className="mb-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Test Results
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Lab Notes
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Test Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`border-2 rounded-lg p-6 ${getResultColor(test.result, test.specification)}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Test Parameter
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {test.parameter}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Test Result
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {test.result}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Specification
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {test.specification}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Test Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Test Type</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {test.testType}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Remarks</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {test.remarks}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Medicine Name
                    </p>
                    <p className="font-semibold text-gray-900">
                      {test.medicineName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Batch Number
                    </p>
                    <p className="font-mono font-semibold text-gray-900">
                      {test.batchNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Manufacturer
                    </p>
                    <p className="font-semibold text-gray-900">
                      {test.manufacturerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Laboratory
                    </p>
                    <p className="font-semibold text-gray-900">
                      {test.laboratory}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Analyst
                    </p>
                    <p className="font-semibold text-gray-900">
                      {test.analyst}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Test Result
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(test.status)}
                      <Badge variant={getStatusColor(test.status)}>
                        {test.status.charAt(0).toUpperCase() +
                          test.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-bold text-gray-900 mb-4">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex gap-4">
                      <div className="text-sm font-medium text-gray-600 min-w-24">
                        Test Date:
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(test.testDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-sm font-medium text-gray-600 min-w-24">
                        Completion:
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {new Date(test.completionDate).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-sm font-medium text-gray-600 min-w-24">
                        Duration:
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {Math.ceil(
                          (new Date(test.completionDate).getTime() -
                            new Date(test.testDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        days
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lab Notes Tab */}
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Laboratory Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-gray-900 leading-relaxed">
                    {test.labNotes}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Additional Remarks
                  </p>
                  <p className="text-gray-900 leading-relaxed">
                    {test.remarks}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Attached Reports & Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {test.attachedReports && test.attachedReports.length > 0 ? (
                  <div className="space-y-3">
                    {test.attachedReports.map((report, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {report.split('/').pop()}
                            </p>
                            <p className="text-sm text-gray-600">
                              PDF Document
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No reports attached to this test.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex gap-4">
          <Link
            href="/laboratory"
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center font-medium"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
