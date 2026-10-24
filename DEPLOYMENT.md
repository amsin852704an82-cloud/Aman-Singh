# 🇮🇳 BharatConnect — Production Deployment Guide (उत्पादन परिनियोजन मार्गदर्शिका)

> **"Apna Desh, Apna Network"**  
> यह गाइड BharatConnect को Production पर Vercel (Frontend PWA), Railway (Backend API), Supabase (PostgreSQL DB) और Cloudinary (Media Storage) पर deploy करने के लिए तैयार की गई है।

---

## 1. आर्किटेक्चर आरेख (Architecture Diagram)

```
                            +-----------------------------------+
                            |       Browser / Mobile PWA        |
                            |   (React 19 + Tailwind CSS v4)    |
                            +-----------------+-----------------+
                                              |
                                              | HTTPS (bharatconnect.in)
                                              v
                            +-----------------------------------+
                            |        Vercel Edge Network        |
                            |         (Frontend Static)         |
                            | - vercel.json (SPA Rewrites)      |
                            | - Offline PWA (sw.js & Manifest)  |
                            +-----------------+-----------------+
                                              |
                                              | API Requests (api.bharatconnect.in)
                                              | credentials: 'include' (CSRF/Cookies)
                                              v
                            +-----------------------------------+
                            |         Railway Platform          |
                            |         (Express Backend)         |
                            | - Port 3000, Node 20-Alpine       |
                            | - Helmet CSP, CORS, Rate Limit    |
                            | - Zod Schemas Validation          |
                            +--------+------------------+-------+
                                     |                  |
           Prisma ORM Queries        |                  | Image Uploads (WebP)
           (SSL Encrypted)           |                  | (Sharp 800px Auto-compress)
                                     v                  v
+--------------------------------------+   +------------------------------------+
|            Supabase DB               |   |          Cloudinary CDN            |
|       (Managed PostgreSQL)           |   |       (Media Cloud Storage)        |
| - Users, Posts, Groups, Events, etc. |   | - Post Photos, User Avatars        |
+--------------------------------------+   +------------------------------------+
```

---

## 2. ज़रूरी अकाउंट्स और लिंक्स (Required Accounts & Links)

