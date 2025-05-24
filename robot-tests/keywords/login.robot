*** Settings ***
Documentation       Ключові слова для тестування функціоналу авторизації
Library             SeleniumLibrary
Resource            ../resources/variables.robot
Resource            common.robot

*** Keywords ***

Navigate To Login Page
    [Documentation]    Переходить на сторінку авторизації
    Navigate To Page    ${LOGIN_URL}

User Should Be On Login Page
    [Documentation]    Перевіряє, що користувач знаходиться на сторінці авторизації
    Verify URL Contains    /sign-in
    Wait Until Element Is Visible    ${LOGIN_EMAIL_FIELD}
    Wait Until Element Is Visible    ${LOGIN_PASSWORD_FIELD}
    Wait Until Element Is Visible    ${LOGIN_BUTTON}

Fill Login Form
    [Documentation]    Заповнює форму авторизації
    [Arguments]        ${email}    ${password}
    Wait And Input Text    ${LOGIN_EMAIL_FIELD}    ${email}
    Wait And Input Text    ${LOGIN_PASSWORD_FIELD}    ${password}

Submit Login Form
    [Documentation]    Натискає кнопку входу
    Wait And Click Element    ${LOGIN_BUTTON}

Login With Valid Credentials
    [Documentation]    Виконує вхід з валідними обліковими даними
    [Arguments]        ${email}=${VALID_EMAIL}    ${password}=${VALID_PASSWORD}
    Navigate To Login Page
    User Should Be On Login Page
    Fill Login Form    ${email}    ${password}
    Submit Login Form

Login With Invalid Credentials
    [Documentation]    Виконує спробу входу з невалідними обліковими даними
    [Arguments]        ${email}=${INVALID_EMAIL}    ${password}=${INVALID_PASSWORD}
    Navigate To Login Page
    User Should Be On Login Page
    Fill Login Form    ${email}    ${password}
    Submit Login Form

Login Should Succeed
    [Documentation]    Перевіряє успішний вхід в систему
    # Очікуємо перенаправлення на dashboard або posts
    Sleep    2s    # Дає час для перенаправлення
    ${current_url}    Get Location
    Should Not Contain    ${current_url}    /sign-in
    Log    User successfully logged in. Current URL: ${current_url}

Login Should Fail With Invalid Credentials
    [Documentation]    Перевіряє, що вхід з невалідними даними не вдається
    [Arguments]        ${email}=${INVALID_EMAIL}    ${password}=${INVALID_PASSWORD}
    Login With Invalid Credentials    ${email}    ${password}
    Sleep    2s    # Дає час для відображення помилки
    ${current_url}    Get Location
    Should Contain    ${current_url}    /sign-in
    Log    Login correctly failed for invalid credentials

Login Should Fail With Empty Fields
    [Documentation]    Перевіряє, що вхід з порожніми полями не вдається
    Navigate To Login Page
    User Should Be On Login Page
    Fill Login Form    ${EMPTY_VALUE}    ${EMPTY_VALUE}
    Submit Login Form
    Sleep    1s
    ${current_url}    Get Location
    Should Contain    ${current_url}    /sign-in
    Log    Login correctly failed for empty fields

Verify Login Form Elements
    [Documentation]    Перевіряє наявність всіх елементів форми авторизації
    Element Should Be Visible And Enabled    ${LOGIN_EMAIL_FIELD}
    Element Should Be Visible And Enabled    ${LOGIN_PASSWORD_FIELD}
    Element Should Be Visible And Enabled    ${LOGIN_BUTTON}
    
    # Перевіряємо placeholder або label текст
    ${email_placeholder}    Get Element Attribute    ${LOGIN_EMAIL_FIELD}    placeholder
    Should Not Be Empty    ${email_placeholder}
    
    ${password_placeholder}    Get Element Attribute    ${LOGIN_PASSWORD_FIELD}    placeholder
    Should Not Be Empty    ${password_placeholder} 