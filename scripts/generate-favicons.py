import os
from PIL import Image, ImageDraw, ImageFilter

def generate():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(root_dir, "public")
    app_dir = os.path.join(root_dir, "src", "app")
    src_path = os.path.join(public_dir, "logo-icon.png")

    if not os.path.exists(src_path):
        raise FileNotFoundError(f"Source emblem not found at {src_path}")

    src = Image.open(src_path).convert("RGBA")

    def create_squircle_icon(size, sharpen=True):
        scale = 4
        canvas_sz = size * scale
        canvas = Image.new("RGBA", (canvas_sz, canvas_sz), (0, 0, 0, 0))
        
        # 20% corner radius
        r = int(canvas_sz * 0.20)
        mask = Image.new("L", (canvas_sz, canvas_sz), 0)
        ImageDraw.Draw(mask).rounded_rectangle([(0, 0), (canvas_sz - 1, canvas_sz - 1)], radius=r, fill=255)
        
        bg = Image.new("RGBA", (canvas_sz, canvas_sz), (0, 0, 0, 255))
        
        pad = 0.04 if size <= 32 else 0.08
        emblem_sz = int(canvas_sz * (1 - 2 * pad))
        emblem = src.resize((emblem_sz, emblem_sz), Image.Resampling.LANCZOS)
        
        offset = (canvas_sz - emblem_sz) // 2
        bg.paste(emblem, (offset, offset), emblem)
        
        canvas.paste(bg, (0, 0), mask)
        res = canvas.resize((size, size), Image.Resampling.LANCZOS)
        if sharpen and size <= 48:
            res = res.filter(ImageFilter.UnsharpMask(radius=1.0, percent=140, threshold=2))
        return res

    def create_solid_icon(size, pad_factor=0.10):
        scale = 2 if size <= 256 else 1
        canvas_sz = size * scale
        bg = Image.new("RGBA", (canvas_sz, canvas_sz), (0, 0, 0, 255))
        
        emblem_sz = int(canvas_sz * (1 - 2 * pad_factor))
        emblem = src.resize((emblem_sz, emblem_sz), Image.Resampling.LANCZOS)
        offset = (canvas_sz - emblem_sz) // 2
        bg.paste(emblem, (offset, offset), emblem)
        return bg.resize((size, size), Image.Resampling.LANCZOS)

    # 1. Favicon resolutions
    ico_16 = create_squircle_icon(16, sharpen=True)
    ico_32 = create_squircle_icon(32, sharpen=True)
    ico_48 = create_squircle_icon(48, sharpen=True)

    # Multi-size ICO files
    ico_32.save(os.path.join(app_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    ico_32.save(os.path.join(public_dir, "favicon.ico"), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

    # Standard PNG favicons
    ico_16.save(os.path.join(public_dir, "favicon-16x16.png"))
    ico_32.save(os.path.join(public_dir, "favicon-32x32.png"))

    # Next.js App Router & Web App Icons
    icon_512 = create_squircle_icon(512, sharpen=False)
    icon_512.save(os.path.join(app_dir, "icon.png"))
    icon_512.save(os.path.join(public_dir, "icon.png"))

    # Apple Touch Icon (180x180 solid opaque with iOS safe padding)
    apple_icon = create_solid_icon(180, pad_factor=0.12)
    apple_icon.save(os.path.join(app_dir, "apple-icon.png"))
    apple_icon.save(os.path.join(public_dir, "apple-touch-icon.png"))

    # Android Chrome PWA icons
    chrome_192 = create_solid_icon(192, pad_factor=0.10)
    chrome_192.save(os.path.join(public_dir, "android-chrome-192x192.png"))
    chrome_512 = create_solid_icon(512, pad_factor=0.10)
    chrome_512.save(os.path.join(public_dir, "android-chrome-512x512.png"))

    # Ensure public/logo.png is true PNG format
    logo_path = os.path.join(public_dir, "logo.png")
    if os.path.exists(logo_path):
        logo_img = Image.open(logo_path)
        logo_img.save(logo_path, format="PNG")

    print("Generated all favicon and app icon assets successfully.")

if __name__ == "__main__":
    generate()
