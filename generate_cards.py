import os
from PIL import Image, ImageDraw, ImageFont

def make_product_card(image_path, output_path):
    try:
        img = Image.open(image_path)
        target_w, target_h = 1080, 1440
        
        # Создаем чистый фон (светло-серый, почти белый)
        canvas = Image.new('RGBA', (target_w, target_h), (245, 245, 245, 255))
        
        img_ratio = img.width / img.height
        target_ratio = target_w / target_h
        
        # Ресайзим картинку так, чтобы она красиво вписывалась (оставляем немного полей)
        if img_ratio > target_ratio:
            new_w = int(target_w * 0.95)
            new_h = int(new_w / img_ratio)
        else:
            new_h = int(target_h * 0.95)
            new_w = int(new_h * img_ratio)
            
        img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        paste_x = (target_w - new_w) // 2
        paste_y = (target_h - new_h) // 2
        
        # Накладываем картинку на фон
        if img_resized.mode == 'RGBA':
            bg = Image.new('RGBA', img_resized.size, (255, 255, 255, 255))
            bg.paste(img_resized, mask=img_resized.split()[3])
            canvas.paste(bg, (paste_x, paste_y))
        else:
            img_resized = img_resized.convert('RGBA')
            canvas.paste(img_resized, (paste_x, paste_y))
            
        # Водяной знак "BASE."
        txt_layer = Image.new('RGBA', canvas.size, (255, 255, 255, 0))
        d = ImageDraw.Draw(txt_layer)
        
        try:
            font_logo = ImageFont.truetype("ariblk.ttf", 60)
        except IOError:
            font_logo = ImageFont.load_default()
            
        # Полупрозрачный водяной знак в правом нижнем углу
        text = "BASE."
        bbox = d.textbbox((0, 0), text, font=font_logo)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        
        x_pos = target_w - tw - 40
        y_pos = target_h - th - 50
        
        # Цвет: черный с прозрачностью (альфа 80 из 255)
        d.text((x_pos, y_pos), text, fill=(0, 0, 0, 80), font=font_logo)
        
        # Объединяем слои
        out = Image.alpha_composite(canvas, txt_layer)
        out = out.convert('RGB')
        
        out.save(output_path)
        print(f"Saved {output_path}")
        
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

images = [
    'images/pants-white.png',
    'images/pants-beige.jpg',
    'images/hoodie-black.png',
    'images/sweatpants-grey.jpg',
    'images/hoodie-redblack.png',
    'images/jeans-blue.png',
    'images/jeans-black.png',
    'images/hoodie-lsd.png'
]

out_dir = "images_cards"
os.makedirs(out_dir, exist_ok=True)

for img_file in images:
    out_name = "card_" + os.path.basename(img_file)
    out_name = os.path.splitext(out_name)[0] + '.jpg'
    out_path = os.path.join(out_dir, out_name)
    make_product_card(img_file, out_path)
