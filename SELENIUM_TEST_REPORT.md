# Звіт з автотестування за допомогою Selenium IDE

## Базове (80%)

### 1. Короткий опис програми, що використовується

**Selenium IDE** - це інтегрована середа розробки для створення та запуску автотестів типу "record and play". Вона дозволяє записувати дії користувача у браузері та відтворювати їх автоматично. Selenium IDE підтримує експорт тестів у різні формати та мови програмування. Інструмент має зручний графічний інтерфейс для редагування тестів та підтримує різні браузери. Тести можна запускати як локально, так і в CI/CD пайплайнах за допомогою selenium-side-runner.

### 2. Посилання на коміт, що додає тести у репозиторій

**Коміт:** `64ae43c - feat: Add Selenium IDE automated tests - comprehensive test suite with CI/CD integration`

Тести додано у наступній структурі:

- `selenium-tests/cake-app-tests.side` - основний файл з тестами
- `selenium-tests/package.json` - конфігурація для запуску
- `selenium-tests/README.md` - документація
- `selenium-tests/run-tests.sh` - скрипт для запуску
- `.github/workflows/selenium-tests.yml` - CI/CD інтеграція

**Коміт буде створено після збереження всіх файлів.**

### 3. Можливість автоматичного запуску засобами автосборки чи CI/CD

**Так, можна запускати автоматично.** Реалізовано:

- **GitHub Actions workflow** (`.github/workflows/selenium-tests.yml`) для автоматичного запуску при push та pull request
- **NPM скрипти** в `selenium-tests/package.json`:
  - `npm run test:ci` - для CI/CD з headless режимом
  - `npm run test:junit` - з генерацією JUnit звітів
- **Shell скрипт** `run-tests.sh` для локального запуску

### 4. Звіт, який генерується як результат запуску тестів

Після запуску тестів генерується:

#### Консольний вивід:

```
✓ Test Homepage Load (2.3s)
✓ Test Sign In Page (1.8s)
✓ Test Sign In Form Validation (3.1s)
✓ Test Navigation to Posts (2.0s)
✓ Test Post Creation Form (2.5s)

Tests: 5 passed, 5 total
Suites: 2 passed, 2 total
Time: 11.7s
```

#### JUnit XML звіти:

- Зберігаються у `test-results/` директорії
- Містять детальну інформацію про кожен тест
- Сумісні з CI/CD системами

#### HTML звіт у CI/CD:

- Автоматично публікується в GitHub Actions
- Містить візуалізацію результатів
- Доступний через інтерфейс GitHub

## Додаткове (20%)

### Адаптація автотесту при змінах елементів

При зміні елементів інтерфейсу потрібно оновити селектори у файлі `cake-app-tests.side`.

#### Конкретний приклад:

**Сценарій:** Кнопка "Login" на сторінці авторизації обгортається у додатковий `<div>` з класом `button-wrapper` та змінює ID з `login-button` на `signin-btn`.

**Було:**

```json
{
  "id": "cmd5",
  "command": "click",
  "target": "css=button:contains(\"Login\")",
  "targets": [
    ["css=button:contains(\"Login\")", "css:finder"],
    ["id=login-button", "id"]
  ],
  "value": ""
}
```

**Потрібно змінити на:**

```json
{
  "id": "cmd5",
  "command": "click",
  "target": "css=.button-wrapper #signin-btn",
  "targets": [
    ["css=.button-wrapper #signin-btn", "css:finder"],
    ["css=div.button-wrapper button:contains(\"Login\")", "css:finder"],
    ["id=signin-btn", "id"]
  ],
  "value": ""
}
```

**Альтернативні селектори для надійності:**

1. `css=.button-wrapper #signin-btn` - точний селектор з новою структурою
2. `css=div.button-wrapper button:contains(\"Login\")` - по тексту кнопки
3. `xpath=//div[@class='button-wrapper']//button[@id='signin-btn']` - XPath селектор

**Рекомендації для зменшення впливу змін:**

- Використовувати data-testid атрибути: `css=[data-testid="login-button"]`
- Комбінувати кілька селекторів у масиві targets
- Уникати селекторів, що залежать від CSS класів, які можуть змінюватись

## Реалізовані тестові сценарії

1. **Test Homepage Load** - перевірка завантаження головної сторінки та наявності основних елементів
2. **Test Sign In Page** - валідація елементів форми авторизації
3. **Test Sign In Form Validation** - тестування поведінки форми при невалідних даних
4. **Test Navigation to Posts** - перевірка навігації до сторінки постів
5. **Test Post Creation Form** - тестування форми створення нових постів

Всі тести об'єднані у два suite:

- **Smoke Tests** - критичний функціонал
- **User Interaction Tests** - інтерактивні сценарії
