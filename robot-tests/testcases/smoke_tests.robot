*** Settings ***
Documentation       Smoke тести для перевірки критичного функціоналу Cake додатку
Library             SeleniumLibrary
Resource            ../keywords/common.robot
Resource            ../keywords/login.robot
Resource            ../keywords/posts.robot
Resource            ../resources/variables.robot

Suite Setup         Open Application
Suite Teardown      Close Application
Test Setup          Navigate To Page    ${BASE_URL}
Test Teardown       Run Keyword If Test Failed    Take Screenshot On Failure

*** Variables ***
${SMOKE_EMAIL}      smoke.test@example.com
${SMOKE_PASSWORD}   smoketest123

*** Test Cases ***

Homepage Should Load Successfully
    [Documentation]    Перевіряє, що головна сторінка завантажується успішно
    [Tags]    smoke    homepage    critical
    Wait For Page To Load
    Verify Page Title Contains    Cake
    Page Should Contain    Cake
    Log    Homepage loaded successfully

Login Page Should Be Accessible
    [Documentation]    Перевіряє доступність сторінки авторизації
    [Tags]    smoke    login    critical
    Navigate To Login Page
    User Should Be On Login Page
    Verify Login Form Elements
    Log    Login page is accessible and contains required elements

Posts Page Should Be Accessible
    [Documentation]    Перевіряє доступність сторінки постів
    [Tags]    smoke    posts    critical
    Navigate To Posts Page
    User Should Be On Posts Page
    Verify Posts Page Layout
    Log    Posts page is accessible

Authentication Flow Should Work
    [Documentation]    Перевіряє базовий флоу авторизації
    [Tags]    smoke    authentication    critical
    Login With Valid Credentials    ${SMOKE_EMAIL}    ${SMOKE_PASSWORD}
    Login Should Succeed
    Log    Authentication flow completed successfully

Basic Navigation Should Work
    [Documentation]    Перевіряє базову навігацію між сторінками
    [Tags]    smoke    navigation    critical
    
    # Тестуємо навігацію на різні сторінки
    Navigate To Login Page
    User Should Be On Login Page
    
    Navigate To Posts Page
    User Should Be On Posts Page
    
    Navigate To Page    ${BASE_URL}
    Wait For Page To Load
    
    Log    Basic navigation works correctly

Application Should Handle Invalid Login
    [Documentation]    Перевіряє, що додаток коректно обробляє невалідні дані авторизації
    [Tags]    smoke    security    critical
    Login Should Fail With Invalid Credentials
    Log    Invalid login attempt handled correctly

*** Keywords ***

Verify Critical Page Elements
    [Documentation]    Перевіряє наявність критичних елементів на сторінці
    Wait For Page To Load
    Element Should Be Visible    css=body
    Element Should Be Visible    css=main 