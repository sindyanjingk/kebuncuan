import axios from 'axios'

const BITESHIP_API_URL = 'https://api.biteship.com/v1'

export interface BiteshipAreaResponse {
  areas: BiteshipArea[]
}

export interface BiteshipArea {
  id: string
  name: string
  country_name: string
  country_code: string
  administrative_division_level_1_name: string
  administrative_division_level_1_type: string
  administrative_division_level_2_name: string
  administrative_division_level_2_type: string
  administrative_division_level_3_name: string
  administrative_division_level_3_type: string
  postal_code: string
}

export interface BiteshipCourierResponse {
  couriers: BiteshipCourier[]
}

export interface BiteshipCourier {
  courier_code: string
  courier_service_code: string
  courier_name: string
  courier_service_name: string
  duration: string
  shipment_duration_range: string
  shipment_duration_unit: string
  price: number
}

export interface BiteshipOrderRequest {
  shipper_contact_name: string
  shipper_contact_phone: string
  shipper_contact_email: string
  shipper_organization: string
  shipper_address: string
  shipper_postal_code: string
  shipper_area_id: string
  
  receiver_contact_name: string
  receiver_contact_phone: string
  receiver_contact_email?: string
  receiver_address: string
  receiver_postal_code: string
  receiver_area_id: string
  
  courier_company: string
  courier_type: string
  delivery_type: string
  order_note?: string
  
  items: BiteshipItem[]
}

export interface BiteshipItem {
  name: string
  description: string
  value: number
  weight: number
  quantity: number
}

export interface BiteshipOrderResponse {
  id: string
  waybill_id: string
  order_id: string
  courier: {
    company: string
    type: string
  }
  tracking: {
    waybill_id: string
    courier_company: string
    courier_type: string
    status: string
    link: string
  }
}

export interface BiteshipTrackingResponse {
  courier: {
    company: string
    waybill_id: string
  }
  history: BiteshipTrackingEvent[]
  link: string
  order: {
    order_id: string
  }
  status: string
}

export interface BiteshipTrackingEvent {
  note: string
  updated_at: string
  status: string
}

export class BiteshipAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  // Search areas by postal code or name
  async searchAreas(input: string, countries?: string): Promise<BiteshipAreaResponse> {
    try {
      const params = new URLSearchParams({ input })
      if (countries) params.append('countries', countries)
      
      const response = await axios.get(`${BITESHIP_API_URL}/maps/areas?${params}`, {
        headers: this.getHeaders()
      })
      
      return response.data
    } catch (error) {
      console.error('Error searching areas:', error)
      throw new Error('Failed to search areas')
    }
  }

  // Get shipping rates
  async getRates(
    originAreaId: string,
    destinationAreaId: string,
    items: BiteshipItem[]
  ): Promise<BiteshipCourierResponse> {
    try {
      const data = {
        origin_area_id: originAreaId,
        destination_area_id: destinationAreaId,
        couriers: 'jne,tiki,pos,jnt,sicepat,anteraja', // Popular couriers
        items
      }

      const response = await axios.post(`${BITESHIP_API_URL}/rates/couriers`, data, {
        headers: this.getHeaders()
      })
      
      return response.data
    } catch (error) {
      console.error('Error getting rates:', error)
      throw new Error('Failed to get shipping rates')
    }
  }

  // Create order
  async createOrder(orderData: BiteshipOrderRequest): Promise<BiteshipOrderResponse> {
    try {
      const response = await axios.post(`${BITESHIP_API_URL}/orders`, orderData, {
        headers: this.getHeaders()
      })
      
      return response.data
    } catch (error) {
      console.error('Error creating order:', error)
      throw new Error('Failed to create shipping order')
    }
  }

  // Track shipment
  async trackShipment(waybillId: string, courierCompany: string): Promise<BiteshipTrackingResponse> {
    try {
      const response = await axios.get(
        `${BITESHIP_API_URL}/trackings/${waybillId}/couriers/${courierCompany}`,
        { headers: this.getHeaders() }
      )
      
      return response.data
    } catch (error) {
      console.error('Error tracking shipment:', error)
      throw new Error('Failed to track shipment')
    }
  }

  // Get order details
  async getOrder(orderId: string): Promise<BiteshipOrderResponse> {
    try {
      const response = await axios.get(`${BITESHIP_API_URL}/orders/${orderId}`, {
        headers: this.getHeaders()
      })
      
      return response.data
    } catch (error) {
      console.error('Error getting order:', error)
      throw new Error('Failed to get order details')
    }
  }
}

// Helper function to convert shipping status
export function convertBiteshipStatus(biteshipStatus: string): string {
  const statusMap: Record<string, string> = {
    'confirmed': 'CONFIRMED',
    'allocated': 'ALLOCATED', 
    'picking_up': 'PICKING_UP',
    'picked_up': 'PICKED_UP',
    'dropping_off': 'DROPPING_OFF',
    'delivered': 'DELIVERED',
    'returned': 'RETURNED',
    'cancelled': 'CANCELLED',
    'on_hold': 'ON_HOLD'
  }
  
  return statusMap[biteshipStatus.toLowerCase()] || 'PENDING'
}
