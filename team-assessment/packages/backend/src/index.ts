/**
 * Backstage backend entry-point.
 *
 * Здесь мы объявляем (и динамически подключаем) все backend-плагины, 
 * которые нужны вашему приложению.
 *
 * ➡️  Если добавляете/удаляете новый плагин — просто вставьте/уберите
 *     очередной `backend.add(import('<module>'))`.
 *
 * ⚠️  Порядок имеет значение только для тех случаев, когда плагины
 *     зависят друг от друга (например, auth-модули к `@backstage/plugin-auth-backend`).
 */

import { createBackend } from '@backstage/backend-defaults';

// ────────────────────────────────────────────────────────────────────────────
// Базовая инфраструктура
// ────────────────────────────────────────────────────────────────────────────
const backend = createBackend();

// приложение (frontend assets, health-check и др.)
backend.add(import('@backstage/plugin-app-backend'));

// обратные прокси-ендпоинты из `app-config.yaml.proxy`
backend.add(import('@backstage/plugin-proxy-backend'));

// ────────────────────────────────────────────────────────────────────────────
// Scaffolder
// ────────────────────────────────────────────────────────────────────────────
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));

// ────────────────────────────────────────────────────────────────────────────
// TechDocs
// ────────────────────────────────────────────────────────────────────────────
backend.add(import('@backstage/plugin-techdocs-backend'));

// ────────────────────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────────────────────
backend.add(import('@backstage/plugin-auth-backend'));                        // ядро
backend.add(import('@backstage/plugin-auth-backend-module-github-provider')); // GitHub OAuth
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));  // гостевой вход

// ────────────────────────────────────────────────────────────────────────────
// Catalog
// ────────────────────────────────────────────────────────────────────────────
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));         // REST-логи ошибок

// ────────────────────────────────────────────────────────────────────────────
// Permission framework
// ────────────────────────────────────────────────────────────────────────────
backend.add(import('@backstage/plugin-permission-backend'));

// Кастомная политика, читающая группы из TeamConfigs
backend.add(import('./extensions/permissionsPolicyExtension'));

// ────────────────────────────────────────────────────────────────────────────
// Search
// ────────────────────────────────────────────────────────────────────────────
backend.add(import('@backstage/plugin-search-backend'));                      // ядро поиска
backend.add(import('@backstage/plugin-search-backend-module-pg'));            // Postgres движок
backend.add(import('@backstage/plugin-search-backend-module-catalog'));       // коллатор каталога
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));      // коллатор TechDocs

// ────────────────────────────────────────────────────────────────────────────
// Kubernetes (опционально, если конфиг есть)
// ────────────────────────────────────────────────────────────────────────────
backend.add(import('@backstage/plugin-kubernetes-backend'));

// ────────────────────────────────────────────────────────────────────────────
// Ваш кастомный плагин “Team Assessment”
// ────────────────────────────────────────────────────────────────────────────
backend.add(import('@internal/plugin-team-assessment-backend'));

// ────────────────────────────────────────────────────────────────────────────
// Старт
// ────────────────────────────────────────────────────────────────────────────
backend.start();
