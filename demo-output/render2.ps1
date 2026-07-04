$ffmpeg = "C:\Users\gabri\Downloads\paineis\barberplan\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
$dir = "C:\Users\gabri\Downloads\paineis\barberplan\demo-output"
$audioDir = "$dir/audio"

Remove-Item "$dir\tmp_*.mp4", "$dir\tmp_audio.mp3", "$dir\concat.txt", "$dir\barberplan-demo.mp4" -Force 2>$null

function New-Video {
  param($name, $dur, $filters)
  $out = "$dir\tmp_$name.mp4"
  $ffmpeg = "C:\Users\gabri\Downloads\paineis\barberplan\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe"
  Write-Host "  Rendering $name..."
  & $ffmpeg -y -f lavfi -i "color=c=black:s=1920x1080:d=$dur" -vf $filters -c:v libx264 -pix_fmt yuv420p -movflags +faststart $out *>&1 | Out-Null
  if (-not (Test-Path $out)) { Write-Host "  FAILED $name"; exit 1 }
}

$f1 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill,"
$f1 += "drawtext=text='VINTAGE CLUB':font='Segoe UI':fontsize=72:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2-120:enable='between(t,0.3,5)',"
$f1 += "drawtext=text='Barbearia Tradicional':font='Segoe UI':fontsize=28:fontcolor=#a1a1aa:x=(w-text_w)/2:y=(h-text_h)/2-30:enable='between(t,0.5,5)',"
$f1 += "drawbox=x=660:y=580:w=600:h=60:c=#22c55e:t=fill:enable='between(t,1,5)',"
$f1 += "drawtext=text='AGENDAR HORARIO':font='Segoe UI':fontsize=20:fontcolor=#09090b:x=(w-text_w)/2:y=610:enable='between(t,1,5)',"
$f1 += "drawtext=text='4.9 * | 12 Profissionais | 500+ Clientes':font='Segoe UI':fontsize=16:fontcolor=#52525b:x=(w-text_w)/2:y=680:enable='between(t,1.5,5)',"
$f1 += "drawtext=text='barberplan-nine.vercel.app':font='Segoe UI':fontsize=14:fontcolor=#3f3f46:x=(w-text_w)/2:y=1030:enable='between(t,0.5,5)'"
New-Video "scene01" 5 $f1

$f2 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill,"
$f2 += "drawbox=x=660:y=240:w=600:h=600:c=#18181b:t=fill:enable='between(t,0.3,6)',"
$f2 += "drawbox=x=660:y=260:w=48:h=48:c=#22c55e:t=fill:enable='between(t,0.3,6)',"
$f2 += "drawtext=text='V':font='Segoe UI':fontsize=24:fontcolor=#09090b:x=688:y=272:enable='between(t,0.3,6)',"
$f2 += "drawtext=text='Vintage Club':font='Segoe UI':fontsize=20:fontcolor=white:x=725:y=273:enable='between(t,0.3,6)',"
$f2 += "drawtext=text='Bem-vindo de volta!':font='Segoe UI':fontsize=24:fontcolor=white:x=688:y=340:enable='between(t,0.5,6)',"
$f2 += "drawtext=text='Confirme seus dados para agendar':font='Segoe UI':fontsize=15:fontcolor=#a1a1aa:x=688:y=380:enable='between(t,0.5,6)',"
$f2 += "drawtext=text='Nome':font='Segoe UI':fontsize=13:fontcolor=#71717a:x=688:y=430:enable='between(t,0.7,6)',"
$f2 += "drawbox=x=688:y=450:w=544:h=50:c=#27272a:t=fill:enable='between(t,0.7,6)',"
$f2 += "drawbox=x=688:y=450:w=544:h=50:c=#22c55e@0.15:t=fill:enable='between(t,0.7,6)',"
$f2 += "drawtext=text='Gabriel Santos':font='Segoe UI':fontsize=15:fontcolor=white:x=705:y=465:enable='between(t,0.7,6)',"
$f2 += "drawtext=text='WhatsApp':font='Segoe UI':fontsize=13:fontcolor=#71717a:x=688:y=520:enable='between(t,0.9,6)',"
$f2 += "drawbox=x=688:y=540:w=544:h=50:c=#27272a:t=fill:enable='between(t,0.9,6)',"
$f2 += "drawbox=x=688:y=540:w=544:h=50:c=#22c55e@0.15:t=fill:enable='between(t,0.9,6)',"
$f2 += "drawtext=text='(85) 99999-1234':font='Segoe UI':fontsize=15:fontcolor=white:x=705:y=555:enable='between(t,0.9,6)',"
$f2 += "drawbox=x=660:y=600:w=600:h=44:c=#22c55e:t=fill:enable='between(t,0.8,6)',"
$f2 += "drawtext=text='Entrar e Agendar':font='Segoe UI':fontsize=15:fontcolor=#09090b:x=(w-text_w)/2:y=618:enable='between(t,0.8,6)',"
$f2 += "drawtext=text='Meus Agendamentos':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=(w-text_w)/2:y=660:enable='between(t,1.2,6)'"
New-Video "scene02" 6 $f2

