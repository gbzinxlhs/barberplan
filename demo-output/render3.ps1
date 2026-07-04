$ffmpeg = "C:\Users\gabri\Downloads\paineis\barberplan\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$dir = "C:\Users\gabri\Downloads\paineis\barberplan\demo-output"
$audioDir = "$dir/audio"

Remove-Item "$dir/tmp_*.mp4", "$dir/tmp_audio.mp3", "$dir/concat.txt", "$dir/barberplan-demo.mp4" -Force 2>$null

function New-Video($name, $dur, $filters) {
  $out = "$dir/tmp_$name.mp4"
  Write-Host "  Rendering $name..."
  & $ffmpeg -y -f lavfi -i "color=c=black:s=1920x1080:d=$dur" -vf $filters -c:v libx264 -pix_fmt yuv420p -movflags +faststart $out *>&1 | Out-Null
  if (-not (Test-Path $out)) { Write-Host "  FAILED $name"; exit 1 }
  $sz = (Get-Item $out).Length
  if ($sz -eq 0) { Write-Host "  FAILED (empty) $name"; exit 1 }
}

# Scene 1: Landing page - minimal but nice
$f1 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill"
$f1 += ",drawtext=text='VINTAGE CLUB':font='Segoe UI':fontsize=72:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-120"
$f1 += ",drawtext=text='Barbearia Tradicional':font='Segoe UI':fontsize=28:fontcolor=#a1a1aa:x=(w-text_w)/2:y=(h-text_h)/2-30"
$f1 += ",drawbox=x=660:y=580:w=600:h=60:c=#22c55e:t=fill"
$f1 += ",drawtext=text='AGENDAR HORARIO':font='Segoe UI':fontsize=20:fontcolor=#09090b:x=(w-text_w)/2:y=610"
$f1 += ",drawtext=text='barberplan-nine.vercel.app':font='Segoe UI':fontsize=14:fontcolor=#3f3f46:x=(w-text_w)/2:y=1030"
New-Video "scene01" 5 $f1

# Scene 2: Login
$f2 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill"
$f2 += ",drawbox=x=660:y=240:w=600:h=480:c=#18181b:t=fill"
$f2 += ",drawtext=text='Vintage Club':font='Segoe UI':fontsize=20:fontcolor=white:x=725:y=273"
$f2 += ",drawtext=text='Bem-vindo de volta!':font='Segoe UI':fontsize=24:fontcolor=white:x=688:y=340"
$f2 += ",drawtext=text='Confirme seus dados para agendar':font='Segoe UI':fontsize=15:fontcolor=#a1a1aa:x=688:y=380"
$f2 += ",drawtext=text='Nome':font='Segoe UI':fontsize=13:fontcolor=#71717a:x=688:y=430"
$f2 += ",drawbox=x=688:y=450:w=544:h=50:c=#27272a:t=fill"
$f2 += ",drawtext=text='Gabriel Santos':font='Segoe UI':fontsize=15:fontcolor=white:x=705:y=465"
$f2 += ",drawtext=text='WhatsApp':font='Segoe UI':fontsize=13:fontcolor=#71717a:x=688:y=520"
$f2 += ",drawbox=x=688:y=540:w=544:h=50:c=#27272a:t=fill"
$f2 += ",drawtext=text='(85) 99999-1234':font='Segoe UI':fontsize=15:fontcolor=white:x=705:y=555"
$f2 += ",drawbox=x=660:y=610:w=600:h=44:c=#22c55e:t=fill"
$f2 += ",drawtext=text='Entrar e Agendar':font='Segoe UI':fontsize=15:fontcolor=#09090b:x=(w-text_w)/2:y=628"
New-Video "scene02" 6 $f2

