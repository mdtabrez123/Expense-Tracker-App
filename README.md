# Expense Tracker App (Full Stack)

A mobile application built with React Native, Node.js, and MongoDB to track daily expenses.

## 🚀 Features
- **User Authentication:** Secure Login and Register using JWT.
- **Expense Management:** Add expenses with amount, category, date, and notes.
- **Dashboard:** Real-time expense list with category-wise summary.
- **User Experience:** Handled loading states and empty states (No expenses yet).
- **Validation:** Frontend validation to prevent negative amounts or empty categories.

## 🛠️ Tech Stack
- **Frontend:** React Native (Expo), React Navigation, Context API, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas.

## ⚙️ Setup Instructions

### Backend:
1. Navigate to `/backend`.
2. Run `npm install`.
3. Create a `.env` file with `MONGO_URI` and `JWT_SECRET`.
4. Run `npm start`.

### Frontend:
1. Navigate to `/frontend`.
2. Run `npm install`.
3. Update the `API_URL` in your services with your machine's IP address.
4. Run `npx expo start`.

## 🧠 Problem Solving & Edge Cases
- Implemented **Loading Spinners** for API calls.
- Displayed **Empty State messages** when no data is found.
- Added **Form Validation** for input fields.