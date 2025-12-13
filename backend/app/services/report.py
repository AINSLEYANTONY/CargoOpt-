import os
from typing import List, Dict
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def generate_report_packing(container: Dict, placements: List[Dict], utilization: float, base_dir: str) -> str:
    os.makedirs(base_dir, exist_ok=True)
    filename = f"packing_{datetime.utcnow().timestamp()}.pdf"
    path = os.path.join(base_dir, filename)

    c = canvas.Canvas(path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, height - 40, "Packing AI Report")

    c.setFont("Helvetica", 12)
    c.drawString(40, height - 70, f"Container: {container['length']} x {container['width']} x {container['height']}")
    c.drawString(40, height - 90, f"Utilization: {utilization*100:.2f} %")

    y_cursor = height - 120
    for p in placements[:40]:
        c.drawString(
            40,
            y_cursor,
            f"Box {p['id']}: pos=({p['x']:.1f},{p['y']:.1f},{p['z']:.1f}), "
            f"size=({p['length']:.1f},{p['width']:.1f},{p['height']:.1f}), caution={p['caution']}",
        )
        y_cursor -= 15
        if y_cursor < 40:
            c.showPage()
            y_cursor = height - 40

    c.save()
    return path