$f3 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill,"
$f3 += "drawbox=x=80:y=50:w=36:h=36:c=#22c55e:t=fill:enable='between(t,0.3,7)',"
$f3 += "drawtext=text='V':font='Segoe UI':fontsize=14:fontcolor=#09090b:x=94:y=56:enable='between(t,0.3,7)',"
$f3 += "drawtext=text='Vintage Club':font='Segoe UI':fontsize=18:fontcolor=white:x=130:y=57:enable='between(t,0.3,7)',"
$f3 += "drawbox=x=80:y=108:w=36:h=36:c=#27272a:r=18:t=fill:enable='between(t,0.5,7)',"
$f3 += "drawtext=text='G':font='Segoe UI':fontsize=13:fontcolor=white:x=94:y=114:enable='between(t,0.5,7)',"
$f3 += "drawtext=text='Gabriel Santos':font='Segoe UI':fontsize=14:fontcolor=white:x=130:y=110:enable='between(t,0.5,7)',"
$f3 += "drawtext=text='(85) 99999-1234':font='Segoe UI':fontsize=12:fontcolor=#52525b:x=130:y=132:enable='between(t,0.5,7)',"
$f3 += "drawbox=x=80:y=180:w=36:h=36:c=#22c55e:r=18:t=fill:enable='between(t,0.5,7)',"
$f3 += "drawtext=text='1':font='Segoe UI':fontsize=13:fontcolor=#09090b:x=94:y=186:enable='between(t,0.5,7)',"
$f3 += "drawbox=x=128:y=197:w=320:h=2:c=#22c55e:t=fill:enable='between(t,0.5,7)',"
$f3 += "drawbox=x=462:y=180:w=36:h=36:c=#27272a:r=18:t=fill:enable='between(t,0.5,7)',"
$f3 += "drawtext=text='2':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=476:y=186:enable='between(t,0.5,7)',"
$f3 += "drawbox=x=510:y=197:w=320:h=2:c=#27272a:t=fill:enable='between(t,0.5,7)',"
$f3 += "drawbox=x=844:y=180:w=36:h=36:c=#27272a:r=18:t=fill:enable='between(t,0.5,7)',"
$f3 += "drawtext=text='3':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=858:y=186:enable='between(t,0.5,7)',"
$f3 += "drawtext=text='Escolha o servico':font='Segoe UI':fontsize=24:fontcolor=white:x=100:y=240:enable='between(t,0.7,7)',"
$f3 += "drawbox=x=100:y=300:w=860:h=64:c=#18181b:t=fill:enable='between(t,1,7)',"
$f3 += "drawbox=x=100:y=300:w=860:h=64:c=#22c55e@0.2:t=fill:enable='between(t,1,7)',"
$f3 += "drawtext=text='Corte Degrade':font='Segoe UI':fontsize=17:fontcolor=white:x=120:y=316:enable='between(t,1,7)',"
$f3 += "drawtext=text='R$ 45':font='Segoe UI':fontsize=15:fontcolor=#22c55e:x=900:y=318:enable='between(t,1,7)',"
$f3 += "drawtext=text='40 min':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=120:y=340:enable='between(t,1,7)',"
$f3 += "drawbox=x=100:y=376:w=860:h=64:c=#18181b:t=fill:enable='between(t,1.3,7)',"
$f3 += "drawtext=text='Barba Tradicional':font='Segoe UI':fontsize=17:fontcolor=white:x=120:y=392:enable='between(t,1.3,7)',"
$f3 += "drawtext=text='R$ 30':font='Segoe UI':fontsize=15:fontcolor=#22c55e:x=900:y=394:enable='between(t,1.3,7)',"
$f3 += "drawtext=text='20 min':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=120:y=416:enable='between(t,1.3,7)',"
$f3 += "drawbox=x=100:y=452:w=860:h=64:c=#18181b:t=fill:enable='between(t,1.6,7)',"
$f3 += "drawtext=text='Corte + Barba':font='Segoe UI':fontsize=17:fontcolor=white:x=120:y=468:enable='between(t,1.6,7)',"
$f3 += "drawtext=text='R$ 65':font='Segoe UI':fontsize=15:fontcolor=#22c55e:x=900:y=470:enable='between(t,1.6,7)',"
$f3 += "drawtext=text='60 min':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=120:y=492:enable='between(t,1.6,7)',"
$f3 += "drawbox=x=100:y=528:w=860:h=64:c=#18181b:t=fill:enable='between(t,1.9,7)',"
$f3 += "drawtext=text='Hidratacao':font='Segoe UI':fontsize=17:fontcolor=white:x=120:y=544:enable='between(t,1.9,7)',"
$f3 += "drawtext=text='R$ 50':font='Segoe UI':fontsize=15:fontcolor=#22c55e:x=900:y=546:enable='between(t,1.9,7)',"
$f3 += "drawtext=text='30 min':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=120:y=568:enable='between(t,1.9,7)'"
New-Video "scene03" 7 $f3

