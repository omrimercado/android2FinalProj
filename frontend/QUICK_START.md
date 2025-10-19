# 💬 מערכת צ'אט - מדריך מהיר

## ⚡ 2 צעדים פשוטים

### 1️⃣ הפעל את השרת (עם WebSocket מובנה)
```bash
cd server
npm install
npm start
```

**אמור להופיע:**
```
🚀 Server is running on port 5000
💬 WebSocket Chat available at ws://localhost:5000/chat
```

### 2️⃣ הפעל את האפליקציה
```bash
cd frontend
npm start
```

### 3️⃣ השתמש
1. התחבר לאפליקציה
2. לך לעמוד הפיד
3. **לחץ על תמונת משתמש** של פוסט
4. הצ'אט ייפתח! 🎉

---

## ✨ תכונות

- 💬 **צ'אט בזמן אמת** - הודעות מיידיות
- 📬 **הודעות למשתמשים לא מחוברים** - נשמרות במסד נתונים
- 🟢 **אינדיקציית סטטוס** - תראה אם המשתמש השני מחובר
- ⌨️ **אינדיקציית הקלדה** - תראה כשהמשתמש השני מקליד
- 💾 **שמירה במסד נתונים** - כל ההודעות נשמרות ב-MongoDB
- 📜 **היסטוריית שיחות** - גישה להודעות קודמות

---

## 📋 מה נוצר?

### Backend:
- ✅ `server/models/Message.js` - מודל הודעות
- ✅ `server/controllers/chatController.js` - לוגיקת צ'אט
- ✅ `server/routes/chatRoutes.js` - API endpoints
- ✅ `server/server.js` - WebSocket מובנה בשרת

### Frontend:
- ✅ `src/components/ChatWindow.jsx` - קומפוננטת הצ'אט
- ✅ `src/components/ChatWindow.css` - עיצוב
- ✅ `src/services/api.js` - Auth & Groups APIs
- ✅ `src/services/chatApi.js` - Chat & WebSocket APIs
- ✅ `src/services/index.js` - מאחד הכל
- ✅ `src/hooks/useWebSocket.js` - WebSocket hook
- ✅ `src/pages/FeedPage.jsx` - משולב עם צ'אט

---

## 🔧 התאמות

**משתני סביבה (.env):**
```env
REACT_APP_WS_URL=ws://localhost:5000/chat
```

**שינוי עיצוב:** ערוך `ChatWindow.css`

---

## 🗄️ API Endpoints

| Method | Endpoint | תיאור |
|--------|----------|-------|
| GET | `/api/chat/conversations` | קבלת כל השיחות |
| GET | `/api/chat/conversation/:userId/:targetUserId` | קבלת שיחה ספציפית |
| PUT | `/api/chat/conversation/:conversationId/read` | סימון הודעות כנקראו |
| DELETE | `/api/chat/conversation/:conversationId` | מחיקת שיחה |

---

## ❓ בעיות?

| בעיה | פתרון |
|------|--------|
| החלונית לא נפתחת | בדוק ש-user מכיל id, name, avatar |
| שגיאת חיבור | השרת חייב לרוץ על פורט 5000 |
| הודעות לא נשמרות | בדוק חיבור ל-MongoDB |
| הודעות לא מגיעות | בדוק Console לשגיאות |

**למידע מפורט:** `CHAT_SETUP_GUIDE.md`
