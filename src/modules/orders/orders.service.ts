import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '../../models/order.model';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order) private orderModel: typeof Order) {}

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return this.orderModel.create(orderData);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.orderModel.findAll();
  }

  async deleteOrder(orderId: number): Promise<void> {
    await this.orderModel.destroy({ where: { id: orderId } });
  }
}
