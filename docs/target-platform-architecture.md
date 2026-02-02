## Целевая архитектура платформы RoomGenius (Target Platform Architecture)

### 1) Контекст и цели

**RoomGenius** — веб‑приложение, которое принимает фото комнаты, позволяет выбрать стиль и генерирует вариант дизайна с помощью внешнего AI‑провайдера. Опционально — монетизация через оплату (YooKassa), хранение артефактов в Supabase.

**Цели целевой архитектуры**
- **Стабильность**: устойчивость к сбоям внешних провайдеров (AI/платежи).
- **Безопасность**: защита ключей, контроль доступа к данным/объектам, безопасная обработка файлов.
- **Масштабируемость**: горизонтальное масштабирование API‑слоя, очереди для долгих задач.
- **Наблюдаемость**: трассировка запросов, метрики генераций/ошибок, аудит действий.
- **Эволюционность**: возможность заменить AI‑провайдера/модель, добавить новые пайплайны.

**Нефункциональные требования (NFR) — целевые ориентиры**
- **SLO API**: p95 latency для лёгких запросов (без генерации) < 300ms; генерации — асинхронно.
- **Доступность**: 99.5% для фронта и API (без учёта внешнего AI).
- **RPO/RTO**: RPO ≤ 15 мин, RTO ≤ 2 часа (для критичных БД/метаданных).
- **Безопасность**: секреты только сервер‑сайд; принцип наименьших привилегий; журналирование действий.
- **Стоимость**: ограничение по бюджету на генерации (лимиты, квоты, rate limiting).

---

### 2) C4 — System Context (L1)

```mermaid
flowchart LR
  U[Пользователь] -->|Web UI| FE[RoomGenius Web (Next.js)]
  FE -->|HTTPS| API[Backend API (Next.js API Routes / Edge/Serverless)]
  API -->|SDK| SB[(Supabase: Auth + DB + Storage)]
  API -->|API| AI[AI Provider (Replicate)]
  API -->|API| PAY[Payments (YooKassa)]
  SB -->|Public/Private objects| CDN[CDN/Storage delivery]
  FE -->|Images| CDN
```

**Роли**
- Пользователь: загружает фото, выбирает стиль, запускает генерацию, получает результат, оплачивает.
- Платформа: управляет пользователями, лимитами, хранением, генерациями, оплатами.

---

### 3) C4 — Container (L2)

```mermaid
flowchart TB
  subgraph Browser["Browser"]
    UI[Next.js Pages UI]
  end

  subgraph Platform["RoomGenius Platform"]
    APIRoutes[API Routes / Serverless Functions]
    Worker[Async Worker (Queue consumer)]
  end

  subgraph Data["Data & Platform Services"]
    DB[(Postgres via Supabase)]
    Storage[(Supabase Storage: rooms, results)]
    Auth[Supabase Auth]
    Queue[(Queue: Redis/SQS/PGMQ)]
  end

  subgraph External["External Providers"]
    Rep[Replicate Models]
    Yoo[YooKassa]
    Obs[(Logs/Metrics/Tracing)]
  end

  UI -->|HTTPS| APIRoutes
  APIRoutes --> Auth
  APIRoutes --> DB
  APIRoutes --> Storage
  APIRoutes --> Queue
  Worker --> Queue
  Worker --> Rep
  Worker --> Storage
  Worker --> DB
  APIRoutes --> Yoo
  APIRoutes --> Obs
  Worker --> Obs
```

**Ключевые решения**
- **Генерации — асинхронно**: API создаёт задачу и отдаёт `job_id`; воркер выполняет AI‑вызов и сохраняет результат.
- **Хранение файлов**: исходники и результаты — в Storage; в БД — метаданные и ссылки.
- **Платежи**: платежный интент/чек — сервер‑сайд; вебхуки — отдельный endpoint, идемпотентность.

---

### 4) Доменная модель (упрощённо)

