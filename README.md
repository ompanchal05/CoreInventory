# CoreInventory

A modular Inventory Management System (IMS) that digitizes and streamlines all stock-related operations within a business. CoreInventory replaces manual registers, Excel sheets, and scattered tracking methods with a centralized, real-time, easy-to-use application.

---

## Target Users

- **Inventory Managers** – manage incoming and outgoing stock
- **Warehouse Staff** – perform transfers, picking, shelving, and counting

---

## Authentication

- Sign up / Login
- OTP-based password reset
- Redirects to the Inventory Dashboard on login

---

## Dashboard

The landing page shows a real-time snapshot of inventory operations.

**KPIs**

- Total Products in Stock
- Low Stock / Out of Stock Items
- Pending Receipts
- Pending Deliveries
- Internal Transfers Scheduled

**Filters**

- By document type: Receipts / Delivery / Internal / Adjustments
- By status: Draft, Waiting, Ready, Done, Canceled
- By warehouse or location
- By product category

---

## Navigation

- **Products** — Create/update products, stock availability per location, product categories, reordering rules
- **Operations** — Receipts, Delivery Orders, Inventory Adjustment, Move History
- **Dashboard**
- **Settings** — Warehouse configuration
- **Profile Menu** — My Profile, Logout

---

## Core Features

### 1. Product Management

Create products with the following details:

- Name
- SKU / Code
- Category
- Unit of Measure
- Initial Stock (optional)

---

### 2. Receipts (Incoming Goods)

Used when items arrive from vendors.

**Process:**
1. Create a new receipt
2. Add supplier and products
3. Input quantities received
4. Validate — stock increases automatically

Example: Receive 50 units of Steel Rods → Stock +50

---

### 3. Delivery Orders (Outgoing Goods)

Used when stock leaves the warehouse for customer shipment.

**Process:**
1. Pick items
2. Pack items
3. Validate — stock decreases automatically

Example: Sales order for 10 chairs → Delivery order reduces chairs by 10

---

### 4. Internal Transfers

Move stock between locations inside the company. Every movement is logged in the ledger.

Examples:
- Main Warehouse → Production Floor
- Rack A → Rack B
- Warehouse 1 → Warehouse 2

---

### 5. Stock Adjustments

Fix mismatches between recorded stock and physical count.

**Steps:**
1. Select product and location
2. Enter the physically counted quantity
3. System auto-updates and logs the adjustment

---

## Additional Features

- Alerts for low stock
- Multi-warehouse support
- SKU search and smart filters

---

## Inventory Flow — Example

```
Step 1 — Receive Goods from Vendor
  Receive 100 kg Steel
  Stock: +100

Step 2 — Move to Production Rack
  Internal Transfer: Main Store → Production Rack
  Total stock unchanged, location updated

Step 3 — Deliver Finished Goods
  Deliver 20 steel
  Stock: -20

Step 4 — Adjust Damaged Items
  3 kg steel damaged
  Stock: -3

Everything is logged in the Stock Ledger.
```

## License

This project is licensed under the MIT License.
