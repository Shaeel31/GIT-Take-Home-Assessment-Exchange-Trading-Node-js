// orders.controller.spec.ts

import { Test } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../../models/order.model';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    ordersService = moduleRef.get<OrdersService>(OrdersService);
    ordersController = moduleRef.get<OrdersController>(OrdersController);
  });

  describe('getAllOrders', () => {
    it('should return an array of orders', async () => {
      const mockOrders: any[] = [
        { id: 1, side: 'buy', price: 10 },
        { id: 2, side: 'sell', price: 20 },
      ];

      jest.spyOn(ordersService, 'findAllOrders').mockResolvedValue(mockOrders);

      const result = await ordersController.getAllOrders();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const newOrder: Partial<Order> = {
        side: 'buy',
        price: 15,
      };

      const mockCreatedOrder: any = {
        id: 3,
        side: 'buy',
        price: 15,
      };

      jest.spyOn(ordersService, 'createOrder').mockResolvedValue(mockCreatedOrder);

      const result = await ordersController.createOrder(newOrder);
      expect(result).toEqual(mockCreatedOrder);
    });
  });
});
