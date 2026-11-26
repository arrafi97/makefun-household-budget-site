// HearthLedger data — the Hartono household, November 2026.
// Every figure on the site is computed from this file: category totals,
// month totals and the dashboard KPIs are all derived in main.js, so the
// numbers can never drift apart. Amounts are US dollars.

var LEDGER = {
  household: 'The Hartono Household',
  month: 'November 2026',
  monthShort: 'Nov 2026',
  asOf: '26 November 2026',
  daysIn: 26,
  currency: '$',

  income: [
    { source: 'Maya Hartono — salary, Riverside Clinic', amount: 3850.00, date: '2026-11-01' },
    { source: 'Dimas Hartono — salary, Northgate Logistics', amount: 2390.00, date: '2026-11-01' }
  ],

  categories: [
    { id: 'housing',   name: 'Housing',      budget: 1450, color: '#1f4d3a', note: 'Rent, paid on the 1st' },
    { id: 'groceries', name: 'Groceries',    budget: 720,  color: '#2e7d5b', note: 'Weekly shop, two markets' },
    { id: 'eating',    name: 'Eating out',   budget: 220,  color: '#d97706', note: 'Cafes, takeaway, work lunches' },
    { id: 'transport', name: 'Transport',    budget: 310,  color: '#2563eb', note: 'Petrol, bus pass, rides' },
    { id: 'utilities', name: 'Utilities',    budget: 285,  color: '#7c3aed', note: 'Power, water, internet, phone' },
    { id: 'health',    name: 'Health',       budget: 340,  color: '#dc2626', note: 'Insurance, pharmacy, dentist' },
    { id: 'kids',      name: 'Kids & school',budget: 340,  color: '#0891b2', note: 'Lunches, books, trips' },
    { id: 'fun',       name: 'Fun & leisure',budget: 160,  color: '#db2777', note: 'Cinema, games, books' },
    { id: 'clothing',  name: 'Clothing',     budget: 120,  color: '#65a30d', note: 'Shoes and everyday wear' },
    { id: 'home',      name: 'Home & garden',budget: 150,  color: '#92400e', note: 'Repairs and furnishings' },
    { id: 'subs',      name: 'Subscriptions',budget: 86,   color: '#475569', note: 'Streaming, music, cloud' },
    { id: 'personal',  name: 'Personal',     budget: 200,  color: '#0f766e', note: 'Haircuts, gifts, skincare' }
  ],

  // One row per real spend, 1–26 November 2026. The site totals these.
  transactions: [
    { date: '2026-11-01', merchant: 'Hartono Property',    note: 'November rent',            cat: 'housing',   amount: 1450.00 },
    { date: '2026-11-01', merchant: 'GreenMart',           note: 'Weekly shop',             cat: 'groceries', amount: 96.40 },
    { date: '2026-11-02', merchant: 'CityTransit',         note: 'Bus pass top-up',         cat: 'transport', amount: 45.00 },
    { date: '2026-11-02', merchant: 'Kopi Pagi',           note: 'Coffee & pastries',       cat: 'eating',    amount: 18.50 },
    { date: '2026-11-03', merchant: 'City Power',          note: 'Electricity bill',        cat: 'utilities', amount: 118.20 },
    { date: '2026-11-03', merchant: 'Sehat Pharmacy',      note: 'Vitamins & plasters',     cat: 'health',    amount: 24.75 },
    { date: '2026-11-03', merchant: 'DailyPost',           note: 'News subscription',       cat: 'subs',      amount: 12.00 },
    { date: '2026-11-04', merchant: 'SDN 12 Canteen',      note: 'School lunch money',      cat: 'kids',      amount: 40.00 },
    { date: '2026-11-05', merchant: 'FiberNet',            note: 'Home internet',           cat: 'utilities', amount: 65.00 },
    { date: '2026-11-05', merchant: 'GreenMart',           note: 'Weekly shop',             cat: 'groceries', amount: 88.15 },
    { date: '2026-11-06', merchant: 'Shell Station',       note: 'Petrol',                  cat: 'transport', amount: 42.30 },
    { date: '2026-11-07', merchant: 'Warung Sederhana',    note: 'Family dinner',           cat: 'eating',    amount: 46.80 },
    { date: '2026-11-07', merchant: 'GlowLab',             note: 'Skincare',                cat: 'personal',  amount: 42.50 },
    { date: '2026-11-08', merchant: 'FreshMarket',         note: 'Weekly shop',             cat: 'groceries', amount: 102.60 },
    { date: '2026-11-08', merchant: 'Cineplex',            note: 'Cinema tickets, 4 seats', cat: 'fun',       amount: 32.00 },
    { date: '2026-11-09', merchant: 'City Water',          note: 'Water bill',              cat: 'utilities', amount: 41.60 },
    { date: '2026-11-10', merchant: 'SportZone',           note: "Kids' shoes",             cat: 'clothing',  amount: 58.00 },
    { date: '2026-11-10', merchant: 'CloudBox',            note: 'Cloud storage 100 GB',    cat: 'subs',      amount: 4.99 },
    { date: '2026-11-11', merchant: 'GreenMart',           note: 'Weekly shop',             cat: 'groceries', amount: 91.25 },
    { date: '2026-11-12', merchant: 'Bistro 88',           note: 'Lunch with colleagues',   cat: 'eating',    amount: 27.40 },
    { date: '2026-11-13', merchant: 'Shell Station',       note: 'Petrol',                  cat: 'transport', amount: 38.90 },
    { date: '2026-11-14', merchant: 'BrightSmile Dental',  note: 'Check-up, two children',  cat: 'health',    amount: 71.00 },
    { date: '2026-11-14', merchant: 'GiftShop',            note: 'Gift for Aunt Rina',      cat: 'personal',  amount: 65.00 },
    { date: '2026-11-15', merchant: 'Telko Mobile',        note: 'Phone bill, 2 lines',     cat: 'utilities', amount: 58.00 },
    { date: '2026-11-15', merchant: 'FreshMarket',         note: 'Weekly shop',             cat: 'groceries', amount: 84.70 },
    { date: '2026-11-16', merchant: 'Gramedia Books',      note: 'School books',            cat: 'kids',      amount: 62.50 },
    { date: '2026-11-16', merchant: 'BookHaven',           note: 'Novel for Maya',          cat: 'fun',       amount: 38.00 },
    { date: '2026-11-17', merchant: 'Pizza Rumah',         note: 'Takeaway pizza',          cat: 'eating',    amount: 31.20 },
    { date: '2026-11-18', merchant: 'HomeDepot',           note: 'Curtains, living room',   cat: 'home',      amount: 54.00 },
    { date: '2026-11-19', merchant: 'GreenMart',           note: 'Weekly shop',             cat: 'groceries', amount: 97.80 },
    { date: '2026-11-19', merchant: 'City Parking',        note: 'Downtown parking',        cat: 'transport', amount: 12.00 },
    { date: '2026-11-20', merchant: 'Sehat Insurance',     note: 'Health insurance',        cat: 'health',    amount: 210.00 },
    { date: '2026-11-20', merchant: 'GoRide',              note: 'Ride-hailing, airport',   cat: 'transport', amount: 18.40 },
    { date: '2026-11-21', merchant: 'SDN 12',              note: 'School trip contribution',cat: 'kids',      amount: 85.00 },
    { date: '2026-11-21', merchant: 'GreenMart',           note: 'Weekly shop',             cat: 'groceries', amount: 79.35 },
    { date: '2026-11-22', merchant: 'ToyStore',            note: 'Board games',             cat: 'fun',       amount: 45.90 },
    { date: '2026-11-22', merchant: 'Kopi Pagi',           note: 'Sunday brunch',           cat: 'eating',    amount: 34.60 },
    { date: '2026-11-23', merchant: 'Shell Station',       note: 'Petrol',                  cat: 'transport', amount: 44.10 },
    { date: '2026-11-23', merchant: 'DailyWear',           note: 'Shirt for Dimas',         cat: 'clothing',  amount: 16.00 },
    { date: '2026-11-24', merchant: 'HomeDepot',           note: 'Light bulbs & tools',     cat: 'home',      amount: 33.95 },
    { date: '2026-11-24', merchant: 'FreshMarket',         note: 'Weekly shop',             cat: 'groceries', amount: 72.55 },
    { date: '2026-11-25', merchant: 'Aman Insurance',      note: 'Car insurance',           cat: 'transport', amount: 96.00 },
    { date: '2026-11-25', merchant: 'StreamFlix',          note: 'Streaming, monthly',      cat: 'subs',      amount: 15.99 },
    { date: '2026-11-25', merchant: 'TuneWave',            note: 'Music, monthly',          cat: 'subs',      amount: 9.99 },
    { date: '2026-11-26', merchant: 'Barber Joe',          note: 'Haircut',                 cat: 'personal',  amount: 28.00 },
    { date: '2026-11-26', merchant: 'Gramedia Books',      note: 'School supplies',         cat: 'kids',      amount: 99.50 },
    { date: '2026-11-26', merchant: 'FitLife Gym',         note: 'Gym, paid early',         cat: 'subs',      amount: 35.00 }
  ],

  goals: [
    { id: 'emergency', name: 'Emergency fund',   saved: 8400, target: 10000, monthly: 500, note: 'Six months of essential spending, for the unexpected.' },
    { id: 'holiday',   name: 'Family holiday',   saved: 1150, target: 2400,  monthly: 250, note: 'A week by the sea next school break — flights and a cottage.' },
    { id: 'car',       name: 'Car down payment', saved: 3200, target: 6000,  monthly: 300, note: 'Replacing the 2014 hatchback before it gives up.' }
  ],

  bills: [
    { name: 'Rent',             amount: 1450.00, due: '2026-11-01', paid: '2026-11-01', cat: 'housing' },
    { name: 'Home internet',    amount: 65.00,   due: '2026-11-05', paid: '2026-11-05', cat: 'utilities' },
    { name: 'Electricity',      amount: 118.20,  due: '2026-11-12', paid: '2026-11-03', cat: 'utilities' },
    { name: 'Water',            amount: 41.60,   due: '2026-11-18', paid: '2026-11-09', cat: 'utilities' },
    { name: 'Phone, 2 lines',   amount: 58.00,   due: '2026-11-15', paid: '2026-11-15', cat: 'utilities' },
    { name: 'Health insurance', amount: 210.00,  due: '2026-11-20', paid: '2026-11-20', cat: 'health' },
    { name: 'Car insurance',    amount: 96.00,   due: '2026-11-25', paid: '2026-11-25', cat: 'transport' },
    { name: 'Music',            amount: 9.99,    due: '2026-11-25', paid: '2026-11-25', cat: 'subs' },
    { name: 'Streaming',        amount: 15.99,   due: '2026-11-28', paid: null,         cat: 'subs' },
    { name: 'Gym',              amount: 35.00,   due: '2026-11-30', paid: '2026-11-26', cat: 'subs' },
    { name: 'School fees',      amount: 120.00,  due: '2026-12-01', paid: null,         cat: 'kids' }
  ],

  // Six months of income, spending and saving, for the trend charts.
  months: [
    { month: 'Jun', income: 6100, spent: 4020, saved: 980 },
    { month: 'Jul', income: 6240, spent: 4150, saved: 1010 },
    { month: 'Aug', income: 6180, spent: 3980, saved: 990 },
    { month: 'Sep', income: 6240, spent: 4210, saved: 1000 },
    { month: 'Oct', income: 6310, spent: 3890, saved: 1120 },
    { month: 'Nov', income: 6240, spent: 3985, saved: 1050 }
  ],

  tips: [
    'Groceries are $7.20 under budget with four days left — the weekly shop is holding steady.',
    'Utilities are nearly at their limit: $2.20 left. The electricity bill came in $8 higher than October.',
    'Eating out is $61.50 under budget. Two home-cooked dinners a week saved about $40 this month.',
    'The emergency fund crosses $8,400 — 84% of the way to six months of cover.',
    'Transport is $13.30 under budget even after the car insurance payment on the 25th.'
  ]
};
