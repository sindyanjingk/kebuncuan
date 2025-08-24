import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origin, destination, items } = body;

    // Mock shipping calculation - replace with actual Biteship API call
    const mockShippingOptions = [
      {
        courier_company: "JNE",
        courier_type: "REG",
        price: 15000,
        duration: "2-3 hari",
        description: "Reguler - Layanan pengiriman ekonomis"
      },
      {
        courier_company: "JNE",
        courier_type: "YES",
        price: 25000,
        duration: "1-2 hari",
        description: "Yakin Esok Sampai - Layanan pengiriman cepat"
      },
      {
        courier_company: "SiCepat",
        courier_type: "REG",
        price: 12000,
        duration: "2-4 hari",
        description: "Reguler - Pengiriman hemat"
      },
      {
        courier_company: "SiCepat",
        courier_type: "BEST",
        price: 20000,
        duration: "1-2 hari",
        description: "Best - Pengiriman prioritas"
      }
    ];

    // Calculate total weight and value
    const totalWeight = items.reduce((total: number, item: any) => total + (item.weight * item.quantity), 0);
    const totalValue = items.reduce((total: number, item: any) => total + (item.value), 0);

    // Adjust shipping prices based on weight and distance (simplified calculation)
    const adjustedOptions = mockShippingOptions.map(option => ({
      ...option,
      price: Math.round(option.price * (totalWeight / 1000) * 1.2) // Increase price based on weight
    }));

    return NextResponse.json({
      success: true,
      couriers: adjustedOptions
    });

  } catch (error) {
    console.error('SHIPPING_CALCULATION_ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping cost' }, 
      { status: 500 }
    );
  }
}
