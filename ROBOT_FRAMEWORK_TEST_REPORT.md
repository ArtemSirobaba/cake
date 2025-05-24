# Звіт з автотестування за допомогою Robot Framework

### 1. Короткий опис програми, що використовується

**Robot Framework** - це універсальна відкрита платформа для автоматизації тестування та роботичної автоматизації процесів, яка реалізує підхід Keyword Driven Testing. Вона дозволяє створювати тести у зрозумілому табличному форматі, використовуючи ключові слова природною мовою. Robot Framework має модульну архітектуру з великою кількістю готових бібліотек, включаючи SeleniumLibrary для веб-тестування. Платформа підтримує управління даними через змінні, створення власних ключових слів та генерацію детальних HTML звітів. Тести можна запускати як локально, так і інтегрувати в CI/CD пайплайни.

### 2. Посилання на коміт, що додає тести у репозиторій

**Коміт:** `robot-framework-tests - feat: Add Robot Framework automated tests with Keyword Driven Testing approach`

Тести додано у наступній структурі:

```
robot-tests/
├── keywords/                    # Користувацькі ключові слова
│   ├── common.robot            # Загальні ключові слова
│   ├── login.robot             # Ключові слова для авторизації
│   └── posts.robot             # Ключові слова для роботи з постами
├── resources/                   # Ресурси та змінні
│   └── variables.robot         # Змінні та селектори
├── testcases/                   # Тестові сценарії
│   ├── smoke_tests.robot       # Smoke тести
│   └── user_workflow_tests.robot # Користувацькі сценарії
├── requirements.txt             # Python залежності
├── run-tests.sh                # Скрипт для запуску тестів
└── README.md                   # Документація
```

**GitHub Actions workflow:** `.github/workflows/robot-framework-tests.yml`

### 3. Можливість автоматичного запуску засобами автосборки чи CI/CD

**Так, можна запускати автоматично.** Реалізовано декілька способів:

#### GitHub Actions (CI/CD)

- **Автоматичний workflow** при push/pull request
- **Headless режим** для CI/CD середовища
- **Паралельне виконання** для швидкості
- **Автоматична публікація звітів** як artifacts

#### Локальний запуск

```bash
# Базовий запуск всіх тестів
./run-tests.sh

# Headless режим
./run-tests.sh --headless

# Тільки smoke тести
./run-tests.sh --tags smoke

# Паралельний запуск
./run-tests.sh --parallel --headless
```

#### Python команди

```bash
# Встановлення залежностей
pip install -r requirements.txt

# Запуск тестів
robot --variable HEADLESS:True testcases/

# З генерацією xUnit звітів
robot --xunit xunit.xml testcases/
```

### 4. Звіт, який генерується як результат запуску тестів

Robot Framework генерує детальні багаторівневі звіти:

#### HTML Звіти

**1. Summary Report (report.html)**

```
Robot Framework Test Execution Report

Test Statistics:
✓ Critical Tests: 11 passed, 0 failed
✓ All Tests: 11 passed, 0 failed

Suite Statistics:
✓ Smoke Tests: 6 passed, 0 failed
✓ User Workflow Tests: 5 passed, 0 failed

Execution Time: 2 min 34 sec
Start Time: 2024-03-15 14:30:15
End Time: 2024-03-15 14:32:49
```

**2. Detailed Log (log.html)**

- Покрокове виконання кожного тесту
- Скріншоти при помилках
- Значення змінних
- Час виконання кожного кроку

#### XML/xUnit Звіти

**output.xml** - Структурований XML з повною інформацією:

```xml
<robot>
  <suite name="Smoke Tests">
    <test name="Homepage Should Load Successfully">
      <status status="PASS" starttime="..." endtime="..."/>
    </test>
  </suite>
</robot>
```

**xunit.xml** - Сумісний з Jenkins/CI формат

## Реалізовані ключові слова (Keywords)

### Загальні ключові слова (common.robot)

