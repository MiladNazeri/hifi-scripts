start "Interface" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\interface.exe"
start "domain server" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\domain-server.exe"
timeout /t 1
start "audiomixer" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\assignment-client.exe" -t 0
start "avatarmixer" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\assignment-client.exe" -t 1
start "agent" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\assignment-client.exe" -t 2 -n2
start "assetservermixer" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\assignment-client.exe" -t 3
start "messagesmixer" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\assignment-client.exe" -t 4
start "entityscriptserver" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\assignment-client.exe" -t 5
start "entityservermixer" "D:\ROLC\Reference\R_Programs\HF Builds\Stable\Latest\High Fidelity\assignment-client.exe" -t 6