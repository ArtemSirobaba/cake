#!/bin/bash

# Скрипт для запуску Selenium IDE тестів

echo "=== Selenium IDE Tests для застосунку Cake ==="
echo

# Перевірка, чи встановлено Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не встановлено. Будь ласка, встановіть Node.js 18+"
    exit 1
fi

echo "✅ Node.js версія: $(node --version)"

# Перевірка, чи запущений застосунок
echo "🔍 Перевірка доступності застосунку на http://localhost:5173..."
if ! curl -f http://localhost:5173 &> /dev/null; then
    echo "❌ Застосунок не доступний на http://localhost:5173"
    echo "   Будь ласка, запустіть застосунок командою: npm run dev"
    exit 1
fi

echo "✅ Застосунок доступний"

# Встановлення залежностей
echo "📦 Встановлення залежностей..."
npm install

# Запуск тестів
echo "🚀 Запуск Selenium IDE тестів..."
echo

# Запуск у headless режимі з генерацією звіту
npm run test:ci

# Перевірка результатів
if [ $? -eq 0 ]; then
    echo
    echo "✅ Усі тести пройшли успішно!"
    echo "📊 Звіти збережено у директорії test-results/"
else
    echo
    echo "❌ Деякі тести не пройшли. Перевірте звіти у test-results/"
fi

echo
echo "=== Завершено ===" 