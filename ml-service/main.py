"""
AgriSmart ML Microservice
FastAPI service that scores and ranks crops using a weighted multi-factor model.
Run locally: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import math

app = FastAPI(title="AgriSmart ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://agrismart.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── INPUT SCHEMA ──────────────────────────────────────────────────────────────

class RecommendRequest(BaseModel):
    state_name:     Optional[str]   = ""
    lat:            Optional[float] = 20.0
    altitude_m:     Optional[float] = 0.0
    drought_risk:   float           = 55.0
    flood_risk:     float           = 15.0
    forecast_rain:  float           = 60.0
    current_temp:   float           = 28.0
    max_temp_14d:   float           = 35.0
    water:          str             = "medium"   # low | medium | high
    budget:         str             = "medium"   # low | medium | high
    risk_appetite:  str             = "medium"   # low | medium | high
    news_sentiment: Dict[str, float] = {}        # {"Wheat": 0.15, "Rice": -0.1}


# ── CROP DEFINITIONS ──────────────────────────────────────────────────────────

CROPS = [
    {
        "id": "wheat", "name": "Wheat", "name_hi": "गेहूँ", "icon": "🌾",
        "category": "Cereal", "season": "Rabi", "season_hi": "रबी",
        "months": [10, 11, 12, 1, 2, 3], "base_profit": 185000, "msp": 2275,
        "states": ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan",
                   "Bihar", "Uttarakhand", "Himachal Pradesh", "Gujarat", "Maharashtra",
                   "West Bengal"],
        "lat_range": [20, 32], "alt_range": [0, 2000],
        "min_rain": 25, "max_rain": 110, "min_temp": 8, "max_temp": 30,
        "water_need": "medium", "drought_tol": 0.60, "flood_tol": 0.35,
        "market_stability": 0.88,
        "detail": "Strong export demand, stable government MSP support",
    },
    {
        "id": "rice", "name": "Rice", "name_hi": "धान", "icon": "🌾",
        "category": "Cereal", "season": "Kharif", "season_hi": "खरीफ",
        "months": [5, 6, 7, 8, 9, 10], "base_profit": 95000, "msp": 2300,
        "states": ["West Bengal", "Uttar Pradesh", "Punjab", "Andhra Pradesh", "Telangana",
                   "Tamil Nadu", "Odisha", "Chhattisgarh", "Bihar", "Assam", "Karnataka",
                   "Kerala", "Maharashtra", "Jharkhand", "Haryana", "Gujarat", "Manipur",
                   "Tripura", "Meghalaya", "Nagaland", "Arunachal Pradesh", "Sikkim"],
        "lat_range": [8, 30], "alt_range": [0, 1500],
        "min_rain": 150, "max_rain": 400, "min_temp": 20, "max_temp": 38,
        "water_need": "very-high", "drought_tol": 0.10, "flood_tol": 0.80,
        "market_stability": 0.82,
        "detail": "Requires high water; suited for high-rainfall regions",
    },
    {
        "id": "maize", "name": "Maize", "name_hi": "मक्का", "icon": "🌽",
        "category": "Cereal", "season": "Kharif", "season_hi": "खरीफ",
        "months": [5, 6, 7, 8, 9], "base_profit": 110000, "msp": 2090,
        "states": ["Karnataka", "Andhra Pradesh", "Telangana", "Rajasthan", "Madhya Pradesh",
                   "Bihar", "Uttar Pradesh", "Himachal Pradesh", "Uttarakhand", "Maharashtra",
                   "Gujarat", "Punjab", "Haryana", "Tamil Nadu", "Odisha", "Jharkhand",
                   "West Bengal", "Manipur", "Assam", "Meghalaya", "Nagaland"],
        "lat_range": [12, 32], "alt_range": [0, 2700],
        "min_rain": 60, "max_rain": 200, "min_temp": 18, "max_temp": 38,
        "water_need": "medium", "drought_tol": 0.45, "flood_tol": 0.40,
        "market_stability": 0.72,
        "detail": "Poultry and starch industry demand growing steadily",
    },
    {
        "id": "bajra", "name": "Bajra", "name_hi": "बाजरा", "icon": "🌾",
        "category": "Cereal", "season": "Kharif", "season_hi": "खरीफ",
        "months": [5, 6, 7, 8, 9], "base_profit": 75000, "msp": 2625,
        "states": ["Rajasthan", "Gujarat", "Haryana", "Uttar Pradesh", "Maharashtra",
                   "Karnataka", "Andhra Pradesh", "Telangana", "Madhya Pradesh", "Tamil Nadu"],
        "lat_range": [15, 30], "alt_range": [0, 1500],
        "min_rain": 20, "max_rain": 80, "min_temp": 25, "max_temp": 42,
        "water_need": "very-low", "drought_tol": 0.92, "flood_tol": 0.25,
        "market_stability": 0.65,
        "detail": "Thrives in arid zones; excellent drought tolerance",
    },
    {
        "id": "jowar", "name": "Jowar", "name_hi": "ज्वार", "icon": "🌾",
        "category": "Cereal", "season": "Both", "season_hi": "दोनों",
        "months": [5, 6, 7, 8, 9, 10, 11], "base_profit": 80000, "msp": 3180,
        "states": ["Maharashtra", "Karnataka", "Andhra Pradesh", "Telangana", "Madhya Pradesh",
                   "Rajasthan", "Gujarat", "Tamil Nadu", "Uttar Pradesh"],
        "lat_range": [14, 28], "alt_range": [0, 1800],
        "min_rain": 30, "max_rain": 100, "min_temp": 20, "max_temp": 40,
        "water_need": "low", "drought_tol": 0.80, "flood_tol": 0.40,
        "market_stability": 0.68,
        "detail": "Dual-purpose grain and fodder crop; drought hardy",
    },
    {
        "id": "mustard", "name": "Mustard", "name_hi": "सरसों", "icon": "🌻",
        "category": "Oilseed", "season": "Rabi", "season_hi": "रबी",
        "months": [10, 11, 12, 1, 2, 3], "base_profit": 140000, "msp": 5650,
        "states": ["Rajasthan", "Uttar Pradesh", "Haryana", "Madhya Pradesh", "West Bengal",
                   "Gujarat", "Assam", "Bihar", "Punjab", "Uttarakhand"],
        "lat_range": [22, 32], "alt_range": [0, 1500],
        "min_rain": 20, "max_rain": 70, "min_temp": 8, "max_temp": 28,
        "water_need": "low", "drought_tol": 0.82, "flood_tol": 0.30,
        "market_stability": 0.74,
        "detail": "Edible oil demand rising; drought-tolerant Rabi crop",
    },
    {
        "id": "groundnut", "name": "Groundnut", "name_hi": "मूँगफली", "icon": "🥜",
        "category": "Oilseed", "season": "Kharif", "season_hi": "खरीफ",
        "months": [5, 6, 7, 8, 9, 10], "base_profit": 150000, "msp": 6783,
        "states": ["Gujarat", "Rajasthan", "Andhra Pradesh", "Tamil Nadu", "Karnataka",
                   "Maharashtra", "Madhya Pradesh", "Uttar Pradesh", "West Bengal", "Odisha",
                   "Telangana"],
        "lat_range": [10, 28], "alt_range": [0, 1000],
        "min_rain": 50, "max_rain": 180, "min_temp": 22, "max_temp": 40,
        "water_need": "medium", "drought_tol": 0.55, "flood_tol": 0.30,
        "market_stability": 0.72,
        "detail": "High-value oilseed with strong processing industry demand",
    },
    {
        "id": "soybean", "name": "Soybean", "name_hi": "सोयाबीन", "icon": "🫘",
        "category": "Oilseed", "season": "Kharif", "season_hi": "खरीफ",
        "months": [5, 6, 7, 8, 9, 10], "base_profit": 130000, "msp": 4892,
        "states": ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Telangana",
                   "Andhra Pradesh", "Gujarat", "Uttar Pradesh", "Chhattisgarh"],
        "lat_range": [16, 28], "alt_range": [0, 1000],
        "min_rain": 70, "max_rain": 200, "min_temp": 20, "max_temp": 38,
        "water_need": "medium", "drought_tol": 0.50, "flood_tol": 0.45,
        "market_stability": 0.70,
        "detail": "Global protein demand supporting prices",
    },
    {
        "id": "sunflower", "name": "Sunflower", "name_hi": "सूरजमुखी", "icon": "🌼",
        "category": "Oilseed", "season": "Both", "season_hi": "दोनों",
        "months": [2, 3, 4, 5, 6, 7, 8, 9], "base_profit": 120000, "msp": 7280,
        "states": ["Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra", "Tamil Nadu",
                   "Odisha", "Bihar", "Uttar Pradesh", "Gujarat", "Haryana", "Punjab"],
        "lat_range": [12, 30], "alt_range": [0, 1500],
        "min_rain": 25, "max_rain": 100, "min_temp": 18, "max_temp": 38,
        "water_need": "low", "drought_tol": 0.70, "flood_tol": 0.42,
        "market_stability": 0.68,
        "detail": "Oil demand stable; suits irrigated and rainfed",
    },
    {
        "id": "chickpea", "name": "Chickpea", "name_hi": "चना", "icon": "🫘",
        "category": "Pulse", "season": "Rabi", "season_hi": "रबी",
        "months": [10, 11, 12, 1, 2, 3], "base_profit": 165000, "msp": 5440,
        "states": ["Madhya Pradesh", "Rajasthan", "Uttar Pradesh", "Maharashtra", "Karnataka",
                   "Andhra Pradesh", "Gujarat", "Bihar", "Haryana", "Punjab", "Chhattisgarh",
                   "Telangana"],
        "lat_range": [16, 30], "alt_range": [0, 1500],
        "min_rain": 20, "max_rain": 65, "min_temp": 10, "max_temp": 32,
        "water_need": "low", "drought_tol": 0.75, "flood_tol": 0.28,
        "market_stability": 0.62,
        "detail": "Pulse MSP increased; protein demand growing",
    },
    {
        "id": "tur", "name": "Tur", "name_hi": "अरहर", "icon": "🫘",
        "category": "Pulse", "season": "Kharif", "season_hi": "खरीफ",
        "months": [5, 6, 7, 8, 9, 10, 11], "base_profit": 160000, "msp": 7550,
        "states": ["Maharashtra", "Karnataka", "Andhra Pradesh", "Telangana", "Uttar Pradesh",
                   "Madhya Pradesh", "Gujarat", "Rajasthan", "Tamil Nadu", "Odisha",
                   "Chhattisgarh", "Bihar", "Jharkhand"],
        "lat_range": [10, 28], "alt_range": [0, 1500],
        "min_rain": 60, "max_rain": 180, "min_temp": 20, "max_temp": 38,
        "water_need": "low", "drought_tol": 0.72, "flood_tol": 0.35,
        "market_stability": 0.60,
        "detail": "High MSP; chronic supply deficit keeps prices elevated",
    },
    {
        "id": "moong", "name": "Moong", "name_hi": "मूँग", "icon": "🫘",
        "category": "Pulse", "season": "Both", "season_hi": "दोनों",
        "months": [3, 4, 5, 6, 7, 8, 9], "base_profit": 120000, "msp": 8682,
        "states": ["Rajasthan", "Maharashtra", "Andhra Pradesh", "Karnataka", "Tamil Nadu",
                   "Gujarat", "Madhya Pradesh", "Uttar Pradesh", "Punjab", "Haryana",
                   "Odisha", "Bihar", "Telangana", "West Bengal"],
        "lat_range": [10, 30], "alt_range": [0, 1200],
        "min_rain": 40, "max_rain": 150, "min_temp": 25, "max_temp": 40,
        "water_need": "low", "drought_tol": 0.65, "flood_tol": 0.40,
        "market_stability": 0.63,
        "detail": "Short-duration crop; fits as relay or catch crop",
    },
    {
        "id": "cotton", "name": "Cotton", "name_hi": "कपास", "icon": "☁️",
        "category": "Cash Crop", "season": "Kharif", "season_hi": "खरीफ",
        "months": [4, 5, 6, 7, 8, 9, 10, 11], "base_profit": 220000, "msp": 7121,
        "states": ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Karnataka",
                   "Madhya Pradesh", "Haryana", "Punjab", "Rajasthan", "Tamil Nadu"],
        "lat_range": [14, 30], "alt_range": [0, 600],
        "min_rain": 60, "max_rain": 180, "min_temp": 22, "max_temp": 42,
        "water_need": "medium", "drought_tol": 0.52, "flood_tol": 0.35,
        "market_stability": 0.60,
        "detail": "High-value; black cotton soil regions have natural advantage",
    },
    {
        "id": "sugarcane", "name": "Sugarcane", "name_hi": "गन्ना", "icon": "🎋",
        "category": "Cash Crop", "season": "Annual", "season_hi": "वार्षिक",
        "months": list(range(12)), "base_profit": 280000, "msp": 340,
        "states": ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Andhra Pradesh",
                   "Telangana", "Gujarat", "Bihar", "Haryana", "Punjab", "Uttarakhand"],
        "lat_range": [12, 28], "alt_range": [0, 1200],
        "min_rain": 100, "max_rain": 300, "min_temp": 20, "max_temp": 40,
        "water_need": "very-high", "drought_tol": 0.25, "flood_tol": 0.55,
        "market_stability": 0.82,
        "detail": "Long gestation but guaranteed FRP pricing from mills",
    },
    {
        "id": "turmeric", "name": "Turmeric", "name_hi": "हल्दी", "icon": "🟡",
        "category": "Spice", "season": "Kharif", "season_hi": "खरीफ",
        "months": [5, 6, 7, 8, 9, 10, 11], "base_profit": 240000, "msp": None,
        "states": ["Andhra Pradesh", "Telangana", "Tamil Nadu", "Odisha", "Karnataka",
                   "West Bengal", "Maharashtra", "Kerala", "Assam", "Meghalaya", "Manipur"],
        "lat_range": [8, 22], "alt_range": [0, 1500],
        "min_rain": 150, "max_rain": 300, "min_temp": 20, "max_temp": 35,
        "water_need": "high", "drought_tol": 0.30, "flood_tol": 0.50,
        "market_stability": 0.65,
        "detail": "High-value spice; Nizamabad and Salem are major markets",
    },
    {
        "id": "chilli", "name": "Chilli", "name_hi": "मिर्च", "icon": "🌶️",
        "category": "Spice", "season": "Both", "season_hi": "दोनों",
        "months": [6, 7, 8, 9, 10, 11, 0, 1, 2], "base_profit": 200000, "msp": None,
        "states": ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra",
                   "Odisha", "West Bengal", "Rajasthan", "Gujarat", "Madhya Pradesh", "Punjab"],
        "lat_range": [10, 28], "alt_range": [0, 1200],
        "min_rain": 60, "max_rain": 180, "min_temp": 18, "max_temp": 38,
        "water_need": "medium", "drought_tol": 0.48, "flood_tol": 0.30,
        "market_stability": 0.55,
        "detail": "India dominates global chilli exports; prices volatile but high",
    },
    {
        "id": "potato", "name": "Potato", "name_hi": "आलू", "icon": "🥔",
        "category": "Vegetable", "season": "Rabi", "season_hi": "रबी",
        "months": [9, 10, 11, 0, 1, 2], "base_profit": 210000, "msp": None,
        "states": ["Uttar Pradesh", "West Bengal", "Bihar", "Punjab", "Madhya Pradesh",
                   "Gujarat", "Himachal Pradesh", "Assam", "Haryana", "Uttarakhand"],
        "lat_range": [22, 32], "alt_range": [0, 2500],
        "min_rain": 40, "max_rain": 120, "min_temp": 8, "max_temp": 25,
        "water_need": "high", "drought_tol": 0.30, "flood_tol": 0.25,
        "market_stability": 0.45,
        "detail": "High returns but prone to market gluts; cold storage helps",
    },
    {
        "id": "onion", "name": "Onion", "name_hi": "प्याज", "icon": "🧅",
        "category": "Vegetable", "season": "Both", "season_hi": "दोनों",
        "months": [9, 10, 11, 0, 1, 2, 3, 4, 5, 6], "base_profit": 180000, "msp": None,
        "states": ["Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat", "Rajasthan",
                   "Bihar", "Uttar Pradesh", "Andhra Pradesh", "Telangana", "Tamil Nadu",
                   "Haryana", "West Bengal"],
        "lat_range": [14, 28], "alt_range": [0, 1000],
        "min_rain": 30, "max_rain": 100, "min_temp": 12, "max_temp": 35,
        "water_need": "medium", "drought_tol": 0.45, "flood_tol": 0.28,
        "market_stability": 0.42,
        "detail": "Highly volatile prices; Nashik belt has infrastructure advantage",
    },
    {
        "id": "coconut", "name": "Coconut", "name_hi": "नारियल", "icon": "🥥",
        "category": "Plantation", "season": "Annual", "season_hi": "वार्षिक",
        "months": list(range(12)), "base_profit": 160000, "msp": None,
        "states": ["Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Goa",
                   "West Bengal", "Odisha", "Maharashtra", "Assam", "Tripura"],
        "lat_range": [8, 22], "alt_range": [0, 900],
        "min_rain": 150, "max_rain": 400, "min_temp": 22, "max_temp": 38,
        "water_need": "high", "drought_tol": 0.35, "flood_tol": 0.50,
        "market_stability": 0.78,
        "detail": "Perennial income; copra, oil, and tender coconut markets strong",
    },
    {
        "id": "banana", "name": "Banana", "name_hi": "केला", "icon": "🍌",
        "category": "Plantation", "season": "Annual", "season_hi": "वार्षिक",
        "months": list(range(12)), "base_profit": 250000, "msp": None,
        "states": ["Tamil Nadu", "Maharashtra", "Andhra Pradesh", "Karnataka", "Gujarat",
                   "Madhya Pradesh", "West Bengal", "Kerala", "Bihar", "Assam", "Tripura",
                   "Odisha"],
        "lat_range": [8, 25], "alt_range": [0, 1200],
        "min_rain": 100, "max_rain": 300, "min_temp": 22, "max_temp": 38,
        "water_need": "high", "drought_tol": 0.25, "flood_tol": 0.40,
        "market_stability": 0.70,
        "detail": "Year-round income; Jalgaon and Anantapur are major belts",
    },
    {
        "id": "ginger", "name": "Ginger", "name_hi": "अदरक", "icon": "🫚",
        "category": "Spice", "season": "Kharif", "season_hi": "खरीफ",
        "months": [3, 4, 5, 6, 7, 8, 9, 10, 11], "base_profit": 300000, "msp": None,
        "states": ["Kerala", "Meghalaya", "Arunachal Pradesh", "Sikkim", "Nagaland",
                   "Odisha", "Assam", "West Bengal", "Karnataka", "Himachal Pradesh",
                   "Uttarakhand", "Manipur", "Mizoram"],
        "lat_range": [8, 30], "alt_range": [300, 1800],
        "min_rain": 150, "max_rain": 350, "min_temp": 15, "max_temp": 35,
        "water_need": "high", "drought_tol": 0.25, "flood_tol": 0.45,
        "market_stability": 0.62,
        "detail": "High-value spice; export demand from Middle East growing",
    },
    {
        "id": "tea", "name": "Tea", "name_hi": "चाय", "icon": "🍵",
        "category": "Plantation", "season": "Annual", "season_hi": "वार्षिक",
        "months": list(range(12)), "base_profit": 350000, "msp": None,
        "states": ["Assam", "West Bengal", "Tamil Nadu", "Kerala", "Karnataka",
                   "Himachal Pradesh", "Uttarakhand", "Arunachal Pradesh", "Manipur",
                   "Sikkim", "Tripura", "Meghalaya", "Nagaland", "Mizoram"],
        "lat_range": [8, 28], "alt_range": [300, 2200],
        "min_rain": 200, "max_rain": 500, "min_temp": 13, "max_temp": 32,
        "water_need": "very-high", "drought_tol": 0.20, "flood_tol": 0.55,
        "market_stability": 0.75,
        "detail": "Perennial plantation; Assam CTC and Darjeeling fetch premium",
    },
    {
        "id": "apple", "name": "Apple", "name_hi": "सेब", "icon": "🍎",
        "category": "Fruit", "season": "Annual", "season_hi": "वार्षिक",
        "months": list(range(12)), "base_profit": 500000, "msp": None,
        "states": ["Himachal Pradesh", "Jammu & Kashmir", "Uttarakhand",
                   "Arunachal Pradesh", "Nagaland"],
        "lat_range": [30, 37], "alt_range": [1500, 2700],
        "min_rain": 100, "max_rain": 250, "min_temp": 2, "max_temp": 22,
        "water_need": "medium", "drought_tol": 0.40, "flood_tol": 0.35,
        "market_stability": 0.78,
        "detail": "Premium fruit; Shimla and Kullu belt command highest prices",
    },
]


# ── GEO FILTER ────────────────────────────────────────────────────────────────

from datetime import datetime

def geo_filter(crops: list, state_name: str, lat: float, altitude_m: float) -> list:
    current_month = datetime.now().month - 1  # 0-indexed

    candidates = []
    for c in crops:
        # State match
        if state_name:
            match = any(
                state_name.lower() in s.lower() or s.lower() in state_name.lower()
                for s in c["states"]
            )
            if not match:
                continue

        # Lat range
        if not (c["lat_range"][0] <= lat <= c["lat_range"][1]):
            continue

        # Altitude range
        if not (c["alt_range"][0] <= altitude_m <= c["alt_range"][1]):
            continue

        # Season relevance (±3 months window, annual always included)
        if c["season"] != "Annual":
            window = [(current_month + o) % 12 for o in range(-3, 4)]
            if not any(m in window for m in c["months"]):
                continue

        candidates.append(c)

    # Fallback: relax season filter
    if len(candidates) < 4:
        candidates = [
            c for c in crops
            if (not state_name or any(
                state_name.lower() in s.lower() or s.lower() in state_name.lower()
                for s in c["states"]
            )) and c["alt_range"][0] <= altitude_m <= c["alt_range"][1]
        ]

    return candidates


# ── SCORING ENGINE ────────────────────────────────────────────────────────────

def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))

def get_weights(risk_appetite: str) -> dict:
    return {
        "low":    {"profit": 0.20, "weather": 0.35, "risk": 0.30, "market": 0.15},
        "medium": {"profit": 0.30, "weather": 0.28, "risk": 0.27, "market": 0.15},
        "high":   {"profit": 0.45, "weather": 0.20, "risk": 0.15, "market": 0.20},
    }.get(risk_appetite, {"profit": 0.30, "weather": 0.28, "risk": 0.27, "market": 0.15})

WATER_TABLE = {
    "low":    {"very-low": 1.00, "low": 0.92, "medium": 0.65, "high": 0.30, "very-high": 0.05},
    "medium": {"very-low": 0.80, "low": 0.90, "medium": 1.00, "high": 0.70, "very-high": 0.35},
    "high":   {"very-low": 0.65, "low": 0.78, "medium": 0.92, "high": 1.00, "very-high": 0.80},
}

def score_crop(crop: dict, req: RecommendRequest, max_profit: float) -> dict:
    # 1. Weather score
    rain_in_range = crop["min_rain"] <= req.forecast_rain <= crop["max_rain"]
    if rain_in_range:
        rain_score = 1.0
    elif req.forecast_rain < crop["min_rain"]:
        rain_score = clamp(req.forecast_rain / crop["min_rain"], 0, 1) * crop["drought_tol"]
    else:
        rain_score = clamp(crop["max_rain"] / req.forecast_rain, 0, 1) * crop["flood_tol"]

    temp_mid = (crop["min_temp"] + crop["max_temp"]) / 2
    temp_in_range = crop["min_temp"] <= req.current_temp <= crop["max_temp"]
    temp_score = 1.0 if temp_in_range else clamp(1 - abs(req.current_temp - temp_mid) / 20, 0, 1)
    weather_score = rain_score * 0.65 + temp_score * 0.35

    # 2. Risk score
    drought_impact = (req.drought_risk / 100) * (1 - crop["drought_tol"])
    flood_impact   = (req.flood_risk   / 100) * (1 - crop["flood_tol"])
    heat_penalty   = max(0, (req.max_temp_14d - 40) * 0.03) if req.max_temp_14d > 40 and crop["max_temp"] < 38 else 0
    risk_score = clamp(1 - drought_impact - flood_impact - heat_penalty, 0, 1)

    # 3. Water match
    water_score = WATER_TABLE.get(req.water, WATER_TABLE["medium"]).get(crop["water_need"], 0.6)

    # 4. Profit score
    profit_score  = crop["base_profit"] / max_profit if max_profit > 0 else 0.5
    budget_penalty = 0.22 if req.budget == "low" and crop["water_need"] in ("high", "very-high") else 0
    adj_profit = clamp(profit_score - budget_penalty, 0, 1)

    # 5. Market score
    sentiment   = req.news_sentiment.get(crop["name"], 0)
    market_score = clamp(crop["market_stability"] + sentiment, 0, 1)

    # Weighted final
    w = get_weights(req.risk_appetite)
    final = (
        w["profit"]  * adj_profit +
        w["weather"] * weather_score * water_score +
        w["risk"]    * risk_score +
        w["market"]  * market_score
    )

    confidence = int(clamp(final * 100, 40, 96))
    risk_level = "Low" if confidence > 76 else "Medium" if confidence > 62 else "High"

    # Build explanation
    parts = []
    if rain_in_range:
        parts.append(f"Forecast rainfall ({req.forecast_rain}mm) matches ideal range")
    elif req.forecast_rain < crop["min_rain"] and crop["drought_tol"] > 0.7:
        parts.append(f"Low rainfall ok — {crop['name']} is drought-tolerant")
    elif req.forecast_rain < crop["min_rain"]:
        parts.append(f"⚠ Forecast rain ({req.forecast_rain}mm) below ideal ({crop['min_rain']}mm+)")
    if req.drought_risk > 55 and crop["drought_tol"] > 0.65:
        parts.append(f"High drought risk ({int(req.drought_risk)}%) favours this crop")
    if req.drought_risk > 55 and crop["drought_tol"] < 0.35:
        parts.append(f"⚠ High drought risk ({int(req.drought_risk)}%) is a concern")
    if req.max_temp_14d > 40 and crop["max_temp"] < 38:
        parts.append(f"⚠ Forecast heat ({int(req.max_temp_14d)}°C) may cause stress")
    if sentiment > 0.08:
        parts.append("Positive market news sentiment detected")
    if sentiment < -0.08:
        parts.append("⚠ Negative news signal for this crop")
    if crop.get("msp"):
        parts.append(f"MSP ₹{crop['msp']:,}/qtl provides a price floor")
    if water_score < 0.45:
        parts.append("⚠ Water availability may limit yield")

    return {
        "id":           crop["id"],
        "name":         crop["name"],
        "name_hi":      crop["name_hi"],
        "icon":         crop["icon"],
        "category":     crop["category"],
        "season":       crop["season"],
        "season_hi":    crop["season_hi"],
        "base_profit":  crop["base_profit"],
        "msp":          crop.get("msp"),
        "detail":       crop["detail"],
        "water_need":   crop["water_need"],
        "confidence":   confidence,
        "risk_level":   risk_level,
        "top_pick":     False,
        "explanation":  " · ".join(parts) if parts else "Suitable for your region and current conditions",
        "scores": {
            "weather": int(weather_score * 100),
            "risk":    int(risk_score    * 100),
            "profit":  int(adj_profit    * 100),
            "market":  int(market_score  * 100),
            "water":   int(water_score   * 100),
        },
    }


# ── ENDPOINTS ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "AgriSmart ML Service"}


@app.post("/recommend")
def recommend(req: RecommendRequest):
    candidates = geo_filter(CROPS, req.state_name or "", req.lat or 20.0, req.altitude_m or 0.0)

    if not candidates:
        raise HTTPException(status_code=404, detail="No crops found for this location")

    max_profit = max(c["base_profit"] for c in candidates)
    scored = [score_crop(c, req, max_profit) for c in candidates]
    scored.sort(key=lambda x: x["confidence"], reverse=True)

    top8 = scored[:8]
    if top8:
        top8[0]["top_pick"] = True

    return {"crops": top8, "total_candidates": len(candidates)}


@app.get("/crops")
def list_crops():
    """List all crops in the database with their geo constraints."""
    return {"crops": CROPS, "count": len(CROPS)}
