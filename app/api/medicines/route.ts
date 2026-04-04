import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';

    // Read medicines.json from public/data directory
    const filePath = join(process.cwd(), 'public', 'data', 'medicines.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    const medicineData = JSON.parse(fileContent);

    // If specific medicine ID is requested (detail view)
    if (id) {
      const medicine = medicineData.medicines.find((m: any) => m.id === id);
      if (!medicine) {
        return NextResponse.json(
          { error: 'Medicine not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ medicine });
    }

    // List view: filter and paginate
    let medicines = medicineData.medicines;

    // Filter by search term (brand name or generic name)
    if (search) {
      medicines = medicines.filter((m: any) =>
        m.brandName.toLowerCase().includes(search) ||
        m.genericName.toLowerCase().includes(search)
      );
    }

    // Filter by category
    if (category) {
      medicines = medicines.filter((m: any) => m.therapeuticCategory === category);
    }

    // Calculate pagination
    const total = medicines.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedMedicines = medicines.slice(offset, offset + limit);

    // For list view, only return essential fields (no batches, single image)
    const optimizedMedicines = paginatedMedicines.map((medicine: any) => ({
      id: medicine.id,
      brandName: medicine.brandName,
      genericName: medicine.genericName,
      therapeuticCategory: medicine.therapeuticCategory,
      dosageForm: medicine.dosageForm,
      strength: medicine.strength,
      manufacturer: medicine.manufacturer,
      manufacturerCountry: medicine.manufacturerCountry,
      approvalStatus: medicine.approvalStatus,
      images: {
        productImage: medicine.images.productImage, // Only product image for list
      },
    }));

    return NextResponse.json({
      medicines: optimizedMedicines,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
      metadata: medicineData.metadata,
    });
  } catch (error) {
    console.error('Error reading medicines data:', error);
    return NextResponse.json(
      { error: 'Failed to load medicines data' },
      { status: 500 }
    );
  }
}
