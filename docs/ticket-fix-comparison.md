# ShopLedger ticket fixes and output comparisons

The examples use workshop scenarios and in-memory fixtures. The suite passed all 18 tests using `node --test test/*.test.js`.

## Ticket 1 — Invoice totals and GST

| Old issue | Before | After |
| --- | --- | --- |
| Printed invoice disagreed with checkout | Order #1002 printed **₹1,083.24 total**, including **₹183.60 GST**. | The same billing scenario now prints **₹963.90 total**, including **₹45.90 GST**, matching checkout. |
| The invoice ignored the SAVE10 discount cap | On a ₹2,240 subtotal, even 10% of the subtotal alone exceeded the ₹150 cap. The old invoice calculated the percentage on subtotal plus tax. | The invoice applies the **₹150 cap** and calculates GST on the discounted taxable amount. |
| Items without an explicit GST rate fell back to 18% | Items with 5% or 12% HSN rates were invoiced at 18%. | Invoice GST follows checkout's item-level rates, including **5% and 12%**. |

## Ticket 2 — Stock availability and cancellation

| Old issue | Before | After |
| --- | --- | --- |
| Checkout rejected the last sellable unit | With **4 units in stock and 3 reserved**, a purchase of 1 returned “out of stock (1 sellable available)”. | The purchase succeeds. **3 physical units remain, all reserved**, leaving 0 sellable units. Checkout adds up duplicate lines for the same product before checking stock. |
| Cancelling a pending order failed to restore stock | In a fixture where a 2-unit order reduced physical stock from 6 to 4, cancellation left it at **4**. | Cancellation restores physical stock to **6**, preserves the **3 wholesale reservations**, and a repeat cancellation leaves stock at 6. |

## Ticket 3 — Order History and Customer Khata

| Old issue | Before | After |
| --- | --- | --- |
| Orders sorted by day of the month first | With the three orders in the screenshot, the order was **#1004, #1001, #1008**. | Newest first is **#1008, #1004, #1001**. |
| Date filters returned orders outside the selected range | Filtering those same three orders to **1–31 March 2022** returned **#1004, #1001, and #1008**. | The range returns **#1008** only. Both endpoints are inclusive. |
| A text payment corrupted Khata totals | Recording ₹500 for Meera produced **₹1,200,500.00 settled** and **−₹1,198,067.99 due**. | The payment is added numerically, resulting in **₹1,700.00 settled** and **₹732.01 due**. Invalid amounts are rejected. |

## Open review findings

- **Historical invoices.** Reprinting the SAVE10 example after disabling the coupon produced **₹1,071.00** for an order billed at **₹963.90**. The invoice still uses the current coupon configuration when recalculating.
- **Settlement audit log.** A submitted amount of `500.005` is recorded in the ledger as **₹500.01**, while the audit entry uses the submitted value. The audit entry should use the recorded settlement amount.
- **Existing Khata data.** Previously corrupted balances still require a separate data correction.
