# Render Deployment Rehberi

## Backend Deployment (odata-proxy-backend)

### 1. Render'da Backend Servisi Oluşturma

1. Render.com'a giriş yapın
2. "New" → "Web Service" seçin
3. GitHub repository'nizi bağlayın
4. Aşağıdaki ayarları yapın:
   - **Name**: `odata-proxy-backend` (veya istediğiniz isim)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `odata-proxy-backend`

### 2. Backend Environment Variables

Backend servisiniz için şu environment variable'ları ekleyin:

```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-app-name.onrender.com
```

## Frontend Deployment (frontend)

### 1. Render'da Frontend Servisi Oluşturma

1. "New" → "Web Service" seçin
2. GitHub repository'nizi bağlayın
3. Aşağıdaki ayarları yapın:
   - **Name**: `odata-search-frontend` (veya istediğiniz isim)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `frontend`

### 2. Frontend Environment Variables

Frontend servisiniz için şu environment variable'ı ekleyin:

```
NEXT_PUBLIC_API_URL=https://your-backend-app-name.onrender.com
```

## Deployment Sonrası Güncellemeler

### 1. Backend URL'ini Güncelleme

Backend deploy edildikten sonra, Render'ın verdiği URL'i (örnek: `https://odata-proxy-backend-xxx.onrender.com`) alıp:

1. Frontend'in environment variable'ında `NEXT_PUBLIC_API_URL` değerini güncelleyin
2. Backend'in environment variable'ında `FRONTEND_URL` değerini güncelleyin

### 2. CORS Ayarları

Backend'deki `server.js` dosyasında CORS ayarları otomatik olarak production modunda çalışacaktır.

## Test Etme

1. Backend URL'ine gidip `https://your-backend-url/api/search?q=alfreds` şeklinde test edin
2. Frontend URL'ine gidip arama kutusunda test yapın

## Troubleshooting

### Backend Çalışmıyor

- Render logs'larını kontrol edin
- Environment variable'ların doğru ayarlandığından emin olun
- PORT değerinin 10000 olduğundan emin olun

### Frontend Backend'e Bağlanamıyor

- CORS hatası alıyorsanız, backend'de FRONTEND_URL environment variable'ını kontrol edin
- Frontend'de NEXT_PUBLIC_API_URL'in doğru backend URL'ini gösterdiğinden emin olun
- Tarayıcı console'unda network tab'ını kontrol edin

### Free Tier Limitasyonları

- Render free tier'da servisler 15 dakika inaktiflik sonrası sleep moduna geçer
- İlk istek biraz yavaş olabilir (cold start)
- Monthly build minute limiti vardır

## Güvenlik Notları

1. Production'da sadece gerekli domain'lere CORS izni verilmiştir
2. API anahtarları environment variable'lar olarak saklanmalıdır
3. Sensitive bilgileri kodda hardcode etmeyin

## Önemli Linkler

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Production Guide](https://expressjs.com/en/advanced/best-practice-performance.html)
