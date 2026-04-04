import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'medicines.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const medicineData = JSON.parse(fileContent);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalMedicines: medicineData.medicines?.length || 0,
      firstMedicine: medicineData.medicines?.[0]?.brandName,
      hasMedicinesField: medicineData.medicines !== undefined,
      isMedicinesArray: Array.isArray(medicineData.medicines),
      dataStructure: {
        medicineCount: medicineData.medicines?.length,
        firstMedicineKeys: Object.keys(medicineData.medicines?.[0] || {}).slice(0, 5),
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorType: error.constructor.name,
    }, { status: 500 });
  }
}
