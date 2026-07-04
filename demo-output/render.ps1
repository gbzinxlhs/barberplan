$ffmpeg = "C:\Users\gabri\Downloads\paineis\barberplan\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$dir = "C:\Users\gabri\Downloads\paineis\barberplan\demo-output"
$audioDir = "$dir/audio"

Remove-Item "$dir\tmp*.mp4", "$dir\tmp_audio.mp3", "$dir\concat.txt", "$dir\barberplan-demo.mp4" -Force 2>$null

$scenes = @(
  @{ id="scene-01"; dur=5; title="Sua barbearia no piloto automatico"; subtitle="Agendamento online, gestao de clientes, controle financeiro e lembretes via WhatsApp." }
  @{ id="scene-02"; dur=6; title="Perdendo clientes sem perceber?"; subtitle="Agenda no papel, cliente ligando, 30% de faltas sem lembrete." }
  @{ id="scene-03"; dur=7; title="Agendamento online em 3 cliques"; subtitle="Cliente escolhe o servico, seleciona o barbeiro e confirma o horario." }
  @{ id="scene-04"; dur=9; title="Tudo em um so lugar"; subtitle="Painel admin, lembretes WhatsApp, relatorios financeiros, multiplas unidades." }
  @{ id="scene-05"; dur=5; title="14 dias gratis. Sem risco."; subtitle="Sem cartao de credito. Cancele quando quiser." }
  @{ id="scene-06"; dur=6; title="Pronto para transformar sua barbearia?"; subtitle="Acesse barberplan-nine.vercel.app e comeca gratis." }
)

# Generate text files for each scene (drawtext textfile=)
$sceneFiles = @()

for ($i=0; $i -lt $scenes.Length; $i++) {
  $s = $scenes[$i]
  $id = $s.id
  $dur = $s.dur
  $title = $s.title
  $sub = $s.subtitle
  $sceneDir = "$dir\scenes_text"
  New-Item -ItemType Directory -Path $sceneDir -Force | Out-Null
  
  # Write title text file with absolute path using backslashes for Windows
  $titleFile = "$sceneDir\${id}_title.txt"
  Set-Content -Path $titleFile -Value $title -Encoding ASCII -NoNewline
  
  # Write subtitle text file
  $subFile = "$sceneDir\${id}_sub.txt"
  Set-Content -Path $subFile -Value $sub -Encoding ASCII -NoNewline
  
  $out = "$dir\tmp_$id.mp4"
  
  Write-Host "Rendering $id ($dur s)..."
  
  # Use textfile instead of text to avoid special char issues
  $filter = "drawtext=textfile='$titleFile':font='Segoe UI':fontsize=48:fontcolor=white:fontweight=bold:x=(w-text_w)/2:y=(h-text_h)/2-60:enable='between(t,0,$dur)',drawtext=textfile='$subFile':font='Segoe UI':fontsize=26:fontcolor=#aaaaaa:x=(w-text_w)/2:y=(h+text_h)/2+40:enable='between(t,0,$dur)'"
  
  & $ffmpeg -y -f lavfi -i "color=c=black:s=1920x1080:d=$dur" -vf "$filter" -c:v libx264 -pix_fmt yuv420p "$out" 2>&1 | Where-Object { $_ -match "error|Error|Invalid" }
  
  if (Test-Path $out) {
    Write-Host "  OK"
    $sceneFiles += $out
  } else {
    Write-Host "  FAILED"
    exit 1
  }
}

Write-Host "`n=== Concatenating scenes ==="
# Use ffmpeg concat protocol instead of concat demuxer (works with same codec)
$concatInputs = @()
foreach ($f in $sceneFiles) {
  $concatInputs += "-i"
  $concatInputs += $f
}
$filterComplex = ""
for ($i=0; $i -lt $sceneFiles.Length; $i++) {
  if ($i -gt 0) { $filterComplex += ";" }
  $filterComplex += "[${i}:v]"
}
# Use concat filter
$filterCmd = ""
for ($i=0; $i -lt $sceneFiles.Length; $i++) {
  if ($i -gt 0) { $filterCmd += " " }
  $filterCmd += "[${i}:v]"
}
$filterCmd += " concat=n=$($sceneFiles.Length):v=1:a=0[outv]"

& $ffmpeg -y $concatInputs -filter_complex "$filterCmd" -map "[outv]" -c:v libx264 -pix_fmt yuv420p "$dir\tmp_video.mp4" 2>&1 | Where-Object { $_ -match "error|Error|Invalid" }
if (Test-Path "$dir\tmp_video.mp4") { Write-Host "  Video OK" } else { Write-Host "  FAILED"; exit 1 }

Write-Host "`n=== Concatenating audio ==="
& $ffmpeg -y -i "concat:$audioDir/scene-01.mp3|$audioDir/scene-02.mp3|$audioDir/scene-03.mp3|$audioDir/scene-04.mp3|$audioDir/scene-05.mp3|$audioDir/scene-06.mp3" -acodec copy "$dir\tmp_audio.mp3" 2>&1 | Out-Null
if (Test-Path "$dir\tmp_audio.mp3") { Write-Host "  Audio OK" } else { Write-Host "  FAILED"; exit 1 }

Write-Host "`n=== Merging video + audio ==="
& $ffmpeg -y -i "$dir\tmp_video.mp4" -i "$dir\tmp_audio.mp3" -c:v copy -c:a aac -shortest "$dir\barberplan-demo.mp4" 2>&1 | Where-Object { $_ -match "error|Error" }
$f = Get-Item "$dir\barberplan-demo.mp4" -ErrorAction SilentlyContinue
if ($f) { Write-Host "`nSUCCESS: $([math]::Round($f.Length/1MB, 1)) MB" } else { Write-Host "FAILED"; exit 1 }

Write-Host "`n=== Cleaning ==="
Remove-Item "$dir\tmp_*.mp4", "$dir\tmp_video.mp4", "$dir\tmp_audio.mp3", "$dir\scenes_text" -Recurse -Force 2>$null
Write-Host "Done!"
