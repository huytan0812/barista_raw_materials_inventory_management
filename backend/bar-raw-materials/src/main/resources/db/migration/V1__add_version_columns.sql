-- V1: optimistic-locking version columns for GoodsReceiptItem and SalesOrderItem (@Version).
-- Migrations are not run automatically (Liquibase is disabled and Hibernate ddl-auto is not used),
-- so apply this once to an existing database before starting the backend version that needs it.
-- From backend/bar-raw-materials:
--   mysql -u <user> -p bar_materials_db < src/main/resources/db/migration/V1__add_version_columns.sql
-- Existing rows start at version 0.

ALTER TABLE goods_receipt_item ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE sales_order_item ADD COLUMN version BIGINT NOT NULL DEFAULT 0;