$f4 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill,"
$f4 += "drawbox=x=80:y=50:w=36:h=36:c=#22c55e:t=fill:enable='between(t,0.3,9)',"
$f4 += "drawtext=text='V':font='Segoe UI':fontsize=14:fontcolor=#09090b:x=94:y=56:enable='between(t,0.3,9)',"
$f4 += "drawtext=text='Vintage Club':font='Segoe UI':fontsize=18:fontcolor=white:x=130:y=57:enable='between(t,0.3,9)',"
$f4 += "drawtext=text='Escolha o Barbeiro':font='Segoe UI':fontsize=24:fontcolor=white:x=100:y=120:enable='between(t,0.5,9)',"
$f4 += "drawbox=x=100:y=170:w=860:h=72:c=#18181b:t=fill:enable='between(t,0.7,9)',"
$f4 += "drawbox=x=100:y=170:w=860:h=72:c=#22c55e@0.2:t=fill:enable='between(t,0.7,9)',"
$f4 += "drawbox=x=120:y=186:w=40:h=40:c=#3b82f6:r=20:t=fill:enable='between(t,0.7,9)',"
$f4 += "drawtext=text='RM':font='Segoe UI':fontsize=12:fontcolor=white:x=130:y=194:enable='between(t,0.7,9)',"
$f4 += "drawtext=text='Ricardo Menezes':font='Segoe UI':fontsize=17:fontcolor=white:x=180:y=186:enable='between(t,0.7,9)',"
$f4 += "drawtext=text='Especialista em degrade e barba desenhada':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=180:y=212:enable='between(t,0.7,9)',"
$f4 += "drawbox=x=100:y=254:w=860:h=72:c=#18181b:t=fill:enable='between(t,1.2,9)',"
$f4 += "drawbox=x=120:y=270:w=40:h=40:c=#10b981:r=20:t=fill:enable='between(t,1.2,9)',"
$f4 += "drawtext=text='PL':font='Segoe UI':fontsize=12:fontcolor=white:x=130:y=278:enable='between(t,1.2,9)',"
$f4 += "drawtext=text='Paulo Lima':font='Segoe UI':fontsize=17:fontcolor=white:x=180:y=270:enable='between(t,1.2,9)',"
$f4 += "drawtext=text='Corte classico e navalha':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=180:y=296:enable='between(t,1.2,9)',"
$f4 += "drawbox=x=100:y=338:w=860:h=72:c=#18181b:t=fill:enable='between(t,1.7,9)',"
$f4 += "drawbox=x=120:y=354:w=40:h=40:c=#8b5cf6:r=20:t=fill:enable='between(t,1.7,9)',"
$f4 += "drawtext=text='AF':font='Segoe UI':fontsize=12:fontcolor=white:x=130:y=362:enable='between(t,1.7,9)',"
$f4 += "drawtext=text='Andre Ferreira':font='Segoe UI':fontsize=17:fontcolor=white:x=180:y=354:enable='between(t,1.7,9)',"
$f4 += "drawtext=text='Hidratacao e tratamentos capilares':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=180:y=380:enable='between(t,1.7,9)',"
$f4 += "drawbox=x=100:y=422:w=860:h=72:c=#18181b:t=fill:enable='between(t,2.2,9)',"
$f4 += "drawbox=x=120:y=438:w=40:h=40:c=#f59e0b:r=20:t=fill:enable='between(t,2.2,9)',"
$f4 += "drawtext=text='LS':font='Segoe UI':fontsize=12:fontcolor=white:x=130:y=446:enable='between(t,2.2,9)',"
$f4 += "drawtext=text='Lucas Silva':font='Segoe UI':fontsize=17:fontcolor=white:x=180:y=438:enable='between(t,2.2,9)',"
$f4 += "drawtext=text='Barbearia tradicional e infantil':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=180:y=464:enable='between(t,2.2,9)'"
New-Video "scene04" 9 $f4

