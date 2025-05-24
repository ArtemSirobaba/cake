# Selenium IDE Tests для застосунку Cake

## Опис тестів

Даний набір автотестів створено за допомогою Selenium IDE для тестування основного функціоналу веб-застосунку Cake.

### Покриті сценарії:

1. **Test Homepage Load** - перевірка завантаження головної сторінки
2. **Test Sign In Page** - перевірка елементів сторінки авторизації
3. **Test Sign In Form Validation** - тестування валідації форми входу
4. **Test Navigation to Posts** - перевірка навігації до сторінки постів
5. **Test Post Creation Form** - тестування форми створення постів

### Тестові набори (Suites):

- **Smoke Tests** - базові тести для перевірки основного функціоналу
- **User Interaction Tests** - тести взаємодії користувача з інтерфейсом

## Встановлення та запуск

### Попередні вимоги:

1. Node.js версії 18 або вище
2. Chrome або Firefox браузер
3. Запущений застосунок Cake на http://localhost:5173

### Встановлення залежностей:

```bash
cd selenium-tests
npm install
```

### Запуск тестів:

```bash
# Базовий запуск
npm test

# Запуск у Chrome
npm run test:chrome

# Запуск у Firefox
npm run test:firefox

# Запуск у headless режимі
npm run test:headless

# Запуск з генерацією JUnit звіту
npm run test:junit

# Запуск для CI/CD
npm run test:ci
```

## Структура файлів

- `cake-app-tests.side` - основний файл з тестами Selenium IDE
- `package.json` - залежності та скрипти для запуску
- `test-results/` - директорія з результатами тестів (створюється автоматично)

## Інтеграція з CI/CD

Тести інтегровані з GitHub Actions через файл `.github/workflows/selenium-tests.yml`.
Автоматичний запуск відбувається при:

- Push до гілок main або develop
- Створенні Pull Request до main гілки

## Звіти

Після запуску тестів генерується:

- Консольний вивід з результатами
- JUnit XML звіти у директорії `test-results/`
- У CI/CD також публікується HTML звіт з деталями

## Адаптація тестів при змінах UI

При змінах елементів інтерфейсу потрібно оновити селектори у файлі `.side`:

### Приклади змін:

1. **Зміна ID кнопки:**

   ```json
   // Було:
   "target": "id=login-button"

   // Стало (якщо ID змінився на signin-btn):
   "target": "id=signin-btn"
   ```

2. **Зміна класу:**

   ```json
   // Було:
   "target": "css=.login-form"

   // Стало:
   "target": "css=.signin-form"
   ```

3. **Зміна тексту кнопки:**

   ```json
   // Було:
   "target": "css=button:contains(\"Login\")"

   // Стало:
   "target": "css=button:contains(\"Sign In\")"
   ```

4. **Додавання обгортки:**

   ```json
   // Було:
   "target": "id=email"

   // Стало (якщо поле обгорнуто у div):
   "target": "css=div.form-wrapper #email"
   ```
