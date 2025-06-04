Write-Host "Testing API endpoints..."
Write-Host "Current time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 테스트 케이스 정의
$testCases = @(
    @{
        id = "12345678"
        password = "123"
        description = "Student Login"
    },
    @{
        id = "1234567890"
        password = "123"
        description = "Professor Login"
    }
)

# API 상태 테스트
Write-Host "`nTesting API Status..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth/test" -Method Get
    Write-Host "API Status Test Successful:" -ForegroundColor Green
    $testResponse | ConvertTo-Json
} catch {
    Write-Host "API Status Test Failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# 각 테스트 케이스 실행
foreach ($testCase in $testCases) {
    Write-Host "`nTesting $($testCase.description)..." -ForegroundColor Yellow

    $body = @{
        id = $testCase.id
        password = $testCase.password
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }

    try {
        Write-Host "Sending request for $($testCase.description)"
        Write-Host "Request Body:"
        Write-Host $body

        $response = Invoke-RestMethod `
            -Uri "http://localhost:8080/auth/login" `
            -Method Post `
            -Body $body `
            -Headers $headers `
            -ContentType "application/json"

        Write-Host "Response for $($testCase.description):" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 10

    } catch {
        Write-Host "Error in $($testCase.description):" -ForegroundColor Red

        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Red

        $rawResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($rawResponse)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`nAll tests completed at: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"