$f5 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill,"
$f5 += "drawtext=text='Data e Horario':font='Segoe UI':fontsize=24:fontcolor=white:x=100:y=80:enable='between(t,0.3,5)',"
$f5 += "drawtext=text='Ricardo Menezes - Corte Degrade':font='Segoe UI':fontsize=13:fontcolor=#52525b:x=100:y=120:enable='between(t,0.5,5)',"
$f5 += "drawbox=x=100:y=160:w=90:h=100:c=#18181b:r=14:t=fill:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='DOM':font='Segoe UI':fontsize=9:fontcolor=#3f3f46:x=131:y=178:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='06':font='Segoe UI':fontsize=20:fontcolor=#3f3f46:x=129:y=192:enable='between(t,0.7,5)',"
$f5 += "drawbox=x=204:y=160:w=90:h=100:c=#22c55e:r=14:t=fill:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='TER':font='Segoe UI':fontsize=9:fontcolor=#09090b:x=234:y=178:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='08':font='Segoe UI':fontsize=20:fontcolor=#09090b:x=233:y=192:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='Jul':font='Segoe UI':fontsize=9:fontcolor=#09090b:x=238:y=218:enable='between(t,0.7,5)',"
$f5 += "drawbox=x=308:y=160:w=90:h=100:c=#18181b:r=14:t=fill:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='QUA':font='Segoe UI':fontsize=9:fontcolor=#a1a1aa:x=337:y=178:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='09':font='Segoe UI':fontsize=20:fontcolor=white:x=336:y=192:enable='between(t,0.7,5)',"
$f5 += "drawbox=x=412:y=160:w=90:h=100:c=#18181b:r=14:t=fill:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='QUI':font='Segoe UI':fontsize=9:fontcolor=#a1a1aa:x=441:y=178:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='10':font='Segoe UI':fontsize=20:fontcolor=white:x=439:y=192:enable='between(t,0.7,5)',"
$f5 += "drawtext=text='Horarios':font='Segoe UI':fontsize=15:fontcolor=#a1a1aa:x=100:y=290:enable='between(t,1,5)',"
$f5 += "drawbox=x=100:y=330:w=100:h=44:c=#18181b:t=fill:enable='between(t,1.2,5)',"
$f5 += "drawtext=text='08:00':font='Segoe UI':fontsize=15:fontcolor=#a1a1aa:x=131:y=348:enable='between(t,1.2,5)',"
$f5 += "drawbox=x=212:y=330:w=100:h=44:c=#22c55e:t=fill:enable='between(t,1.2,5)',"
$f5 += "drawtext=text='11:00':font='Segoe UI':fontsize=15:fontcolor=#09090b:x=243:y=348:enable='between(t,1.2,5)',"
$f5 += "drawbox=x=324:y=330:w=100:h=44:c=#18181b:t=fill:enable='between(t,1.2,5)',"
$f5 += "drawtext=text='14:00':font='Segoe UI':fontsize=15:fontcolor=#a1a1aa:x=354:y=348:enable='between(t,1.2,5)',"
$f5 += "drawbox=x=750:y=420:w=160:h=44:c=#22c55e:t=fill:enable='between(t,2,5)',"
$f5 += "drawtext=text='Continuar':font='Segoe UI':fontsize=15:fontcolor=#09090b:x=805:y=436:enable='between(t,2,5)'"
New-Video "scene05" 5 $f5

