import os

os.makedirs('docs/diagrams', exist_ok=True)

svg_template = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" width="{width}" height="{height}">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.06"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8"/>
    </marker>
    <style>
      .box {{ fill: #ffffff; stroke: #cbd5e1; stroke-width: 1px; filter: url(#shadow); }}
      .box-blue {{ fill: #eff6ff; stroke: #3b82f6; stroke-width: 1.5px; filter: url(#shadow); }}
      .text {{ font-family: 'Inter', -apple-system, sans-serif; font-size: 13px; fill: #0f172a; text-anchor: middle; dominant-baseline: middle; font-weight: 500; }}
      .text-blue {{ font-family: 'Inter', -apple-system, sans-serif; font-size: 13px; fill: #1d4ed8; text-anchor: middle; dominant-baseline: middle; font-weight: 600; }}
      .line {{ stroke: #94a3b8; stroke-width: 1.5px; fill: none; marker-end: url(#arrow); }}
      .line-no-arrow {{ stroke: #94a3b8; stroke-width: 1.5px; fill: none; }}
    </style>
  </defs>
  <rect width="100%" height="100%" fill="#ffffff" />
{content}
</svg>"""

def rect(x, y, w, h, text, is_blue=False):
    c = "box-blue" if is_blue else "box"
    tc = "text-blue" if is_blue else "text"
    return f"""  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" class="{c}" />
  <text x="{x + w/2}" y="{y + h/2 + 1}" class="{tc}">{text}</text>"""

def path(d, arrow=True):
    c = "line" if arrow else "line-no-arrow"
    return f"""  <path d="{d}" class="{c}"/>"""

# Diagram 1: System Architecture
content1 = []
nodes1 = ["Citizen Reports", "Weather APIs", "Government APIs", "Satellite Data"]
w1 = 150
gap1 = 20
cx = 400
for i, n in enumerate(nodes1):
    x = cx - (4*w1 + 3*gap1)/2 + i*(w1+gap1)
    content1.append(rect(x, 50, w1, 44, n))
    content1.append(path(f"M {x+w1/2} 94 L {x+w1/2} 120 L 400 120 L 400 145"))

content1.append(rect(400-80, 150, 160, 44, "Simulation Engine", True))
content1.append(path(f"M 400 194 L 400 245"))

content1.append(rect(400-80, 250, 160, 44, "AI Decision Engine", True))

nodes4 = ["Dashboard", "Interactive Map", "Alert System", "Resource Manager", "Weather Intelligence"]
w4 = 140
gap4 = 15
for i, n in enumerate(nodes4):
    x = cx - (5*w4 + 4*gap4)/2 + i*(w4+gap4)
    content1.append(rect(x, 350, w4, 44, n))
    content1.append(path(f"M 400 294 L 400 320 L {x+w4/2} 320 L {x+w4/2} 345"))

svg1 = svg_template.format(viewbox="0 0 800 450", width="800", height="450", content="\n".join(content1))
with open('docs/diagrams/system_architecture.svg', 'w') as f: f.write(svg1)


# Diagram 2: Dashboard Data Flow
content2 = []
cx2 = 530
content2.append(rect(cx2-80, 50, 160, 44, "Simulation Engine", True))
content2.append(path(f"M {cx2} 94 L {cx2} 145"))
content2.append(rect(cx2-80, 150, 160, 44, "Simulation Context"))
content2.append(path(f"M {cx2} 194 L {cx2} 245"))
content2.append(rect(cx2-80, 250, 160, 44, "useSimulation()"))

nodes2 = ["Metric Cards", "Incident Feed", "Weather Widget", "Resource Tracker", "AI Command", "Impact Summary", "Risk Map"]
w2 = 135
gap2 = 15
for i, n in enumerate(nodes2):
    x = cx2 - (7*w2 + 6*gap2)/2 + i*(w2+gap2)
    content2.append(rect(x, 350, w2, 44, n))
    content2.append(path(f"M {cx2} 294 L {cx2} 320 L {x+w2/2} 320 L {x+w2/2} 345"))

svg2 = svg_template.format(viewbox="0 0 1060 450", width="1060", height="450", content="\n".join(content2))
with open('docs/diagrams/dashboard_data_flow.svg', 'w') as f: f.write(svg2)


# Diagram 3: Disaster Simulation
content3 = []
nodes3 = ["Normal", "Heavy Rain", "Citizen Reports", "Flood Warning", "Road Closure", "Shelter Activated", "Rescue Deployment", "Recovery", "Completed"]
w3 = 140
h3 = 44
gap3 = 40
start_x = 20
start_y = 40
for i, n in enumerate(nodes3):
    row = i // 3
    col = i % 3
    if row % 2 == 1:
        col = 2 - col # reverse
    x = start_x + col * (w3 + gap3)
    y = start_y + row * (h3 + 60)
    is_b = (i == 0 or i == 8)
    content3.append(rect(x, y, w3, h3, n, is_b))
    
    if i < 8:
        next_row = (i + 1) // 3
        next_col = (i + 1) % 3
        if next_row % 2 == 1:
            next_col = 2 - next_col
            
        if next_row == row:
            if next_col > col:
                content3.append(path(f"M {x+w3} {y+h3/2} L {x+w3+gap3-5} {y+h3/2}"))
            else:
                content3.append(path(f"M {x} {y+h3/2} L {x-gap3+5} {y+h3/2}"))
        else:
            content3.append(path(f"M {x+w3/2} {y+h3} L {x+w3/2} {y+h3+60-5}"))

svg3 = svg_template.format(viewbox="0 0 540 340", width="540", height="340", content="\n".join(content3))
with open('docs/diagrams/disaster_simulation.svg', 'w') as f: f.write(svg3)


# Diagram 4: AI Pipeline
content4 = []
nodes4 = ["Disaster Data", "Risk Analysis", "Threat Assessment", "Resource Allocation", "AI Recommendations", "Operations Dashboard"]
for i, n in enumerate(nodes4):
    row = i // 3
    col = i % 3
    if row % 2 == 1:
        col = 2 - col # reverse
    x = start_x + col * (w3 + gap3)
    y = start_y + row * (h3 + 60)
    is_b = (n == "AI Recommendations" or n == "Operations Dashboard")
    content4.append(rect(x, y, w3, h3, n, is_b))
    
    if i < 5:
        next_row = (i + 1) // 3
        next_col = (i + 1) % 3
        if next_row % 2 == 1:
            next_col = 2 - next_col
            
        if next_row == row:
            if next_col > col:
                content4.append(path(f"M {x+w3} {y+h3/2} L {x+w3+gap3-5} {y+h3/2}"))
            else:
                content4.append(path(f"M {x} {y+h3/2} L {x-gap3+5} {y+h3/2}"))
        else:
            content4.append(path(f"M {x+w3/2} {y+h3} L {x+w3/2} {y+h3+60-5}"))

svg4 = svg_template.format(viewbox="0 0 540 240", width="540", height="240", content="\n".join(content4))
with open('docs/diagrams/ai_pipeline.svg', 'w') as f: f.write(svg4)


# Diagram 5: Project Structure
content5 = []
cx5 = 575
content5.append(rect(cx5-80, 40, 160, 44, "Project Structure", True))

nodes5 = ["app", "components", "context", "hooks", "simulation", "data", "types", "utils", "public"]
w5 = 110
gap5 = 15
for i, n in enumerate(nodes5):
    x = cx5 - (9*w5 + 8*gap5)/2 + i*(w5+gap5)
    content5.append(rect(x, 140, w5, 44, n))
    content5.append(path(f"M {cx5} 84 L {cx5} 112 L {x+w5/2} 112 L {x+w5/2} 135"))

svg5 = svg_template.format(viewbox="0 0 1150 250", width="1150", height="250", content="\n".join(content5))
with open('docs/diagrams/project_structure.svg', 'w') as f: f.write(svg5)
