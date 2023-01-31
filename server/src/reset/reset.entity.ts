import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Reset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({
    unique: true,
  })
  token: string;
}