$f6 = "drawbox=x=0:y=0:w=1920:h=1080:c=#09090b:t=fill,"
$f6 += "drawbox=x=640:y=240:w=640:h=600:c=#18181b:r=24:t=fill:enable='between(t,0.3,6)',"
$f6 += "drawbox=x=880:y=280:w=72:h=72:c=#22c55e:r=36:t=fill:enable='between(t,0.5,6)',"
$f6 += "drawtext=text='V':font='Segoe UI':fontsize=36:fontcolor=#09090b:x=908:y=296:enable='between(t,0.5,6)',"
$f6 += "drawtext=text='Agendamento Confirmado!':font='Segoe UI':fontsize=28:fontcolor=white:x=(w-text_w)/2:y=390:enable='between(t,0.7,6)',"
$f6 += "drawtext=text='Corte Degrade com Ricardo Menezes':font='Segoe UI':fontsize=16:fontcolor=#a1a1aa:x=(w-text_w)/2:y=430:enable='between(t,0.9,6)',"
$f6 += "drawtext=text='Terca, 08 de Julho de 2026':font='Segoe UI':fontsize=14:fontcolor=#52525b:x=(w-text_w)/2:y=470:enable='between(t,1.1,6)',"
$f6 += "drawtext=text='as 11:00 - Duracao: 40 min':font='Segoe UI':fontsize=14:fontcolor=#52525b:x=(w-text_w)/2:y=496:enable='between(t,1.1,6)',"
$f6 += "drawtext=text='Pagamento: Pix':font='Segoe UI':fontsize=14:fontcolor=#52525b:x=(w-text_w)/2:y=522:enable='between(t,1.1,6)',"
$f6 += "drawtext=text='Valor: R$ 45,00':font='Segoe UI':fontsize=20:fontcolor=#22c55e:x=(w-text_w)/2:y=560:enable='between(t,1.3,6)',"
$f6 += "drawbox=x=780:y=620:w=360:h=48:c=#22c55e:t=fill:enable='between(t,1.5,6)',"
$f6 += "drawtext=text='Meus Agendamentos':font='Segoe UI':fontsize=15:fontcolor=#09090b:x=(w-text_w)/2:y=647:enable='between(t,1.5,6)',"
$f6 += "drawtext=text='Novo Agendamento':font='Segoe UI':fontsize=15:fontcolor=#52525b:x=(w-text_w)/2:y=690:enable='between(t,2,6)',"
$f6 += "drawtext=text='barberplan-nine.vercel.app':font='Segoe UI':fontsize=14:fontcolor=#3f3f46:x=(w-text_w)/2:y=1030:enable='between(t,0.5,6)'"
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
