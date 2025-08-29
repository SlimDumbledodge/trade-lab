import { Actif, Company, User, Metrics, Transaction } from '@prisma/client';

export type ActifPublic = Omit<Actif, 'id' | 'createdAt' | 'updatedAt' | 'portfolios'>;
export type TransactionPublic = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type CompanyPublic = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>;
export type UserPublic = Omit<User, 'password' | 'createdAt' | 'updatedAt'>;
export type MetricsPublic = Omit<Metrics, 'id' | 'createdAt' | 'updatedAt' | 'actifId'>;
