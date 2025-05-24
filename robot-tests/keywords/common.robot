*** Settings ***
Documentation       Загальні ключові слова для роботи з браузером та додатком
Library             SeleniumLibrary
Library             OperatingSystem
Resource            ../resources/variables.robot

*** Keywords ***

Open Application
    [Documentation]    Відкриває браузер та переходить на головну сторінку додатку
    [Arguments]        ${url}=${BASE_URL}
    IF    '${HEADLESS}' == 'True'
        ${chrome_options}    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()
        Call Method    ${chrome_options}    add_argument    --headless
        Call Method    ${chrome_options}    add_argument    --no-sandbox
        Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
        Create Webdriver    Chrome    chrome_options=${chrome_options}
    ELSE
        Open Browser    ${url}    ${BROWSER}
    END
    Maximize Browser Window
    Set Selenium Timeout    ${TIMEOUT}
    Set Selenium Implicit Wait    ${IMPLICIT_WAIT}
    Go To    ${url}

Close Application
    [Documentation]    Закриває браузер та очищає ресурси
    Close All Browsers

Wait For Page To Load
    [Documentation]    Очікує завантаження сторінки
    [Arguments]        ${element}=css=body
    Wait Until Element Is Visible    ${element}    timeout=${TIMEOUT}

Navigate To Page
    [Documentation]    Переходить на вказану сторінку
    [Arguments]        ${url}
    Go To    ${url}
    Wait For Page To Load

Take Screenshot On Failure
    [Documentation]    Робить скріншот при падінні тесту
    ${timestamp}    Get Time    epoch
    ${screenshot_name}    Set Variable    failure_${timestamp}.png
    Capture Page Screenshot    ${screenshot_name}
    Log    Screenshot saved as: ${screenshot_name}

Element Should Be Visible And Enabled
    [Documentation]    Перевіряє, що елемент видимий та активний
    [Arguments]        ${locator}
    Wait Until Element Is Visible    ${locator}
    Element Should Be Enabled    ${locator}

Wait And Click Element
    [Documentation]    Очікує елемент та клікає по ньому
    [Arguments]        ${locator}
    Wait Until Element Is Visible    ${locator}
    Element Should Be Enabled    ${locator}
    Click Element    ${locator}

Wait And Input Text
    [Documentation]    Очікує поле вводу та вводить текст
    [Arguments]        ${locator}    ${text}
    Wait Until Element Is Visible    ${locator}
    Element Should Be Enabled    ${locator}
    Clear Element Text    ${locator}
    Input Text    ${locator}    ${text}

Verify Page Title Contains
    [Documentation]    Перевіряє, що заголовок сторінки містить вказаний текст
    [Arguments]        ${expected_text}
    ${title}    Get Title
    Should Contain    ${title}    ${expected_text}

Verify URL Contains
    [Documentation]    Перевіряє, що поточний URL містить вказаний текст
    [Arguments]        ${expected_path}
    ${current_url}    Get Location
    Should Contain    ${current_url}    ${expected_path} 