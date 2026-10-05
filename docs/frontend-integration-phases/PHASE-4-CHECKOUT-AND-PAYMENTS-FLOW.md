# 🟡 PHASE 4: Checkout, Orders & Payment Confirmation Flow

> **Priority:** MEDIUM-HIGH (Required for fee calculation, paid event confirmation, UPI/QR verification, and official receipts)  
> **Target Systems:** `Vyuham26_frontend` (`src/pages/checkout/page.tsx`, `src/pages/payment/page.tsx`, `src/pages/receipt/page.tsx`, `src/pages/register/page.tsx`, `src/lib/api.ts`)  
> **Backend Contract:** `vyuham-backend` (`POST /payments/create`, `POST /payments/verify`, `GET /payments/receipt/{ref}`)

---

## 🎯 Objectives

1. Pass selected loadout missions seamlessly from the Registration Hub ([`src/pages/register/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/register/page.tsx)) into the Checkout Review console ([`src/pages/checkout/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/checkout/page.tsx)).
2. Dynamically calculate the subtotal across all pending registrations plus the standard **₹30 platform security fee**.
3. Create an active payment transaction order via `POST /payments/create`.
4. Replace the 2-second simulation on [`src/pages/payment/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/payment/page.tsx) with a real call to `POST /payments/verify` using the transaction reference (e.g. `TXN-VYU-984021`).
5. Populate the Official Vyuham '26 Festival Receipt ([`src/pages/receipt/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/receipt/page.tsx)) using data from `GET /payments/receipt/{ref}`.

---

## 📋 Target Files & Required Modifications

### 4.1 Payment Client in `src/lib/api.ts`

* **File:** [`Vyuham26_frontend/src/lib/api.ts`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/lib/api.ts)
* **Changes:**
  * Define `PaymentOrder`, `PaymentVerifyResponse`, and `ReceiptData` schemas:
    ```typescript
    export interface PaymentOrder {
      payment_id: string;
      subtotal: number;
      platform_fee: number;
      total_amount: number;
      transaction_ref: string;
      status: "pending" | "completed" | "failed";
    }

    export interface ReceiptItem {
      title: string;
      fee: number;
      stream: string;
    }

    export interface ReceiptData {
      receipt_no: string;
      transaction_ref: string;
      timestamp: string;
      attendee_name: string;
      college: string;
      payment_method: string;
      items: ReceiptItem[];
      subtotal: number;
      platform_fee: number;
      total_amount: number;
    }

    export const paymentsApi = {
      createOrder: (payload: { registration_ids: string[]; payment_method: "upi" | "card" | "netbanking" }) =>
        apiFetch<PaymentOrder>("/payments/create", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      verifyPayment: (transactionRef: string) =>
        apiFetch<{ status: string; transaction_ref: string; confirmed_registrations: number }>(
          "/payments/verify",
          {
            method: "POST",
            body: JSON.stringify({ transaction_ref: transactionRef }),
          }
        ),
      getReceipt: (transactionRef: string) =>
        apiFetch<ReceiptData>(`/payments/receipt/${transactionRef}`),
    };
    ```

---

### 4.2 Dynamic Loadout Review in `src/pages/checkout/page.tsx`

* **File:** [`Vyuham26_frontend/src/pages/checkout/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/checkout/page.tsx)
* **Current Issue:** Lines 14–18 use a static hardcoded array (`National Hackathon`, `CTF Warzone`, `Battle of the Bands`).
* **Modifications:**
  * Read pending registrations from `registrationsApi.listMine()`.
  * Allow operatives to proceed to payment with their real pending registrations:
    ```typescript
    const handleProceedToPayment = async () => {
      if (items.length === 0) return;
      setIsCreatingOrder(true);
      try {
        const order = await paymentsApi.createOrder({
          registration_ids: items.map((i) => i.id),
          payment_method: "upi",
        });
        // Store active transaction ref in session storage and navigate
        sessionStorage.setItem("vyuham_active_payment", JSON.stringify(order));
        navigate(`/payment?order_id=${order.payment_id}&ref=${order.transaction_ref}`);
      } catch (err: any) {
        toast(err.message || "Failed to initialize payment gateway", "error");
      } finally {
        setIsCreatingOrder(false);
      }
    };
    ```

---

### 4.3 Real Verification in `src/pages/payment/page.tsx`

* **File:** [`Vyuham26_frontend/src/pages/payment/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/payment/page.tsx)
* **Current Issue:** `handlePayment` relies on a dummy `setTimeout` of 2000ms.
* **Modifications:**
  * Submit the transaction reference to `paymentsApi.verifyPayment`:
    ```typescript
    const handlePayment = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("pending");

      try {
        const activeOrderRaw = sessionStorage.getItem("vyuham_active_payment");
        const activeOrder = activeOrderRaw ? JSON.parse(activeOrderRaw) : null;
        const refToVerify = activeOrder?.transaction_ref || `TXN-VYU-${Math.floor(100000 + Math.random() * 900000)}`;

        await paymentsApi.verifyPayment(refToVerify);
        setTxnRef(refToVerify);
        setStatus("success");
        toast("Payment verified. Registrations confirmed!", "ok");
      } catch (err: any) {
        setStatus("idle");
        toast(err.message || "Verification failed. Please retry.", "error");
      }
    };
    ```

---

### 4.4 Dynamic Receipt Rendering (`src/pages/receipt/page.tsx`)

* **File:** [`Vyuham26_frontend/src/pages/receipt/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/receipt/page.tsx)
* **Modifications:**
  * Extract `?ref=` query parameter from the URL.
  * Call `paymentsApi.getReceipt(ref)` and bind fields dynamically:
    * `Receipt No` $\rightarrow$ `data.receipt_no`
    * `Transaction Timestamp` $\rightarrow$ `data.timestamp`
    * `Participant` $\rightarrow$ `data.attendee_name`
    * Itemized list $\rightarrow$ `data.items.map(...)`
    * Total Due $\rightarrow$ `data.total_amount`

---

## 📡 Backend Verification Contract

| Method | Endpoint | Request Body | Response (HTTP 200/201) |
| :--- | :--- | :--- | :--- |
| `POST` | `/payments/create` | `{ "registration_ids": ["uuid-1"], "payment_method": "upi" }` | `{ "payment_id": "uuid", "subtotal": 500.0, "platform_fee": 30.0, "total_amount": 530.0, "transaction_ref": "TXN-VYU-984021", "status": "pending" }` |
| `POST` | `/payments/verify` | `{ "transaction_ref": "TXN-VYU-984021" }` | `{ "status": "completed", "transaction_ref": "TXN-VYU-984021", "confirmed_registrations": 1 }` |
| `GET` | `/payments/receipt/TXN-VYU-984021` | *None* | Full itemized JSON receipt with attendee metadata |

---

## ✅ Phase 4 Checklist & Acceptance Testing

- [ ] **1. Checkout Loadout Review**: Navigate to `/checkout`. Verify that the page loads your pending event registrations with dynamic fee calculation.
- [ ] **2. Order Initialization**: Click "Proceed to Secure Payment". Confirm that `POST /payments/create` returns an order ID and `transaction_ref`.
- [ ] **3. Payment Verification**: On `/payment`, submit verification. Verify `POST /payments/verify` completes and transitions status to `success`.
- [ ] **4. Receipt Inspection**: Click "View Receipt". Confirm that `/receipt?ref=...` displays your attendee name, college, itemized fee breakdown, and digital verification seal.
- [ ] **5. Registration Confirmation**: Check `/dashboard` and verify registration status has changed from `pending` to `confirmed`.
