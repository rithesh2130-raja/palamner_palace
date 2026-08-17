# ShopSphere Database Model Architecture

The database is built on MongoDB using Mongoose schemas.

## 🗄️ Planned Domain Models (Introduced Incrementally)

1. **User**: Name, email, password hash, role (`Customer`, `Creator`, `Seller`, `Admin`, `SuperAdmin`), avatar, interests.
2. **CreatorProfile**: Bio, verified status, followers count, total earnings, commission rate.
3. **Seller**: Company name, verification status, default commission.
4. **Product**: Title, price, MRP, discount percentage, category, brand, stock, reels array ref.
5. **Category**: Parent category, hierarchy tags.
6. **Reel**: Video CDN URL, thumbnail, tagged products, duration, engagement metrics (views, likes, watch time).
7. **Comment**: Text, user, reel ref, attached product Q&A.
8. **Follow**: Follower / Following relationship links.
9. **AffiliateTransaction**: Creator commission, order link, status (`Approved`, `Paid`).
10. **Order**: User, order items, shipping address, payment status, fulfillment status.
11. **AuditLog**: Admin action tracking logs.
