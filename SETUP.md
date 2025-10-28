# 🚀 Настройка Google Reviews Widget (API версия)

## 📋 Что нужно сделать:

### Шаг 1: Получить Google Places API Key

1. Открой: https://console.cloud.google.com/
2. Создай новый проект (или выбери существующий)
3. Включи **Places API (New)**:
   - Поиск → "Places API (New)" → Enable
4. Создай API Key:
   - APIs & Services → Credentials
   - "+ CREATE CREDENTIALS" → API Key
   - Скопируй ключ
5. Ограничь ключ (безопасность):
   - Нажми на ключ → "API restrictions"
   - Выбери: **Places API (New)**
   - Save

---

### Шаг 2: Fork репозитория на GitHub

1. Открой: https://github.com/TFWidgets/google-rewies
2. Нажми **Fork** (правый верхний угол)
3. Теперь у тебя своя копия в `твой-username/google-rewies`

---

### Шаг 3: Подключить к Cloudflare Pages

1. Открой: https://dash.cloudflare.com/
2. Pages → "Create a project"
3. "Connect to Git" → выбери свой форк `google-rewies`
4. Build settings:
   - Framework preset: **None**
   - Build command: (оставь пустым)
   - Build output directory: `/`
5. Нажми "Save and Deploy"

---

### Шаг 4: Создать Cloudflare KV Namespaces

1. В Cloudflare Dashboard:
   - Workers & Pages → KV
2. Создай 2 namespace:
   - `reviews-configs` (для настроек клиентов)
   - `reviews-cache` (для кеша отзывов)
3. Скопируй их **ID** (нужны для следующего шага)

---

### Шаг 5: Привязать KV к проекту

1. Workers & Pages → твой проект `google-rewies`
2. Settings → Functions
3. KV Namespace Bindings → Add binding:

| Variable name     | KV namespace     |
|-------------------|------------------|
| REVIEWS_CONFIGS   | reviews-configs  |
| REVIEWS_CACHE     | reviews-cache    |

4. Save

---

### Шаг 6: Добавить переменные окружения

1. Settings → Environment variables
2. Добавь переменные для **Production**:

| Variable name            | Value                          |
|--------------------------|--------------------------------|
| GOOGLE_PLACES_API_KEY    | AIzaSy...твой_ключ            |
| ENCRYPTION_SECRET        | любая_случайная_строка_32+     |

3. Save

---

### Шаг 7: Redeploy проекта

1. Deployments → Latest deployment → три точки → "Retry deployment"
2. ИЛИ просто запуши любой коммит в GitHub

---

### Шаг 8: Протестировать API

Открой в браузере:
```
https://твой-домен.pages.dev/api/reviews?id=demo
```

Должен вернуть JSON с ошибкой "Client not found" (это нормально, клиент не создан).

---

## ✅ Готово!

Теперь твои клиенты могут:

1. Купить подписку на твоём Shopify сайте
2. Получить API Key на email
3. Открыть: `https://твой-домен.pages.dev/admin.html`
4. Ввести API Key и настроить виджет
5. Вставить код на свой сайт

---

## 🆘 Проблемы?

### "Failed to load reviews"
- Проверь, что KV namespaces привязаны
- Проверь, что Google Places API Key добавлен

### "Client not found"
- Это нормально для `/api/reviews?id=demo`
- Нужно создать клиента через admin.html

### "Rate limit exceeded"
- Google Places API бесплатный лимит исчерпан
- Проверь квоты: https://console.cloud.google.com/apis/dashboard

---

## 📊 Бесплатные лимиты:

- **Google Places API**: $200/месяц (~40,000 запросов)
- **Cloudflare KV**: 100,000 чтений/день
- **Cloudflare Workers**: 100,000 запросов/день

Для малого/среднего бизнеса это полностью бесплатно! ✅
