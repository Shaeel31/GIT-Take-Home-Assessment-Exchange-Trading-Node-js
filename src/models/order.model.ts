import { Model, Column, DataType, Table } from 'sequelize-typescript';

@Table
export class Order extends Model<Order> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  side: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;
}