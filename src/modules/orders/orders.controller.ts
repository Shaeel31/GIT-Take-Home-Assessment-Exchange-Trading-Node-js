// orders.controller.ts

import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from '../../models/order.model';
import { BinaryTree } from '../binary-tree/binary-tree';

@Controller('orders')
export class OrdersController {
  private binaryTree: BinaryTree = new BinaryTree();

  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.ordersService.findAllOrders();
  }

  @Post()
  async createOrder(@Body() orderData: Partial<Order>): Promise<Order> {
    const newOrder = await this.ordersService.createOrder(orderData);
    this.binaryTree.insert(newOrder.price, newOrder.side);
    this.checkMatchingOrders(newOrder);
    return newOrder;
  }

  private checkMatchingOrders(newOrder: Order) {
    if (newOrder.side === 'buy') {
      const matchingOrder = this.binaryTree.root?.right;
      if (matchingOrder && matchingOrder.price === newOrder.price) {
        this.binaryTree.root.right = null;
        this.ordersService.deleteOrder(matchingOrder.id);
        this.ordersService.deleteOrder(newOrder.id);
      }
    } else if (newOrder.side === 'sell') {
      const matchingOrder = this.binaryTree.root?.left;
      if (matchingOrder && matchingOrder.price === newOrder.price) {
        this.binaryTree.root.left = null;
        this.ordersService.deleteOrder(matchingOrder.id);
        this.ordersService.deleteOrder(newOrder.id);
      }
    }
  }
}
