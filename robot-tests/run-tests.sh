#!/bin/bash

# Robot Framework Test Runner для Cake додатку
# Використання: ./run-tests.sh [options]

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфігурація по замовчуванню
HEADLESS=false
BASE_URL="http://localhost:5173"
BROWSER="Chrome"
TEST_SUITE=""
TAGS=""
PARALLEL=false
REPORT_DIR="reports"

# Функція для виводу довідки
show_help() {
    cat << EOF
Robot Framework Test Runner для Cake додатку

Використання: $0 [ОПЦІЇ]

ОПЦІЇ:
    -h, --help          Показати цю довідку
    --headless          Запустити браузер у headless режимі
    --url URL           Базовий URL додатку (за замовчуванням: $BASE_URL)
    --browser BROWSER   Браузер для тестування (за замовчуванням: $BROWSER)
    --suite SUITE       Запустити конкретний test suite
    --tags TAGS         Запустити тести з конкретними тегами
    --parallel          Паралельний запуск тестів
    --reports-dir DIR   Директорія для звітів (за замовчуванням: $REPORT_DIR)

ПРИКЛАДИ:
    $0                              # Запуск всіх тестів
    $0 --headless                   # Запуск у headless режимі
    $0 --tags smoke                 # Запуск тільки smoke тестів
    $0 --suite smoke_tests.robot    # Запуск конкретного suite
    $0 --parallel --headless        # Паралельний запуск у headless режимі

EOF
}

# Парсинг аргументів командного рядка
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --headless)
                HEADLESS=true
                shift
                ;;
            --url)
                BASE_URL="$2"
                shift 2
                ;;
            --browser)
                BROWSER="$2"
                shift 2
                ;;
            --suite)
                TEST_SUITE="$2"
                shift 2
                ;;
            --tags)
                TAGS="$2"
                shift 2
                ;;
            --parallel)
                PARALLEL=true
                shift
                ;;
            --reports-dir)
                REPORT_DIR="$2"
                shift 2
                ;;
            *)
                echo -e "${RED}Невідомий параметр: $1${NC}"
                echo "Використайте --help для довідки"
                exit 1
                ;;
        esac
    done
}

# Перевірка залежностей
check_dependencies() {
    echo -e "${BLUE}Перевірка залежностей...${NC}"
    
    # Перевірка Python
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Python3 не знайдено. Будь ласка, встановіть Python 3.x${NC}"
        exit 1
    fi
    
    # Перевірка Robot Framework
    if ! python3 -c "import robot" &> /dev/null; then
        echo -e "${YELLOW}Robot Framework не знайдено. Встановлюємо залежності...${NC}"
        pip3 install -r requirements.txt
    fi
    
    # Перевірка доступності додатку
    echo -e "${BLUE}Перевірка доступності додатку за адресою $BASE_URL...${NC}"
    if ! curl -f "$BASE_URL" &> /dev/null; then
        echo -e "${YELLOW}Додаток недоступний за адресою $BASE_URL${NC}"
        echo -e "${YELLOW}Переконайтеся, що додаток запущений (yarn dev)${NC}"
        read -p "Продовжити? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    echo -e "${GREEN}Усі залежності перевірено ✓${NC}"
}

# Підготовка директорії для звітів
prepare_reports_dir() {
    echo -e "${BLUE}Підготовка директорії звітів...${NC}"
    
    if [ -d "$REPORT_DIR" ]; then
        echo -e "${YELLOW}Очищення існуючих звітів...${NC}"
        rm -rf "$REPORT_DIR"/*
    else
        mkdir -p "$REPORT_DIR"
    fi
    
    echo -e "${GREEN}Директорія звітів підготовлена ✓${NC}"
}

# Побудова команди Robot Framework
build_robot_command() {
    local cmd="robot"
    
    # Базові параметри
    cmd="$cmd --variable HEADLESS:$HEADLESS"
    cmd="$cmd --variable BASE_URL:$BASE_URL"
    cmd="$cmd --variable BROWSER:$BROWSER"
    cmd="$cmd --outputdir $REPORT_DIR"
    cmd="$cmd --log log.html"
    cmd="$cmd --report report.html"
    cmd="$cmd --xunit xunit.xml"
    
    # Додаткові параметри
    if [[ -n "$TAGS" ]]; then
        cmd="$cmd --include $TAGS"
    fi
    
    # Вибір test suite
    if [[ -n "$TEST_SUITE" ]]; then
        cmd="$cmd testcases/$TEST_SUITE"
    else
        cmd="$cmd testcases/"
    fi
    
    echo "$cmd"
}

# Запуск тестів
run_tests() {
    echo -e "${BLUE}Запуск тестів Robot Framework...${NC}"
    echo -e "${BLUE}Конфігурація:${NC}"
    echo -e "  - Base URL: $BASE_URL"
    echo -e "  - Browser: $BROWSER"
    echo -e "  - Headless: $HEADLESS"
    echo -e "  - Parallel: $PARALLEL"
    [[ -n "$TAGS" ]] && echo -e "  - Tags: $TAGS"
    [[ -n "$TEST_SUITE" ]] && echo -e "  - Suite: $TEST_SUITE"
    echo ""
    
    local start_time=$(date +%s)
    
    if [[ "$PARALLEL" == "true" ]]; then
        echo -e "${BLUE}Запуск паралельних тестів...${NC}"
        pabot --processes 2 \
              --variable HEADLESS:$HEADLESS \
              --variable BASE_URL:$BASE_URL \
              --variable BROWSER:$BROWSER \
              --outputdir $REPORT_DIR \
              --log log.html \
              --report report.html \
              --xunit xunit.xml \
              ${TAGS:+--include $TAGS} \
              ${TEST_SUITE:+testcases/$TEST_SUITE} \
              ${TEST_SUITE:-testcases/}
    else
        local cmd=$(build_robot_command)
        echo -e "${BLUE}Команда: $cmd${NC}"
        eval $cmd
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    echo ""
    echo -e "${GREEN}Тести завершено за ${duration} секунд ✓${NC}"
}

# Генерація звіту про результати
generate_summary() {
    echo -e "${BLUE}Генерація підсумкового звіту...${NC}"
    
    if [[ -f "$REPORT_DIR/output.xml" ]]; then
        echo -e "${GREEN}Звіти згенеровано:${NC}"
        echo -e "  - HTML звіт: $REPORT_DIR/report.html"
        echo -e "  - Детальний лог: $REPORT_DIR/log.html"
        echo -e "  - XML вивід: $REPORT_DIR/output.xml"
        echo -e "  - xUnit звіт: $REPORT_DIR/xunit.xml"
        echo ""
        
        # Спроба відкрити HTML звіт
        if command -v open &> /dev/null; then
            echo -e "${BLUE}Відкриваємо HTML звіт...${NC}"
            open "$REPORT_DIR/report.html"
        elif command -v xdg-open &> /dev/null; then
            echo -e "${BLUE}Відкриваємо HTML звіт...${NC}"
            xdg-open "$REPORT_DIR/report.html"
        fi
    else
        echo -e "${RED}Файл output.xml не знайдено. Тести можуть бути не виконані.${NC}"
    fi
}

# Головна функція
main() {
    echo -e "${GREEN}🤖 Robot Framework Test Runner для Cake додатку${NC}"
    echo ""
    
    parse_args "$@"
    check_dependencies
    prepare_reports_dir
    run_tests
    generate_summary
    
    echo ""
    echo -e "${GREEN}Готово! 🎉${NC}"
}

# Запуск головної функції
main "$@" 