1. **GitHub**: [github.com](https://github.com) (Code Repository & CI/CD Pipeline)
2. **Supabase**: [supabase.com](https://supabase.com) (PostgreSQL Database Hosting)
3. **Cloudinary**: [cloudinary.com](https://cloudinary.com) (Image Optimization & Storage)
4. **Railway**: [railway.app](https://railway.app) (Node.js Express Backend Hosting)
5. **Vercel**: [vercel.com](https://vercel.com) (React Vite PWA Frontend Hosting)

---

## 3. Supabase Database सेटअप — चरणबद्ध निर्देश

1. [Supabase Console](https://supabase.com/dashboard) में लॉगिन करें और **New Project** पर क्लिक करें।
2. Project Name: `bharatconnect-prod` डालें और एक मजबूत **Database Password** सेट करें।
3. Region: **Mumbai, India (`ap-south-1`)** चुनें (भारतीय यूजर्स के लिए न्यूनतम लेटेंसी)।
4. Project तैयार होने पर बाईं ओर **Project Settings** ➔ **Database** में जाएं।
5. **Connection String** सेक्शन में जाएं और **URI** टैब चुनें:
   - Direct: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - अथवा Transaction Pooling (Port 6543): `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true`
6. इस URI को कॉपी करके अपने पास सुरक्षित रखें। इसे Railway के `DATABASE_URL` में पेस्ट करना होगा।

---

## 4. Cloudinary मीडिया सेटअप — चरणबद्ध निर्देश

1. [Cloudinary Console](https://cloudinary.com/console) में लॉगिन करें।
2. Dashboard मुख्य पृष्ठ पर **Product Environment Credentials** देखें:
   - **Cloud Name**: (उदा. `bharatconnect-prod`)
   - **API Key**: (उदा. `847291847192837`)
   - **API Secret**: (उदा. `aBcDeFgHiJkLmNoPqRsTuVwXyZ`)
3. ये तीनों मान Railway के Environment Variables में जोड़े जाएंगे।

---

## 5. Vercel Frontend डिप्लॉय — चरणबद्ध निर्देश

1. [Vercel Dashboard](https://vercel.com/dashboard) पर जाएं और **Add New...** ➔ **Project** चुनें।
2. अपना GitHub रिपॉजिटरी चुनें और **Import** पर क्लिक करें।
3. **Project Settings**:
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install --legacy-peer-deps`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://api.bharatconnect.in` (या आपका Railway API URL)
5. **Deploy** बटन पर क्लिक करें। Vercel `vercel.json` के अनुसार PWA सर्विस वर्कर और SPA रीराइट्स स्वचालित रूप से लागू कर देगा।

---

## 6. Railway Backend डिप्लॉय — चरणबद्ध निर्देश

1. [Railway Dashboard](https://railway.app/dashboard) में **New Project** ➔ **Deploy from GitHub repo** चुनें।
2. अपना रिपॉजिटरी चुनें। Railway रूट पर मौजूद `railway.toml` को स्वचालित रूप से पहचान लेगा।
3. Service Settings में **Variables** टैब में जाएं और नीचे दी गई तालिका के सभी Environment Variables जोड़ें।
4. Settings ➔ **Networking** में जाकर **Generate Domain** पर क्लिक करें या अपना कस्टम डोमेन `api.bharatconnect.in` जोड़ें।
5. **Deploy** पर क्लिक करें। Railway NIXPACKS बिल्डर से `npm install && npm run build` चलाएगा और `/api/health` पर निरंतर हेल्थ चेक करेगा।

---

## 7. Environment Variables चेकलिस्ट तालिका

| Variable Name | Vercel (Frontend) | Railway (Backend) | विवरण और उदाहरण |
|---|:---:|:---:|---|
| `VITE_API_BASE_URL` | ✅ | ❌ | `https://api.bharatconnect.in` |
| `NODE_ENV` | ❌ | ✅ | `production` |
| `PORT` | ❌ | ✅ | `3000` |
| `DATABASE_URL` | ❌ | ✅ | Supabase PostgreSQL Connection URI |
| `JWT_SECRET` | ❌ | ✅ | 32+ अक्षरों की सुरक्षित क्रिप्टोग्राफिक कुंजी |
| `COOKIE_SECRET` | ❌ | ✅ | 32+ अक्षरों का कुकी सिग्नेचर सीक्रेट |
| `ALLOWED_ORIGINS` | ❌ | ✅ | `https://bharatconnect.in,https://www.bharatconnect.in` |
| `CLOUDINARY_CLOUD_NAME` | ❌ | ✅ | Cloudinary क्लाउड का नाम |
| `CLOUDINARY_API_KEY` | ❌ | ✅ | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | ❌ | ✅ | Cloudinary API Secret |
| `GOOGLE_CLIENT_ID` | ❌ | ✅ | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | ✅ | Google OAuth Client Secret |
| `GOOGLE_REDIRECT_URI` | ❌ | ✅ | `https://bharatconnect.vercel.app/api/auth/google/callback` |
| `BACKEND_GOOGLE_REDIRECT_URI` | ❌ | ✅ | `https://bharatconnect-production.up.railway.app/api/v1/auth/google/callback` |
| `FRONTEND_URL` | ❌ | ✅ | `https://bharatconnect.vercel.app` |

---

## 8. First Deploy के बाद डेटाबेस माइग्रेशन और सीड

डिप्लॉयमेंट पूरा होने के बाद Railway Dashboard में सर्विस खोलें, **Deployments** ➔ **View Logs** ➔ **Exec (Shell)** टैब में जाएं और यह कमांड चलाएं:

```bash
npm run db:migrate && npm run db:seed
```

यह कमांड:
- आपके Supabase PostgreSQL में सभी 11 टेबल्स (users, posts, groups, events, products आदि) बना देगा।
- 5 डेमो नागरिक (Aarav, Priya, Rohan, Ananya, Vikram), 10 देसी पोस्ट्स, 5 ग्रुप्स, 5 इवेंट्स और 5 हाट प्रोडक्ट्स को Idempotently लोड कर देगा।

---

## 9. Smoke Test चलाना (डिप्लॉयमेंट सत्यापन)

अपने कंप्यूटर के टर्मिनल से लाइव URLs के विरुद्ध ऑटोमेटेड स्मोक टेस्ट चलाएं:

```bash
bash scripts/smoke-test.sh https://api.bharatconnect.in https://bharatconnect.in
```

यह 6 महत्वपूर्ण स्तरों की जाँच करता है:
1. `GET /api/health` ➔ 200 OK (Backend Active)
2. `POST /api/v1/auth/register` ➔ 201 Created
3. `POST /api/v1/auth/login` ➔ 200 OK + HttpOnly Set-Cookie
4. `GET /` ➔ 200 OK (BharatConnect SPA Entry)
5. `GET /manifest.json` ➔ 200 OK (PWA Manifest)
6. `GET /sw.js` ➔ 200 OK (Service Worker Script)

---

## 10. रोलबैक प्रक्रिया (Rollback Plan)

- **Vercel (Frontend)**:
  - Vercel Dashboard ➔ Deployments में जाएं।
  - पिछले स्थिर डिप्लॉयमेंट के सामने तीन डॉट्स (...) पर क्लिक करें और **Promote to Production** दबाएं। यह 5 सेकंड में बिना डाउनटाइम के रोलबैक कर देता है।
- **Railway (Backend)**:
  - Railway Dashboard ➔ Deployments में जाएं।
  - पिछले सफल बिल्ड पर **Redeploy** दबाएं।

---

## 11. लागत अनुमान तालिका (Cost Estimation Table)

| सेवा (Service) | फ्री टीयर (Free Hobby) | उत्पादन स्तर (Production) | क्षमता (Capacity) |
|---|---|---|---|
| **Vercel** | $0 / महीना | $0 / महीना | असीमित बैंडविड्थ (व्यक्तिगत उपयोग) |
| **Railway** | $5 क्रेडिट ट्रायल | ~$5.00 / महीना | 8 GB RAM, 8 vCPU शेयर्ड |
| **Supabase** | $0 / महीना | $0 / महीना | 500 MB डेटाबेस, 50,000 मासिक एक्टिव यूज़र्स |
| **Cloudinary** | $0 / महीना | $0 / महीना | 25 क्रेडिट्स (~1,00,000 कंप्रेस्ड WebP इमेजेस) |
| **कुल अनुमानित खर्च** | **$0.00 / महीना** | **~$5.00 / महीना (₹420/महीना)** | **10,000+ सक्रिय भारतीय नागरिकों तक** |

---

## 12. कस्टम डोमेन और DNS सेटअप (Custom Domain & DNS)

अपने डोमेन रजिस्ट्रार (Cloudflare, GoDaddy, Namecheap आदि) में ये DNS रिकॉर्ड्स जोड़ें:

| Type | Host / Name | Target / Value | उद्देश्य (Purpose) |
|---|---|---|---|
| `CNAME` | `@` या `www` | `cname.vercel-dns.com` | `bharatconnect.in` को Vercel Frontend से जोड़ता है |
| `CNAME` | `api` | `<your-backend>.up.railway.app` | `api.bharatconnect.in` को Railway Backend से जोड़ता है |

*नोट:* DNS प्रोपेगेशन में 5 से 15 मिनट का समय लगता है। SSL सर्टिफिकेट Let's Encrypt द्वारा ऑटोमैटिकली जारी कर दिया जाता है।
