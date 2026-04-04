// Core Types for ZMRA System

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  activeIngredient: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  manufacturerId: string;
  country: string;
  registrationNumber: string;
  approvalDate: string;
  expiryDate: string;
  status: 'approved' | 'pending' | 'suspended' | 'revoked';
  therapeuticCategory: string;
  image?: string;
  images?: {
    package?: string;
    blister?: string;
    bottle?: string;
  };
  description?: string;
  packageDimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  weight?: number;
  packagingConfiguration?: string;
  documents?: {
    certificateOfAnalysis?: string;
    gmpCertificate?: string;
    approvalCertificate?: string;
  };
}

export interface Manufacturer {
  id: string;
  name: string;
  country: string;
  cityEmail: string;
  phone: string;
  website: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  status: 'active' | 'suspended' | 'inactive';
  certifications: string[];
}

export interface Batch {
  id: string;
  batchNumber: string;
  medicineId: string;
  medicineName: string;
  manufacturerId: string;
  manufacturerName: string;
  quantity: number;
  unit: string;
  manufacturingDate: string;
  expiryDate: string;
  location: string;
  status: 'available' | 'reserved' | 'distributed' | 'expired' | 'rejected' | 'quarantined';
  qualityStatus: 'compliant' | 'non-compliant' | 'pending-testing' | 'failed' | 'expired';
}

export interface Inspection {
  id: string;
  inspectionNumber: string;
  facilityId: string;
  facilityName: string;
  facilityType: 'pharmacy' | 'hospital' | 'distributor' | 'manufacturer';
  location: string;
  inspectionDate: string;
  completionDate: string;
  inspectorName: string;
  type: 'routine' | 'complaint-based' | 'follow-up' | 'initial-approval';
  status: 'scheduled' | 'in-progress' | 'completed' | 'on-hold';
  complianceScore: number; // 0-100
  complianceStatus: 'compliant' | 'warning' | 'critical';
  findingsSeverity: 'critical' | 'major' | 'minor' | 'none';
  findings: string;
  violations: string[];
  recommendations: string;
  inspectorComments: string;
  inspectionChecklist: {
    category: string;
    items: {
      item: string;
      status: 'passed' | 'failed' | 'n/a';
      comments?: string;
    }[];
  }[];
  photos: string[]; // URLs to photos
  riskScore: number;
}

export interface Facility {
  id: string;
  name: string;
  type: 'pharmacy' | 'hospital' | 'distributor' | 'manufacturer';
  location: string;
  address: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  registrationDate: string;
  status: 'active' | 'suspended' | 'inactive';
}

export interface LaboratoryTest {
  id: string;
  sampleId: string;
  testNumber: string;
  batchId: string;
  batchNumber: string;
  medicineId: string;
  medicineName: string;
  manufacturerId: string;
  manufacturerName: string;
  testDate: string;
  completionDate: string;
  testType: string;
  parameter: string;
  result: string;
  specification: string;
  status: 'passed' | 'failed' | 'pending' | 'on-hold';
  analyst: string;
  laboratory: string;
  remarks: string;
  qualityScore: number; // 0-100
  labNotes: string;
  attachedReports: string[]; // URLs to reports
}

export interface RegulatoryApproval {
  id: string;
  approvalNumber: string;
  medicineId: string;
  medicineName: string;
  manufacturerId: string;
  manufacturerName: string;
  applicationDate: string;
  approvalDate: string;
  status: 'approved' | 'pending' | 'under-review' | 'rejected' | 'withdrawn';
  approvalType: 'new-registration' | 'renewal' | 'variation' | 'amendment';
  expiryDate: string;
  approvedBy: string;
  remarks: string;
}

export interface SafetyAlert {
  id: string;
  alertNumber: string;
  medicineId: string;
  medicineName: string;
  manufacturerId: string;
  manufacturerName: string;
  batchNumber: string;
  issueDate: string;
  reportedDate: string;
  reportedBy: string;
  issueType: 'adverse-event' | 'contamination' | 'quality-defect' | 'suspected-counterfeit' | 'efficacy-issue';
  recallLevel: 'Class I' | 'Class II' | 'Class III' | 'none';
  details: string;
  resolutionDate?: string;
  status: 'active' | 'under-investigation' | 'recalled' | 'resolved';
}

export interface InventoryRecord {
  id: string;
  batchId: string;
  batchNumber: string;
  medicineName: string;
  quantity: number;
  unit: string;
  location: string;
  received: string;
  allocated: number;
  available: number;
  expiryDate: string;
  storageConditions: string;
}

export interface DashboardMetrics {
  totalMedicines: number;
  totalManufacturers: number;
  totalBatches: number;
  totalInspections: number;
  approvedMedicines: number;
  pendingApprovals: number;
  completedTests: number;
  failedTests: number;
  activeAlerts: number;
  expiredBatches: number;
}

export interface CompanyProfile extends Manufacturer {
  companyType: 'Manufacturer' | 'Importer' | 'Distributor';
  gmpCertificationStatus: 'certified' | 'pending' | 'expired' | 'not-certified';
  registeredMedicinesCount: number;
  inspectionHistoryIds: string[];
  medicineIds: string[];
  contactPerson: string;
  address: string;
  registrationDate: string;
}

export interface RegistrationApplication {
  id: string;
  applicationNumber: string;
  medicineId?: string;
  medicineName: string;
  manufacturerId: string;
  manufacturerName: string;
  submissionDate: string;
  assignedReviewer: string;
  status: 'submitted' | 'technical-screening' | 'laboratory-testing' | 'evaluation-committee' | 'approved' | 'rejected';
  stage: 1 | 2 | 3 | 4 | 5;
  documents: string[];
  reviewComments: ReviewComment[];
  evaluationChecklist: EvaluationItem[];
  approvalDecision?: {
    approved: boolean;
    decisionDate: string;
    approvedBy: string;
    remarks: string;
  };
}

export interface ReviewComment {
  id: string;
  stage: number;
  reviewer: string;
  comment: string;
  date: string;
  status: 'pending-revision' | 'approved' | 'needs-clarification';
}

export interface EvaluationItem {
  category: string;
  items: {
    item: string;
    status: 'passed' | 'failed' | 'pending' | 'n/a';
    remarks?: string;
  }[];
}

export interface Document {
  id: string;
  name: string;
  type: 'certificate' | 'analysis' | 'gmp' | 'approval' | 'inspection-report' | 'lab-report' | 'quality-assurance' | 'other';
  linkedTo: {
    entityType: 'medicine' | 'manufacturer' | 'inspection' | 'laboratory-test' | 'application';
    entityId: string;
    entityName: string;
  };
  uploadDate: string;
  uploadedBy: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: 'pending-approval' | 'approved' | 'rejected' | 'archived';
  expiryDate?: string;
  version: number;
}

export interface Notification {
  id: string;
  type: 'expiring-approval' | 'expiring-batch' | 'overdue-inspection' | 'safety-recall' | 'system-alert';
  title: string;
  message: string;
  linkedEntity?: {
    entityType: 'medicine' | 'batch' | 'inspection' | 'manufacturer';
    entityId: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  isRead: boolean;
}
