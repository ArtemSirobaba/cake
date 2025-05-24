# Robot Framework Tests для Cake App

## Опис

Цей проект містить автоматизовані тести для веб-додатку Cake, реалізовані за допомогою Robot Framework з використанням підходу Keyword Driven Testing.

## Встановлення

1. Створіть віртуальне середовище Python:

```bash
python -m venv robot-env
source robot-env/bin/activate  # macOS/Linux
# або robot-env\Scripts\activate  # Windows
```

2. Встановіть залежності:

```bash
pip install -r requirements.txt
```

3. Встановіть WebDriver (автоматично):

```bash
python -c "from webdriver_manager.chrome import ChromeDriverManager; ChromeDriverManager().install()"
```

## Структура тестів

```
robot-tests/
├── keywords/           # Користувацькі ключові слова
│   ├── common.robot   # Загальні ключові слова
│   ├── login.robot    # Ключові слова для авторизації
│   └── posts.robot    # Ключові слова для роботи з постами
├── resources/         # Ресурси та змінні
│   └── variables.robot
├── testcases/         # Тестові сценарії
│   ├── smoke_tests.robot
│   └── user_workflow_tests.robot
├── reports/           # Згенеровані звіти
├── requirements.txt   # Python залежності
└── README.md         # Документація
```

## Запуск тестів

### Локальний запуск

```bash
# Запуск всіх тестів
robot testcases/

# Запуск окремої категорії
robot testcases/smoke_tests.robot

# Запуск з тегами
robot --include smoke testcases/

# Паралельний запуск
pabot --processes 2 testcases/
```

### CI/CD запуск

```bash
# Headless режим
robot --variable HEADLESS:True testcases/

# З генерацією xUnit звітів
robot --xunit xunit.xml testcases/
```

## Згенеровані звіти

- `report.html` - HTML звіт з детальними результатами
- `log.html` - Детальний лог виконання з скріншотами
- `output.xml` - XML вивід для інтеграції з CI/CD
- `xunit.xml` - xUnit формат звітів

## Ключові слова (Keywords)

### Загальні

- `Open Application` - відкриття додатку
- `Close Application` - закриття браузера
- `Take Screenshot On Failure` - скріншот при помилці

### Авторизація

- `User Should Be On Login Page` - перевірка сторінки логіна
- `Login With Valid Credentials` - вхід з валідними даними
- `Login Should Fail With Invalid Credentials` - тест невалідних даних

### Пости

- `User Should Be On Posts Page` - перевірка сторінки постів
- `Create New Post` - створення нового поста
- `Post Should Be Displayed` - перевірка відображення поста

## Інтеграція з CI/CD

Додано GitHub Actions workflow для автоматичного запуску тестів при кожному push та pull request.
