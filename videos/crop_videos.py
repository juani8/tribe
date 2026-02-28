from moviepy.editor import VideoFileClip
from PIL import Image
import os
import numpy as np

# Fix para Pillow 10+ que removió ANTIALIAS
if not hasattr(Image, 'ANTIALIAS'):
    Image.ANTIALIAS = Image.Resampling.LANCZOS

# Carpetas
INPUT_DIR = r"E:\Otro\portfolio\tribe-app\videos"
OUTPUT_DIR = r"E:\Otro\portfolio\tribe-app\videos\cropped"

def detect_black_borders(video_path, sample_time=1.0):
    """
    Detecta los bordes negros analizando un frame del video.
    Retorna (left_crop, right_crop) en píxeles.
    """
    clip = VideoFileClip(video_path)
    
    # Obtener un frame del video
    frame = clip.get_frame(min(sample_time, clip.duration - 0.1))
    clip.close()
    
    # Convertir a escala de grises para detectar negro
    gray = np.mean(frame, axis=2)
    
    height, width = gray.shape
    threshold = 15  # Píxeles con valor < 15 se consideran negros
    
    # Detectar borde izquierdo
    left_crop = 0
    for x in range(width // 2):
        column = gray[:, x]
        if np.mean(column) > threshold:
            left_crop = x
            break
    
    # Detectar borde derecho
    right_crop = 0
    for x in range(width - 1, width // 2, -1):
        column = gray[:, x]
        if np.mean(column) > threshold:
            right_crop = width - x - 1
            break
    
    return left_crop, right_crop

def crop_video(input_path, output_path, left_crop, right_crop):
    """
    Recorta los bordes laterales del video.
    """
    try:
        clip = VideoFileClip(input_path)
        
        width, height = clip.size
        
        # Calcular nuevas dimensiones
        new_width = width - left_crop - right_crop
        
        # Aplicar crop: crop(x1, y1, x2, y2)
        cropped = clip.crop(x1=left_crop, y1=0, x2=width - right_crop, y2=height)
        
        # Guardar video
        cropped.write_videofile(
            output_path,
            codec='libx264',
            audio_codec='aac',
            temp_audiofile='temp-audio.m4a',
            remove_temp=True,
            verbose=False,
            logger=None
        )
        
        cropped.close()
        clip.close()
        
        return True
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    # Crear carpeta de salida
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Obtener todos los videos MP4
    videos = [f for f in os.listdir(INPUT_DIR) if f.endswith('.mp4')]
    
    print(f"\n🎬 Procesando {len(videos)} videos...\n")
    print("=" * 60)
    
    success_count = 0
    
    for video in sorted(videos):
        input_path = os.path.join(INPUT_DIR, video)
        output_path = os.path.join(OUTPUT_DIR, video)
        
        print(f"\n📹 {video}")
        
        # Detectar bordes
        left, right = detect_black_borders(input_path)
        print(f"   Bordes detectados: izq={left}px, der={right}px")
        
        if left == 0 and right == 0:
            print(f"   ⏭️  Sin bordes negros, copiando...")
            # Simplemente copiar si no hay bordes
            import shutil
            shutil.copy2(input_path, output_path)
            success_count += 1
        else:
            print(f"   ✂️  Recortando...")
            if crop_video(input_path, output_path, left, right):
                print(f"   ✅ Guardado")
                success_count += 1
    
    print("\n" + "=" * 60)
    print(f"\n🎉 Completado: {success_count}/{len(videos)} videos procesados")
    print(f"📁 Ubicación: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
