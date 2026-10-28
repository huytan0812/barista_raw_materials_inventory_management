-- Adds the optimistic-locking version columns used by GoodsReceiptItem and SalesOrderItem (@Version).
-- The schema is managed manually (Liquibase is disabled and Hibernate ddl-auto is not used),
-- so run this once against an existing database before starting the new backend version:
--   mysql -u <user> -p bar_materials_db < docs/sql/add-version-columns.sql
-- Existing rows start at version 0.

ALTER TABLE goods_receipt_item ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE sales_order_item ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
