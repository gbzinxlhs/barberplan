#!/bin/bash
# BarberPlan Demo Video Builder
# Requires: playwright (npx playwright), edge-tts, ffmpeg
# Run: bash build.sh

set -e

OUTPUT="output.mp4"
FRAMES_DIR="frames"
AUDIO_DIR="audio"
SCENES_JSON="scenes.json"

mkdir -p "$FRAMES_DIR" "$AUDIO_DIR"

echo "=== Taking screenshots of each scene ==="
for scene in scenes/scene-*.html; do
  name=$(basename "$scene" .html)
  echo "  Capturing $name..."
  npx playwright screenshot --viewport-size=1920,1080 "$scene" "$FRAMES_DIR/${name}.png"
done

echo "=== Generating narration audio ==="
for nar in narration/scene-*.txt; do
  name=$(basename "$nar" .txt)
  echo "  Generating $name..."
  edge-tts --voice pt-BR-AntonioNeural --file "$nar" --write-media "$AUDIO_DIR/${name}.mp3"
done

echo "=== Building video with ffmpeg ==="
# Scene 01 - 5s
ffmpeg -y -loop 1 -i "$FRAMES_DIR/scene-01.png" -c:v libx264 -t 5 -pix_fmt yuv420p -vf "scale=1920:1080" tmp01.mp4

# Scene 02 - 6s
ffmpeg -y -loop 1 -i "$FRAMES_DIR/scene-02.png" -c:v libx264 -t 6 -pix_fmt yuv420p -vf "scale=1920:1080" tmp02.mp4

# Scene 03 - 7s
ffmpeg -y -loop 1 -i "$FRAMES_DIR/scene-03.png" -c:v libx264 -t 7 -pix_fmt yuv420p -vf "scale=1920:1080" tmp03.mp4

# Scene 04 - 9s
ffmpeg -y -loop 1 -i "$FRAMES_DIR/scene-04.png" -c:v libx264 -t 9 -pix_fmt yuv420p -vf "scale=1920:1080" tmp04.mp4

# Scene 05 - 5s
ffmpeg -y -loop 1 -i "$FRAMES_DIR/scene-05.png" -c:v libx264 -t 5 -pix_fmt yuv420p -vf "scale=1920:1080" tmp05.mp4

# Scene 06 - 6s
ffmpeg -y -loop 1 -i "$FRAMES_DIR/scene-06.png" -c:v libx264 -t 6 -pix_fmt yuv420p -vf "scale=1920:1080" tmp06.mp4

echo "=== Concatenating scenes with crossfade ==="
# Create concat file
for f in tmp01.mp4 tmp02.mp4 tmp03.mp4 tmp04.mp4 tmp05.mp4 tmp06.mp4; do
  echo "file '$f'" >> concat_list.txt
done

# Crossfade between scenes using ffmpeg concat
ffmpeg -y -f concat -safe 0 -i concat_list.txt -c:v libx264 -pix_fmt yuv420p "tmp_concat.mp4"

echo "=== Adding audio narration ==="
# Concatenate audio files
ffmpeg -y -i "concat:$(echo audio/scene-*.mp3 | tr ' ' '|')" -acodec copy "tmp_audio.mp3"

# Final video with audio
ffmpeg -y -i "tmp_concat.mp4" -i "tmp_audio.mp3" -c:v copy -c:a aac -shortest "$OUTPUT"

echo "=== Cleaning up ==="
rm -f tmp*.mp4 tmp_audio.mp3 concat_list.txt

echo "=== Done! Video saved as $OUTPUT ==="
