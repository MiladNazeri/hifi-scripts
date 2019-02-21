start "domain server" "D:\ROLC_High-Fidelity\01_Reference\R_Programs\HF Builds\Stable\LATEST\domain-server.exe"
timeout /t 1
start "audiomixer" "D:\ROLC_High-Fidelity\01_Reference\R_Programs\HF Builds\Stable\LATEST\assignment-client.exe" -t 0
start "avatarmixer" "D:\ROLC_High-Fidelity\01_Reference\R_Programs\HF Builds\Stable\LATEST\assignment-client.exe" -t 1
start "agent" "D:\ROLC_High-Fidelity\01_Reference\R_Programs\HF Builds\Stable\LATEST\assignment-client.exe" -t 2 -n2
start "assetservermixer" "D:\ROLC_High-Fidelity\01_Reference\R_Programs\HF Builds\Stable\LATEST\assignment-client.exe" -t 3
start "messagesmixer" "D:\ROLC_High-Fidelity\01_Reference\R_Programs\HF Builds\Stable\LATEST\assignment-client.exe" -t 4
start "entityscriptserver" "D:\ROLC_High-Fidelity\01_Reference\R_Programs\HF Builds\Stable\LATEST\assignment-client.exe" -t 5
start "entityservermixer" "D:\ROLC_High-Fidelity\01_Reference\R_Programs\HF Builds\Stable\LATEST\assignment-client.exe" -t 6