**Таблицы (минимум)**
- `users`: профиль, тариф/квота.
- `projects` или `rooms`: сущность работы пользователя.
- `assets`: входные фото и выходные изображения (тип, url, storage_key, hash).
- `generation_jobs`: состояние задания (queued/running/succeeded/failed), параметры, стоимость, ссылки на результат.
- `payments`: статусы платежей, idempotency_key, суммы, привязка к `user`/`job`.

**Статусы джобы**
- `queued` → `running` → `succeeded` | `failed` | `cancelled`

---

### 5) Потоки данных (основные)

#### 5.1 Загрузка фото (приватно)
1. UI запрашивает у API **signed upload URL** (или использует Supabase Storage signed upload).
2. Браузер грузит файл напрямую в Storage.
3. API сохраняет метаданные файла в БД.

#### 5.2 Генерация дизайна (асинхронно)
1. UI вызывает API `POST /api/generations` с `asset_id`, параметрами (style, strength, steps).
2. API валидирует лимиты и создаёт `generation_job` + пушит задачу в очередь.
3. Worker читает задачу, делает запрос к AI provider, сохраняет output в Storage и обновляет БД.
4. UI поллит `GET /api/generations/{job_id}` или получает событие (SSE/WebSocket).

#### 5.3 Оплата
1. UI запрашивает создание платежа на конкретную услугу/джобу.
2. API создаёт платеж в YooKassa с `idempotency_key`.
3. YooKassa присылает webhook → API обновляет `payments` и открывает доступ (например, скачивание HD‑версии).

---

### 6) Безопасность

**Секреты**
- `REPLICATE_API_TOKEN`, `YOOKASSA_SECRET_KEY` — только в server runtime, никогда не в `NEXT_PUBLIC_*`.

**Доступ к Storage**
- Исходники/результаты по умолчанию **private**.
- Для отображения в UI выдавать **signed URLs** с TTL.

**Валидация файлов**
- Ограничение размера (например, ≤ 10MB).
- MIME‑проверка (jpeg/png/webp).
- Серверный контроль расширений + content-type.
- Антивирус/сканирование (опционально на воркере).

**Rate limiting и анти‑абуз**
- Лимиты на пользователя/IP по:
  - загрузкам,
  - созданию генераций,
  - polling запросам.

**Идемпотентность**
- Платежи: `idempotency_key` обязателен.
- Джобы: защита от повторного запуска одной и той же генерации (например, по hash входа+параметров).

---

### 7) Надёжность и масштабирование

**Стратегия повторов**
- AI‑вызовы: retries с экспоненциальной задержкой, но с лимитом и классификацией ошибок (429/5xx).
- Webhooks: идемпотентная обработка и запись raw‑payload для аудита.

**Очередь**
- Для MVP можно начать с Postgres‑очереди (PGMQ) или Supabase‑функций, затем перейти на Redis/SQS при росте.

**Кэш**
- Кэширование метаданных результатов и signed URLs (учитывая TTL).

---

### 8) Наблюдаемость (Observability)

**Логи**
- Корреляционный `request_id`/`job_id`.
- Логи без персональных данных и без секретов.

**Метрики**
- `generations_started_total`, `generations_succeeded_total`, `generations_failed_total`
- p95 времени генерации, p95 времени ответа API
- расходы на генерации (если доступно)

**Трейсинг**
- Трассы: UI → API → Queue → Worker → AI → Storage/DB.

---

### 9) Эволюция архитектуры (дорожная карта)

**MVP (сейчас)**
- Next.js UI + API Routes
- Supabase Storage для ассетов
- Replicate как AI‑провайдер

**Следующий этап**
- Асинхронные генерации через очередь и воркер
- Приватные объекты Storage + signed URLs
- Платежи и вебхуки end‑to‑end

**Рост**
- Выделенный backend (или BFF) + отдельные воркеры
- Мульти‑провайдер AI (fallback, A/B моделей)
- Политики хранения/удаления данных (retention)

