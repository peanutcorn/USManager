Write-Host "Testing Database Connection..."
Write-Host "Current time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

try {
    $response = Invoke-RestMethod `
        -Uri "http://localhost:8080/auth/db-test" `
        -Method Get `
        -Headers @{
            "Accept" = "application/json"
        }

    Write-Host "`nDatabase Test Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "`nDatabase Test Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message

    if ($_.Exception.Response) {
        $rawResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($rawResponse)
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}