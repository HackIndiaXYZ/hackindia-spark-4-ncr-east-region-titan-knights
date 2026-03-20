'use client';
import { create } from 'zustand';

export const useStore = create((set) => ({
  lang:     'en',
  setLang:  (lang) => set({ lang }),

  user:     null,
  setUser:  (user) => set({ user }),

  userData:    null,
  setUserData: (data) => set({ userData: data }),

  weather:    null,
  setWeather: (w) => set({ weather: w }),

  crops:    [],
  setCrops: (c) => set({ crops: c }),

  news:    [],
  setNews: (n) => set({ news: n }),

  newsInsights: { sentiment: {}, signals: [], marketSummary: null },
  setNewsInsights: (i) => set({ newsInsights: i }),

  weatherError: false,
  setWeatherError: (e) => set({ weatherError: e }),

  newsError: false,
  setNewsError: (e) => set({ newsError: e }),
}));
