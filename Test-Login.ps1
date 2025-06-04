Write-Host "Testing Login System"
Write-Host "Current time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# First test the database connection
Write-Host "`nTesting database connection..." -ForegroundColor Yellow
try {
    $connectionTest = Invoke-RestMethod `
        -Uri "http://localhost:8080/auth/test-connection" `
        -Method Get
    Write-Host "Database connection test result:" -ForegroundColor Green
    $connectionTest | ConvertTo-Json
} catch {
    Write-Host "Database connection test failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit
}

# Test login with valid credentials
$testCases = @(
    @{
        id = "12345678"
        password = "123"
        description = "Student Login"
    }
)

foreach ($test in $testCases) {
    Write-Host "`nTesting $($test.description)..." -ForegroundColor Yellow

    # Create request body
    $body = @{
        id = $test.id
        password = $test.password
    } | ConvertTo-Json

    # Set headers
    $headers = @{
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }

    Write-Host "Request URL: http://localhost:8080/auth/login"
    Write-Host "Request Headers:"
    $headers | Format-Table -AutoSize
    Write-Host "Request Body:"
    Write-Host $body

    try {
        $response = Invoke-RestMethod `
            -Uri "http://localhost:8080/auth/login" `
            -Method Post `
            -Body $body `
            -Headers $headers `
            -ContentType "application/json" `
            -Verbose

        Write-Host "`nLogin successful:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "`nLogin failed:" -ForegroundColor Red

        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode"

        $rawResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($rawResponse)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"

        Write-Host "`nFull Error Details:" -ForegroundColor Red
        Write-Host $_.Exception.Message

        # Print raw request for debugging
        Write-Host "`nRaw Request Details:" -ForegroundColor Yellow
        Write-Host "Method: POST"
        Write-Host "URL: http://localhost:8080/auth/login"
        Write-Host "Headers: $($headers | ConvertTo-Json)"
        Write-Host "Body: $body"
    }
}