# Scene 3: Services - simplified
$f3 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill"
$f3 += ",drawtext=text='Vintage Club':font='Segoe UI':fontsize=18:fontcolor=white:x=130:y=57"
$f3 += ",drawtext=text='Gabriel Santos':font='Segoe UI':fontsize=14:fontcolor=white:x=130:y=110"
$f3 += ",drawtext=text='Escolha o servico':font='Segoe UI':fontsize=24:fontcolor=white:x=100:y=180"
$f3 += ",drawbox=x=100:y=240:w=860:h=60:c=#18181b:t=fill"
$f3 += ",drawtext=text='Corte Degrade':font='Segoe UI':fontsize=17:fontcolor=white:x=120:y=256"
$f3 += ",drawtext=text='R$ 45':font='Segoe UI':fontsize=15:fontcolor=#22c55e:x=900:y=258"
$f3 += ",drawbox=x=100:y=310:w=860:h=60:c=#18181b:t=fill"
$f3 += ",drawtext=text='Barba Tradicional':font='Segoe UI':fontsize=17:fontcolor=white:x=120:y=326"
$f3 += ",drawtext=text='R$ 30':font='Segoe UI':fontsize=15:fontcolor=#22c55e:x=900:y=328"
$f3 += ",drawbox=x=100:y=380:w=860:h=60:c=#18181b:t=fill"
$f3 += ",drawtext=text='Corte + Barba':font='Segoe UI':fontsize=17:fontcolor=white:x=120:y=396"
$f3 += ",drawtext=text='R$ 65':font='Segoe UI':fontsize=15:fontcolor=#22c55e:x=900:y=398"
New-Video "scene03" 7 $f3

# Scene 4: Barbers
$f4 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill"
$f4 += ",drawtext=text='Vintage Club':font='Segoe UI':fontsize=18:fontcolor=white:x=130:y=57"
$f4 += ",drawtext=text='Escolha o Barbeiro':font='Segoe UI':fontsize=24:fontcolor=white:x=100:y=120"
$f4 += ",drawbox=x=100:y=170:w=860:h=70:c=#18181b:t=fill"
$f4 += ",drawtext=text='Ricardo Menezes':font='Segoe UI':fontsize=17:fontcolor=white:x=180:y=186"
$f4 += ",drawtext=text='Especialista em degrade e barba desenhada':font='Segoe UI':fontsize=13:fontcolor=#a1a1aa:x=180:y=212"
$f4 += ",drawbox=x=100:y=250:w=860:h=70:c=#18181b:t=fill"
$f4 += ",drawtext=text='Paulo Lima':font='Segoe UI':fontsize=17:fontcolor=white:x=180:y=266"
$f4 += ",drawtext=text='Corte classico e navalha':font='Segoe UI':fontsize=13:fontcolor=#a1a1aa:x=180:y=292"
$f4 += ",drawbox=x=100:y=330:w=860:h=70:c=#18181b:t=fill"
$f4 += ",drawtext=text='Andre Ferreira':font='Segoe UI':fontsize=17:fontcolor=white:x=180:y=346"
$f4 += ",drawtext=text='Hidratacao e tratamentos capilares':font='Segoe UI':fontsize=13:fontcolor=#a1a1aa:x=180:y=372"
New-Video "scene04" 9 $f4

# Scene 5: Date/Time
$f5 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill"
$f5 += ",drawtext=text='Data e Horario':font='Segoe UI':fontsize=24:fontcolor=white:x=100:y=80"
$f5 += ",drawtext=text='Ricardo Menezes - Corte Degrade':font='Segoe UI':fontsize=13:fontcolor=#a1a1aa:x=100:y=120"
$f5 += ",drawbox=x=100:y=170:w=90:h=90:c=#18181b:r=14:t=fill"
$f5 += ",drawtext=text='DOM':font='Segoe UI':fontsize=9:fontcolor=#3f3f46:x=131:y=186"
$f5 += ",drawtext=text='06':font='Segoe UI':fontsize=20:fontcolor=#3f3f46:x=129:y=200"
$f5 += ",drawbox=x=204:y=170:w=90:h=90:c=#22c55e:r=14:t=fill"
$f5 += ",drawtext=text='TER':font='Segoe UI':fontsize=9:fontcolor=#09090b:x=234:y=186"
$f5 += ",drawtext=text='08':font='Segoe UI':fontsize=20:fontcolor=#09090b:x=233:y=200"
$f5 += ",drawtext=text='Horarios':font='Segoe UI':fontsize=15:fontcolor=#a1a1aa:x=100:y=290"
$f5 += ",drawbox=x=100:y=330:w=100:h=44:c=#18181b:t=fill"
$f5 += ",drawtext=text='08:00':font='Segoe UI':fontsize=15:fontcolor=#a1a1aa:x=131:y=348"
$f5 += ",drawbox=x=212:y=330:w=100:h=44:c=#22c55e:t=fill"
$f5 += ",drawtext=text='11:00':font='Segoe UI':fontsize=15:fontcolor=#09090b:x=243:y=348"
$f5 += ",drawbox=x=750:y=420:w=160:h=44:c=#22c55e:t=fill"
$f5 += ",drawtext=text='Continuar':font='Segoe UI':fontsize=15:fontcolor=#09090b:x=805:y=436"
New-Video "scene05" 5 $f5

