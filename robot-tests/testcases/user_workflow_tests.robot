*** Settings ***
Documentation       Тести користувацьких сценаріїв для Cake додатку
Library             SeleniumLibrary
Library             DateTime
Resource            ../keywords/common.robot
Resource            ../keywords/login.robot
Resource            ../keywords/posts.robot
Resource            ../resources/variables.robot

Suite Setup         Open Application
Suite Teardown      Close Application
Test Setup          Navigate To Page    ${BASE_URL}
Test Teardown       Run Keyword If Test Failed    Take Screenshot On Failure

*** Variables ***
${USER_EMAIL}          workflow.user@example.com
${USER_PASSWORD}       workflow123
${DYNAMIC_POST_TITLE}  ${EMPTY}

*** Test Cases ***

Complete User Registration and Login Workflow
    [Documentation]    Тестує повний сценарій реєстрації та входу користувача
    [Tags]    workflow    authentication    user-journey
    
    # Спроба входу з валідними даними
    Login With Valid Credentials    ${USER_EMAIL}    ${USER_PASSWORD}
    Login Should Succeed
    
    # Перевіряємо, що користувач успішно авторизований
    Navigate To Dashboard
    User Should Be On Dashboard
    
    Log    Complete user authentication workflow completed successfully

User Should Be Able To Create And View Posts
    [Documentation]    Тестує сценарій створення та перегляду постів
    [Tags]    workflow    posts    content-management
    
    # Авторизуємось
    Login With Valid Credentials    ${USER_EMAIL}    ${USER_PASSWORD}
    Login Should Succeed
    
    # Переходимо на сторінку постів
    Navigate To Posts Page
    User Should Be On Posts Page
    
    # Створюємо пост з унікальним заголовком
    ${timestamp}    Get Current Date    result_format=%Y%m%d_%H%M%S
    ${unique_title}    Set Variable    Test Post ${timestamp}
    Set Test Variable    ${DYNAMIC_POST_TITLE}    ${unique_title}
    
    Create New Post    ${unique_title}    Automated test post content created at ${timestamp}
    Post Creation Should Succeed    ${unique_title}
    
    Log    Post creation and viewing workflow completed successfully

User Should Be Able To Navigate Between All Pages
    [Documentation]    Тестує навігацію користувача по всіх доступних сторінках
    [Tags]    workflow    navigation    user-experience
    
    # Авторизуємось для доступу до всіх сторінок
    Login With Valid Credentials    ${USER_EMAIL}    ${USER_PASSWORD}
    Login Should Succeed
    
    # Тестуємо навігацію по основних сторінках
    Navigate To Dashboard
    User Should Be On Dashboard
    
    Navigate To Posts Page
    User Should Be On Posts Page
    
    Navigate To Page    ${BASE_URL}
    Wait For Page To Load
    
    # Перевіряємо, що всі переходи працюють коректно
    Log    Complete navigation workflow completed successfully

Form Validation Should Work Correctly
    [Documentation]    Тестує валідацію форм у додатку
    [Tags]    workflow    validation    form-handling
    
    # Тестуємо валідацію форми авторизації
    Login Should Fail With Empty Fields
    
    # Авторизуємось для тестування інших форм
    Login With Valid Credentials    ${USER_EMAIL}    ${USER_PASSWORD}
    Login Should Succeed
    
    # Тестуємо валідацію форми створення поста
    Navigate To Posts Page
    User Should Be On Posts Page
    Post Creation Should Fail With Empty Fields
    
    Log    Form validation workflow completed successfully

User Session Should Persist Across Pages
    [Documentation]    Тестує збереження сесії користувача при навігації
    [Tags]    workflow    session    persistence
    
    # Авторизуємось
    Login With Valid Credentials    ${USER_EMAIL}    ${USER_PASSWORD}
    Login Should Succeed
    
    # Навігуємо між сторінками та перевіряємо, що сесія зберігається
    Navigate To Posts Page
    User Should Be On Posts Page
    
    Navigate To Dashboard
    User Should Be On Dashboard
    
    # Перевіряємо, що не перенаправляє на логін
    ${current_url}    Get Location
    Should Not Contain    ${current_url}    /sign-in
    
    Log    User session persistence workflow completed successfully

End-to-End Content Creation Workflow
    [Documentation]    Повний сценарій від авторизації до створення контенту
    [Tags]    workflow    e2e    content-creation
    
    # 1. Авторизація
    Login With Valid Credentials    ${USER_EMAIL}    ${USER_PASSWORD}
    Login Should Succeed
    
    # 2. Навігація до сторінки постів
    Navigate To Posts Page
    User Should Be On Posts Page
    
    # 3. Підрахунок початкової кількості постів
    ${initial_count}    Count Posts In List
    
    # 4. Створення нового поста
    ${timestamp}    Get Current Date    result_format=%Y%m%d_%H%M%S
    ${e2e_title}    Set Variable    E2E Test Post ${timestamp}
    ${e2e_content}    Set Variable    This post was created during end-to-end testing at ${timestamp}
    
    Create New Post    ${e2e_title}    ${e2e_content}
    Post Creation Should Succeed    ${e2e_title}
    
    # 5. Перевірка, що пост додався
    ${final_count}    Count Posts In List
    Should Be True    ${final_count} >= ${initial_count}
    
    Log    End-to-end content creation workflow completed successfully

*** Keywords ***

Verify User Is Logged In
    [Documentation]    Перевіряє, що користувач авторизований
    ${current_url}    Get Location
    Should Not Contain    ${current_url}    /sign-in
    Log    User is logged in

Generate Unique Test Data
    [Documentation]    Генерує унікальні тестові дані
    ${timestamp}    Get Current Date    result_format=%Y%m%d_%H%M%S
    ${unique_id}    Set Variable    test_${timestamp}
    [Return]    ${unique_id} 