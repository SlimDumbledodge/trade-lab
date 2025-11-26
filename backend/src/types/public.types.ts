import { Asset, User, Transaction } from '@prisma/client';

export type AssetPublic = Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'portfolios'>;
export type TransactionPublic = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type UserPublic = Omit<User, 'password' | 'createdAt' | 'updatedAt'>;