# Scene 6: Success
$f6 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill"
$f6 += ",drawbox=x=640:y=240:w=640:h=480:c=#18181b:r=24:t=fill"
$f6 += ",drawbox=x=880:y=280:w=72:h=72:c=#22c55e:r=36:t=fill"
$f6 += ",drawtext=text='V':font='Segoe UI':fontsize=36:fontcolor=#09090b:x=908:y=296"
$f6 += ",drawtext=text='Agendamento Confirmado!':font='Segoe UI':fontsize=28:fontcolor=white:x=(w-text_w)/2:y=390"
$f6 += ",drawtext=text='Corte Degrade com Ricardo Menezes':font='Segoe UI':fontsize=16:fontcolor=#a1a1aa:x=(w-text_w)/2:y=430"
$f6 += ",drawtext=text='Terca, 08 Jul 2026 as 11:00':font='Segoe UI':fontsize=14:fontcolor=#a1a1aa:x=(w-text_w)/2:y=470"
$f6 += ",drawtext=text='Pagamento: Pix - Valor: R$ 45,00':font='Segoe UI':fontsize=14:fontcolor=#22c55e:x=(w-text_w)/2:y=510"
$f6 += ",drawbox=x=780:y=560:w=360:h=48:c=#22c55e:t=fill"
$f6 += ",drawtext=text='Meus Agendamentos':font='Segoe UI':fontsize=15:fontcolor=#09090b:x=(w-text_w)/2:y=587"
New-Video "scene06" 6 $f6

Write-Host "Concatenating scenes..."
& $ffmpeg -y -i "$dir/tmp_scene01.mp4" -i "$dir/tmp_scene02.mp4" -i "$dir/tmp_scene03.mp4" -i "$dir/tmp_scene04.mp4" -i "$dir/tmp_scene05.mp4" -i "$dir/tmp_scene06.mp4" -filter_complex "[0:v][1:v][2:v][3:v][4:v][5:v] concat=n=6:v=1:a=0[outv]" -map "[outv]" -c:v libx264 -pix_fmt yuv420p -movflags +faststart "$dir/tmp_video.mp4" *>&1 | Out-Null
if (-not (Test-Path "$dir/tmp_video.mp4")) { Write-Host "FAILED concat"; exit 1 }

Write-Host "Concatenating audio..."
& $ffmpeg -y -i "concat:$audioDir/scene-01.mp3|$audioDir/scene-02.mp3|$audioDir/scene-03.mp3|$audioDir/scene-04.mp3|$audioDir/scene-05.mp3|$audioDir/scene-06.mp3" -acodec copy "$dir/tmp_audio.mp3" *>&1 | Out-Null
if (-not (Test-Path "$dir/tmp_audio.mp3")) { Write-Host "FAILED audio"; exit 1 }

Write-Host "Merging..."
& $ffmpeg -y -i "$dir/tmp_video.mp4" -i "$dir/tmp_audio.mp3" -c:v copy -c:a aac -shortest "$dir/barberplan-demo.mp4" *>&1 | Out-Null

$f = Get-Item "$dir/barberplan-demo.mp4" -ErrorAction SilentlyContinue
if ($f) { Write-Host "SUCCESS: $([math]::Round($f.Length/1MB, 1)) MB" } else { Write-Host "FAILED" }

Remove-Item "$dir/tmp_scene*.mp4", "$dir/tmp_video.mp4", "$dir/tmp_audio.mp3" -Force 2>$null
Write-Host "Done!"
