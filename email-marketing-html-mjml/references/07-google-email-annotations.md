# Google Email Annotations, Actions, and Highlights

## Two separate systems

### Gmail Promotions annotations

Use JSON-LD or Microdata in genuine promotional email to enable possible Promotions-tab enhancements:

- `DiscountOffer` for deal badge/code/start/end;
- `PromotionCard` for single-image preview or product carousel;
- `EmailMessage` for supported alternative subject treatment;
- deal cards as documented by Gmail.

Carousels support up to 10 unique image previews. Use unique HTTPS PNG/JPEG images with a consistent supported ratio (4:5, 1:1, or 1.91:1), accurate destination, optional headline/price/currency/discount, and position. Keep deal badges specific and short (Google recommends no more than about four words), show the same code in the email, and include accurate ISO 8601 start/end with timezone. Remove expired annotations.

Annotations may be suppressed by quality/frequency filters and are not shown to every recipient. The email must remain complete without them. If the ESP strips JSON-LD `<script>`, use Google's documented Microdata alternative. Validate with Google's preview/test tooling and inspect the final sent source—not only pre-ESP HTML.

### Gmail Actions and Highlights

Use supported markup for transactional Orders, Parcel Delivery, Invoices, reservations (flight, hotel, event, restaurant, bus, train, rental car), and eligible one-click/go-to actions. Use the highest-fidelity supported action and deep-link to the exact task. Labels must be short, accurate, and not promotional.

Production processing requires Google registration/whitelisting, authenticated/aligned mail, a static sender, established volume/history, very low complaints, valid real-life sample email, markup validation, and approval. Self-tests sent from a Gmail account to itself can display without production registration. Gmail removes markup on forwarding.

Google states Actions should be used for transactional mail with high expected interaction and not promotional bulk mail. Do not add `TrackAction`, check-in, RSVP, review, confirm, or view actions unless the event/order/service and endpoint are real, fast, safe, and supported.

## MJML integration

Place JSON-LD inside `<mj-raw>` in `mj-head` or an appropriate raw body position, then verify the compiled and sent source contains valid JSON. Never interpolate unescaped recipient data into JSON-LD. Build the annotation object from validated campaign/transaction data using a real JSON serializer, not string concatenation.

## Truth and privacy

Markup must match visible email and backend state. Do not expose full addresses, payment details, private identifiers, or signed URLs unnecessarily. Expired discounts, invented prices, false availability, fake tracking, and generic home-page actions are prohibited.
