*** Variables ***

# Application URLs
${BASE_URL}            http://localhost:5173
${LOGIN_URL}           ${BASE_URL}/sign-in
${POSTS_URL}           ${BASE_URL}/posts
${DASHBOARD_URL}       ${BASE_URL}/dashboard

# Browser Configuration
${BROWSER}             Chrome
${HEADLESS}            False
${TIMEOUT}             10s
${IMPLICIT_WAIT}       5s

# Test Data
${VALID_EMAIL}         test@example.com
${VALID_PASSWORD}      validpassword123
${INVALID_EMAIL}       invalid@email.com
${INVALID_PASSWORD}    wrongpassword
${EMPTY_VALUE}         ${EMPTY}

# Test Post Data
${POST_TITLE}          Test Post Title
${POST_CONTENT}        This is a test post content created by automated tests.
${POST_TAG}            automation

# UI Selectors
${LOGIN_EMAIL_FIELD}      css=[name="email"]
${LOGIN_PASSWORD_FIELD}   css=[name="password"]
${LOGIN_BUTTON}           css=button[type="submit"]
${LOGIN_ERROR_MESSAGE}    css=.error-message
${POST_TITLE_FIELD}       css=[name="title"]
${POST_CONTENT_FIELD}     css=[name="content"]
${CREATE_POST_BUTTON}     css=button:contains("Create Post")
${POSTS_LIST}             css=.posts-container 