# Weather, Crypto & News Dashboard 🌦️📈📰

This is a dynamic, real-time dashboard built using **Next.js 14 (App Router)** that provides:

- 🌦️ Current and historical weather data using [OpenWeatherMap](https://openweathermap.org/api) & [Open-Meteo](https://open-meteo.com/)
- 📈 Live cryptocurrency prices using [CoinGecko API](https://www.coingecko.com/en/api) and Binance WebSocket
- 📰 Latest news articles using [NewsData.io](https://newsdata.io/)

## 🚀 Features

- Real-time crypto updates via Binance WebSocket
- Weather details by city using OpenWeatherMap
- Historical weather temperature trends using Open-Meteo
- Top 5 latest news from NewsData.io
- Responsive and clean UI
- Built with Redux Toolkit for state management

---

## 📦 Technologies Used

- **Next.js 14** (App Router)
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **WebSocket** for live crypto updates
- **OpenWeatherMap**, **Open-Meteo**, **CoinGecko**, and **NewsData.io** APIs

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file at the root and add:

```env
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_newsdata_api_key
```


_You can get your API keys from:_

- 🌦️ [OpenWeatherMap](https://openweathermap.org/api)
- 📰 [NewsData.io](https://newsdata.io/)

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

Deployed at Vercel : [https://dashboard-gilt-seven-55.vercel.app/dashboard](https://dashboard-gilt-seven-55.vercel.app/dashboard) 
---

## 📂 Folder Structure Overview

```bash
.
sc/
├── app/
│   ├── page.js                     # Main landing page
│   ├── dashboard/
│   │   └── page.js                 # Dashboard combining weather/news/crypto
│   ├── crypto/[id]/
│   │   └── page.js                 # Dynamic route for individual crypto details
│   ├── weather/[city]/
│   │   └── page.js                 # Dynamic route for individual city weather
│   ├── layout.js                   # Layout for entire app
│   └── globals.css                 # Global styles
│
├── hooks/
│   ├── useCryptoSocket.js         # WebSocket for live crypto prices
│   └── useWeatherAlerts.js        # Fetch & handle weather alerts
│
├── redux/
│   ├── slices/
│   │   ├── cryptoSlice.js         # Redux slice for crypto
│   │   ├── dataSlice.js           # Slice for general data
│   │   ├── newsSlice.js           # Slice for news data
│   │   ├── preferencesSlice.js    # User preferences like theme or units
│   │   └── weatherSlice.js        # Redux slice for weather
│   ├── Providers.js               # Redux Provider wrapper
│   └── store.js                   # Configured Redux store
│
├── lib/                            # Utility modules/helpers
├── public/                         # Static assets like favicon, images
├── .env.local                      # Environment variables (API keys)
└── .gitignore                      # Git ignore rules

```

---

## 🌐 APIs Used

### ✅ OpenWeatherMap API

Used for fetching **current weather data**.

Endpoint:  
`https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}`

---

### ✅ Open-Meteo API (Historical Weather)

Used to fetch **past weather data (temperature)**.

Endpoint:
```js
https://archive-api.open-meteo.com/v1/era5?latitude={lat}&longitude={lon}&start_date={YYYY-MM-DD}&end_date={YYYY-MM-DD}&hourly=temperature_2m&timezone=auto
```

---

### ✅ CoinGecko API

Used to get **crypto prices** without authentication.

Example endpoint:
```js
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd
```

---

### ✅ Binance WebSocket (Live Stream)

Live updates of crypto prices:

```js
const ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade");
```

---

### ✅ NewsData.io API

Used to get the **latest 5 news articles**:

```js
https://newsdata.io/api/1/news?apikey={API_KEY}&language=en&q=weather
```

---

## 🚀 Deployment

### 🔧 On Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Import your GitHub project
3. In **Settings > Environment Variables**, add:
   - `NEXT_PUBLIC_OPENWEATHERMAP_API_KEY`
   - `NEXT_PUBLIC_NEWS_API_KEY`
4. Click **Deploy**

**Note:**  
If you're using dynamic routes like `/weather/[city]`, make sure to add `generateStaticParams()` in your dynamic route file or set the route to use **dynamic rendering** (i.e., not `output: 'export'` in your `next.config.js`).

---

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenWeatherMap](https://openweathermap.org/api)
- [Open-Meteo](https://open-meteo.com/)
- [NewsData.io](https://newsdata.io/)
- [CoinGecko](https://www.coingecko.com/en/api)
- [Binance WebSocket](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md)
