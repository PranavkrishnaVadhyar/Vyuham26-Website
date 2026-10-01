# 🔘 PHASE 7: Auxiliary Public Modules (Contact & Feedback)

> **Priority:** LOW-MEDIUM (Supporting public interaction channels)  
> **Target System:** `vyuham-backend`

---

## 🎯 Objectives
1. Provide a contact submission endpoint for sponsorship and general inquiries from [`contact/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/contact/page.tsx).
2. Provide a feedback submission endpoint for the festival debrief survey from [`feedback/page.tsx`](file:///c:/Users/nb200/Documents/Vyuham26-Website/Vyuham26_frontend/src/pages/feedback/page.tsx).

---

## 📋 Endpoint Specifications

### 7.1 Contact Inquiries (`POST /contact`)
* **Access:** Public (with rate limiting)
* **Payload:**
  ```json
  {
    "name": "Jane Doe",
    "organization": "TechCorp Ventures",
    "email": "jane@techcorp.com",
    "phone": "+91 98470 54321",
    "tier": "Title Sponsor",
    "message": "Interested in partnering for Hackathon 36."
  }
  ```
* **Response (HTTP 201):**
  ```json
  {
    "ok": true,
    "message": "Inquiry recorded by Central Command."
  }
  ```

---

### 7.2 Festival Feedback Debrief (`POST /feedback`)
* **Access:** Public or Authenticated User
* **Payload:**
  ```json
  {
    "rating": 5,
    "comments": "The CTF arena setup and network infrastructure were phenomenal.",
    "user_id": "optional-uuid"
  }
  ```
* **Response (HTTP 201):**
  ```json
  {
    "ok": true,
    "message": "Debrief submitted successfully."
  }
  ```

---

## ✅ Phase 7 Checklist & Verification

- [ ] 1. Create simple models and schemas for `contact` and `feedback`.
- [ ] 2. Register routers in `app/main.py`.
- [ ] 3. Verify submission from frontend `/contact` and `/feedback` forms.