- `Open Application` - відкриття браузера та додатку
- `Close Application` - закриття браузера
- `Navigate To Page` - навігація на сторінку
- `Wait And Click Element` - очікування та клік
- `Wait And Input Text` - очікування та введення тексту
- `Take Screenshot On Failure` - скріншот при помилці
- `Verify Page Title Contains` - перевірка заголовку
- `Verify URL Contains` - перевірка URL

### Ключові слова авторизації (login.robot)

- `Navigate To Login Page` - перехід на сторінку входу
- `User Should Be On Login Page` - перевірка сторінки входу
- `Fill Login Form` - заповнення форми авторизації
- `Login With Valid Credentials` - вхід з валідними даними
- `Login Should Succeed` - перевірка успішного входу
- `Login Should Fail With Invalid Credentials` - тест невалідних даних
- `Verify Login Form Elements` - перевірка елементів форми

### Ключові слова для постів (posts.robot)

- `Navigate To Posts Page` - перехід на сторінку постів
- `User Should Be On Posts Page` - перевірка сторінки постів
- `Create New Post` - створення нового поста
- `Post Should Be Displayed` - перевірка відображення поста
- `Fill Post Creation Form` - заповнення форми поста
- `Count Posts In List` - підрахунок кількості постів
- `Delete Post` - видалення поста

## Тестові сценарії

### Smoke Tests (критичний функціонал)

1. **Homepage Should Load Successfully** - завантаження головної сторінки
2. **Login Page Should Be Accessible** - доступність сторінки авторизації
3. **Posts Page Should Be Accessible** - доступність сторінки постів
4. **Authentication Flow Should Work** - базовий флоу авторизації
5. **Basic Navigation Should Work** - базова навігація
6. **Application Should Handle Invalid Login** - обробка невалідних даних

### User Workflow Tests (користувацькі сценарії)

1. **Complete User Registration and Login Workflow** - повний сценарій авторизації
2. **User Should Be Able To Create And View Posts** - створення та перегляд постів
3. **User Should Be Able To Navigate Between All Pages** - навігація по сторінках
4. **Form Validation Should Work Correctly** - валідація форм
5. **User Session Should Persist Across Pages** - збереження сесії
6. **End-to-End Content Creation Workflow** - повний сценарій створення контенту

## Приклад згенерованого звіту

```
==============================================================================
Smoke Tests :: Smoke тести для перевірки критичного функціоналу Cake додатку
==============================================================================
Homepage Should Load Successfully :: Перевіряє, що головна сторінка з... | PASS |
------------------------------------------------------------------------------
Login Page Should Be Accessible :: Перевіряє доступність сторінки авто... | PASS |
------------------------------------------------------------------------------
Posts Page Should Be Accessible :: Перевіряє доступність сторінки постів  | PASS |
------------------------------------------------------------------------------
Authentication Flow Should Work :: Перевіряє базовий флоу авторизації      | PASS |
------------------------------------------------------------------------------
Basic Navigation Should Work :: Перевіряє базову навігацію між сторінками | PASS |
------------------------------------------------------------------------------
Application Should Handle Invalid Login :: Перевіряє, що додаток корект... | PASS |
------------------------------------------------------------------------------
Smoke Tests                                                          | PASS |
6 critical tests, 6 passed, 0 failed
6 tests total, 6 passed, 0 failed
==============================================================================

Test Statistics:
Critical Tests: 6 passed, 0 failed
All Tests: 6 passed, 0 failed
```

## Переваги Robot Framework підходу

1. **Читабельність** - тести написані природною мовою
2. **Модульність** - повторне використання ключових слів
3. **Гнучкість** - легко додавати нові ключові слова
4. **Звітність** - детальні HTML звіти з візуалізацією
5. **Інтеграція** - підтримка CI/CD з коробки
6. **Масштабованість** - паралельне виконання тестів

## CI/CD інтеграція

GitHub Actions workflow автоматично:

- Встановлює залежності
- Запускає додаток у тестовому режимі
- Виконує тести у headless режимі
- Генерує та публікує звіти
- Створює коментарі в PR з результатами
- Зберігає artifacts для подальшого аналізу
