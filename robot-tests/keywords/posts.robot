*** Settings ***
Documentation       Ключові слова для тестування функціоналу постів
Library             SeleniumLibrary
Resource            ../resources/variables.robot
Resource            common.robot

*** Keywords ***

Navigate To Posts Page
    [Documentation]    Переходить на сторінку постів
    Navigate To Page    ${POSTS_URL}

User Should Be On Posts Page
    [Documentation]    Перевіряє, що користувач знаходиться на сторінці постів
    Verify URL Contains    /posts
    Wait For Page To Load

Fill Post Creation Form
    [Documentation]    Заповнює форму створення поста
    [Arguments]        ${title}    ${content}
    Wait And Input Text    ${POST_TITLE_FIELD}    ${title}
    Wait And Input Text    ${POST_CONTENT_FIELD}    ${content}

Submit Post Creation Form
    [Documentation]    Натискає кнопку створення поста
    Wait And Click Element    ${CREATE_POST_BUTTON}

Create New Post
    [Documentation]    Створює новий пост з вказаними даними
    [Arguments]        ${title}=${POST_TITLE}    ${content}=${POST_CONTENT}
    Fill Post Creation Form    ${title}    ${content}
    Submit Post Creation Form

Post Should Be Displayed
    [Documentation]    Перевіряє, що пост відображається в списку
    [Arguments]        ${title}=${POST_TITLE}
    Wait Until Element Is Visible    ${POSTS_LIST}
    Page Should Contain    ${title}
    Log    Post "${title}" is successfully displayed

Verify Post Creation Form Elements
    [Documentation]    Перевіряє наявність всіх елементів форми створення поста
    Element Should Be Visible And Enabled    ${POST_TITLE_FIELD}
    Element Should Be Visible And Enabled    ${POST_CONTENT_FIELD}
    Element Should Be Visible And Enabled    ${CREATE_POST_BUTTON}

Post Creation Should Succeed
    [Documentation]    Перевіряє успішне створення поста
    [Arguments]        ${title}=${POST_TITLE}
    Sleep    2s    # Дає час для збереження поста
    Post Should Be Displayed    ${title}
    Log    Post creation succeeded

Post Creation Should Fail With Empty Fields
    [Documentation]    Перевіряє, що створення поста з порожніми полями не вдається
    Fill Post Creation Form    ${EMPTY_VALUE}    ${EMPTY_VALUE}
    Submit Post Creation Form
    Sleep    1s
    # Перевіряємо, що форма все ще присутня (пост не створений)
    Element Should Be Visible    ${POST_TITLE_FIELD}
    Element Should Be Visible    ${POST_CONTENT_FIELD}
    Log    Post creation correctly failed for empty fields

Navigate To Dashboard
    [Documentation]    Переходить на дашборд
    Navigate To Page    ${DASHBOARD_URL}

User Should Be On Dashboard
    [Documentation]    Перевіряє, що користувач знаходиться на дашборді
    Verify URL Contains    /dashboard
    Wait For Page To Load

Verify Posts Page Layout
    [Documentation]    Перевіряє основні елементи сторінки постів
    User Should Be On Posts Page
    # Перевіряємо наявність основних секцій
    Wait Until Element Is Visible    css=main
    Page Should Contain    Posts
    
Count Posts In List
    [Documentation]    Рахує кількість постів у списку
    ${posts_count}    Get Element Count    css=.post-item
    [Return]    ${posts_count}

Delete Post
    [Documentation]    Видаляє пост за заголовком
    [Arguments]        ${title}
    ${delete_button}    Set Variable    css=.post-item:contains("${title}") .delete-button
    Wait And Click Element    ${delete_button}
    Sleep    1s    # Дає час для видалення 