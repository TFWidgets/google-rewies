# 🚀 Google Reviews Widget - Setup Guide

## ✅ Что создано:

### 📁 Файлы:
1. **admin.html** - Админ-панель для создания конфигов
2. **embed.js** - Widget скрипт (обновлен с поддержкой API)
3. **functions/api/save-to-github.js** - API для сохранения в GitHub
4. **functions/api/get-config.js** - API для получения конфигов
5. **_headers** - Security headers
6. **README.md** - Полная документация

### ✨ Возможности:

#### Admin Panel (/admin.html):
- ✏️ Редактирование информации о бизнесе
- ⭐ Управление отзывами (добавить/удалить)
- 📊 Настройка рейтинга и статистики
- 👁️ Live preview с мгновенными обновлениями
- 💾 Сохранение в GitHub одной кнопкой
- 📋 Генератор embed кода

#### Embed Widget:
- 📱 Полностью адаптивный дизайн
- 🌙 Поддержка темной темы
- ⚡ Быстрая загрузка
- 🎨 Google-style дизайн

---

## 🔧 Настройка GitHub Token

Чтобы кнопка "Сохранить в GitHub" работала:

### 1. Создать GitHub Token:
```
https://github.com/settings/tokens
→ Generate new token (classic)
→ Scope: ✅ repo
→ Скопировать токен (ghp_xxx...)
```

### 2. Добавить в Cloudflare Pages:
```
https://dash.cloudflare.com/
→ Workers & Pages → google-rewies → Settings
→ Environment variables → Add variables

GITHUB_TOKEN = ghp_xxx...
GITHUB_REPO = TFWidgets/google-rewies
```

### 3. Redeploy:
```
Deployments → "···" → Retry deployment
```

---

## 📦 Использование

### Embed Code:
```html
<script src="https://google-reviews.pages.dev/embed.js" data-id="demo"></script>
```

### Создать свой конфиг:
1. Откройте: https://google-reviews.pages.dev/admin.html
2. Заполните информацию о бизнесе
3. Добавьте отзывы
4. Укажите Config ID (например: `my-restaurant`)
5. Нажмите "Сохранить в GitHub"
6. Используйте: `data-id="my-restaurant"`

---

## 🎯 Примеры

### Базовый виджет:
```html
<script src="https://google-reviews.pages.dev/embed.js" 
        data-id="demo"></script>
```

### Темная тема:
```html
<script src="https://google-reviews.pages.dev/embed.js" 
        data-id="demo" 
        data-theme="dark"></script>
```

---

## 📊 Структура конфига

```json
{
  "widgetTitle": "Restaurant Name",
  "widgetDescription": "Reviews from guests",
  "businessInfo": {
    "name": "Restaurant Name",
    "emoji": "🍕",
    "address": "Street address",
    "phone": "+1 234 567 8900",
    "website": "https://example.com",
    "rating": 4.7,
    "totalReviews": 1847,
    "googleMapsUrl": "https://goo.gl/maps/..."
  },
  "maxReviews": 6,
  "showActions": true,
  "reviews": [
    {
      "author": "John Doe",
      "rating": 5,
      "date": "1 week ago",
      "text": "Amazing place!",
      "avatar": "https://example.com/avatar.jpg",
      "isLocalGuide": true
    }
  ]
}
```

---

## 🌐 URLs

- **Production**: https://google-reviews.pages.dev/
- **Admin Panel**: https://google-reviews.pages.dev/admin.html
- **GitHub**: https://github.com/TFWidgets/google-rewies
- **Demo**: https://google-reviews.pages.dev/

---

## ✅ Checklist

- [x] Admin panel created
- [x] Embed.js updated with API support
- [x] Cloudflare Functions created
- [x] README documentation
- [x] Committed and pushed to GitHub
- [ ] **TODO**: Configure GITHUB_TOKEN in Cloudflare
- [ ] **TODO**: Deploy to Cloudflare Pages

---

**Всё готово к использованию!** 🎉
