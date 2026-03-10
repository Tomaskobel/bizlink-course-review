"""
Generate PDF Management Report — Course Review Status
BizLink LSH3 Dress Pack System (BCM-100)
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect, String, Circle, Line
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from datetime import datetime
import os

# ── Colors ──────────────────────────────────────────────────────
SLATE_900 = HexColor("#0f172a")
SLATE_700 = HexColor("#334155")
SLATE_500 = HexColor("#64748b")
SLATE_400 = HexColor("#94a3b8")
SLATE_200 = HexColor("#e2e8f0")
SLATE_100 = HexColor("#f1f5f9")
SLATE_50  = HexColor("#f8fafc")

RED_600   = HexColor("#dc2626")
RED_100   = HexColor("#fee2e2")
RED_50    = HexColor("#fef2f2")
AMBER_600 = HexColor("#d97706")
AMBER_100 = HexColor("#fef3c7")
AMBER_50  = HexColor("#fffbeb")
GREEN_600 = HexColor("#16a34a")
GREEN_100 = HexColor("#dcfce7")
GREEN_50  = HexColor("#f0fdf4")
BLUE_600  = HexColor("#2563eb")
BLUE_100  = HexColor("#dbeafe")
BLUE_50   = HexColor("#eff6ff")
PURPLE_600 = HexColor("#9333ea")
PURPLE_100 = HexColor("#f3e8ff")

BRAND_DARK = HexColor("#1e293b")
BRAND_ACCENT = HexColor("#3b82f6")

# ── Styles ──────────────────────────────────────────────────────
def make_styles():
    return {
        "title": ParagraphStyle(
            "title", fontName="Helvetica-Bold", fontSize=22,
            textColor=SLATE_900, leading=28, spaceAfter=4
        ),
        "subtitle": ParagraphStyle(
            "subtitle", fontName="Helvetica", fontSize=11,
            textColor=SLATE_500, leading=16, spaceAfter=20
        ),
        "h1": ParagraphStyle(
            "h1", fontName="Helvetica-Bold", fontSize=15,
            textColor=SLATE_900, leading=20, spaceBefore=16, spaceAfter=8
        ),
        "h2": ParagraphStyle(
            "h2", fontName="Helvetica-Bold", fontSize=11,
            textColor=SLATE_700, leading=15, spaceBefore=12, spaceAfter=6
        ),
        "body": ParagraphStyle(
            "body", fontName="Helvetica", fontSize=9,
            textColor=SLATE_700, leading=13, spaceAfter=4
        ),
        "body_small": ParagraphStyle(
            "body_small", fontName="Helvetica", fontSize=8,
            textColor=SLATE_500, leading=11, spaceAfter=2
        ),
        "label": ParagraphStyle(
            "label", fontName="Helvetica-Bold", fontSize=8,
            textColor=SLATE_500, leading=10
        ),
        "stat_value": ParagraphStyle(
            "stat_value", fontName="Helvetica-Bold", fontSize=24,
            textColor=SLATE_900, leading=28, alignment=TA_CENTER
        ),
        "stat_label": ParagraphStyle(
            "stat_label", fontName="Helvetica", fontSize=8,
            textColor=SLATE_500, leading=10, alignment=TA_CENTER
        ),
        "footer": ParagraphStyle(
            "footer", fontName="Helvetica", fontSize=7,
            textColor=SLATE_400, alignment=TA_RIGHT
        ),
    }


# ── Page template ───────────────────────────────────────────────
def header_footer(canvas_obj, doc):
    canvas_obj.saveState()
    w, h = A4

    # Header line
    canvas_obj.setStrokeColor(SLATE_200)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(20*mm, h - 18*mm, w - 20*mm, h - 18*mm)

    # Header left
    canvas_obj.setFont("Helvetica-Bold", 8)
    canvas_obj.setFillColor(SLATE_500)
    canvas_obj.drawString(20*mm, h - 16*mm, "BizLink  |  Course Review Status Report")

    # Header right
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.drawRightString(w - 20*mm, h - 16*mm, "BCM-100  •  Module 1")

    # Footer
    canvas_obj.setStrokeColor(SLATE_200)
    canvas_obj.line(20*mm, 14*mm, w - 20*mm, 14*mm)
    canvas_obj.setFont("Helvetica", 7)
    canvas_obj.setFillColor(SLATE_400)
    canvas_obj.drawString(20*mm, 10*mm, f"Generated {datetime.now().strftime('%B %d, %Y at %H:%M')}")
    canvas_obj.drawRightString(w - 20*mm, 10*mm, f"Page {doc.page}")

    canvas_obj.restoreState()


def first_page(canvas_obj, doc):
    canvas_obj.saveState()
    w, h = A4

    # Dark header band
    canvas_obj.setFillColor(BRAND_DARK)
    canvas_obj.rect(0, h - 85*mm, w, 85*mm, fill=1, stroke=0)

    # Accent line
    canvas_obj.setFillColor(BRAND_ACCENT)
    canvas_obj.rect(20*mm, h - 85*mm, 40*mm, 2, fill=1, stroke=0)

    # Title text
    canvas_obj.setFont("Helvetica", 10)
    canvas_obj.setFillColor(SLATE_400)
    canvas_obj.drawString(20*mm, h - 28*mm, "COURSE REVIEW STATUS REPORT")

    canvas_obj.setFont("Helvetica-Bold", 26)
    canvas_obj.setFillColor(white)
    canvas_obj.drawString(20*mm, h - 42*mm, "LSH3 Dress Pack System")

    canvas_obj.setFont("Helvetica", 13)
    canvas_obj.setFillColor(SLATE_400)
    canvas_obj.drawString(20*mm, h - 54*mm, "Module 1  •  BCM-100")

    # Date + status
    canvas_obj.setFont("Helvetica", 10)
    canvas_obj.setFillColor(SLATE_400)
    canvas_obj.drawString(20*mm, h - 70*mm, datetime.now().strftime("%B %d, %Y"))

    # Status badge
    canvas_obj.setFillColor(AMBER_600)
    badge_x = w - 20*mm - 80
    canvas_obj.roundRect(badge_x, h - 73*mm, 80, 18, 4, fill=1, stroke=0)
    canvas_obj.setFont("Helvetica-Bold", 9)
    canvas_obj.setFillColor(white)
    canvas_obj.drawCentredString(badge_x + 40, h - 70*mm, "IN REVIEW")

    # Footer
    canvas_obj.setFont("Helvetica", 7)
    canvas_obj.setFillColor(SLATE_400)
    canvas_obj.drawString(20*mm, 10*mm, "Confidential — BizLink Internal")
    canvas_obj.drawRightString(w - 20*mm, 10*mm, "Page 1")

    canvas_obj.restoreState()


# ── Stat card (as table) ────────────────────────────────────────
def stat_card(value, label, color, styles):
    data = [
        [Paragraph(f'<font color="{color}">{value}</font>', styles["stat_value"])],
        [Paragraph(label, styles["stat_label"])],
    ]
    t = Table(data, colWidths=[38*mm], rowHeights=[28, 14])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), SLATE_50),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("VALIGN", (0, 0), (0, -1), "MIDDLE"),
        ("BOX", (0, 0), (0, -1), 0.5, SLATE_200),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("TOPPADDING", (0, 0), (0, 0), 6),
        ("BOTTOMPADDING", (0, -1), (0, -1), 6),
    ]))
    return t


# ── Build the PDF ───────────────────────────────────────────────
def build_report():
    output_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(output_dir)
    output_path = os.path.join(project_root, "Course_Review_Status_Report.pdf")

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        topMargin=22*mm,
        bottomMargin=18*mm,
        leftMargin=20*mm,
        rightMargin=20*mm,
    )

    styles = make_styles()
    story = []
    w = A4[0] - 40*mm  # usable width

    # ────────────────────────────────────────────────────────
    # PAGE 1: Cover + Executive Summary
    # ────────────────────────────────────────────────────────
    story.append(Spacer(1, 68*mm))  # space for cover header

    story.append(Paragraph("Executive Summary", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=SLATE_200, spaceAfter=8))

    story.append(Paragraph(
        "This report presents the current status of expert review for the <b>LSH3 Dress Pack System</b> "
        "eLearning course (Module 1). Three subject-matter experts reviewed the course content and "
        "submitted <b>64 comments</b>. These were processed into <b>7 global terminology rules</b>, "
        "<b>56 lesson-specific actions</b>, and <b>4 open conflicts</b> requiring management decisions.",
        styles["body"]
    ))
    story.append(Spacer(1, 6))

    # KPI cards row
    cards = Table(
        [[
            stat_card("64", "Raw Comments", SLATE_900, styles),
            stat_card("7", "Global Rules", BLUE_600.hexval(), styles),
            stat_card("56", "Slide Actions", AMBER_600.hexval(), styles),
            stat_card("4", "Open Conflicts", RED_600.hexval(), styles),
        ]],
        colWidths=[w/4]*4,
    )
    cards.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(cards)
    story.append(Spacer(1, 10))

    # Review progress
    story.append(Paragraph("Review Progress", styles["h2"]))

    progress_data = [
        [
            Paragraph("<b>Status</b>", styles["label"]),
            Paragraph("<b>Count</b>", styles["label"]),
            Paragraph("<b>Percentage</b>", styles["label"]),
        ],
        ["Pending review", "55", "98.2%"],
        ["Completed", "0", "0%"],
        ["Superseded", "1", "1.8%"],
    ]
    progress_table = Table(progress_data, colWidths=[w*0.5, w*0.25, w*0.25])
    progress_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SLATE_100),
        ("TEXTCOLOR", (0, 1), (-1, -1), SLATE_700),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, SLATE_200),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        # Highlight pending row
        ("BACKGROUND", (0, 1), (-1, 1), AMBER_50),
    ]))
    story.append(progress_table)
    story.append(Spacer(1, 10))

    # Reviewers
    story.append(Paragraph("Reviewers", styles["h2"]))
    reviewer_data = [
        [
            Paragraph("<b>Reviewer</b>", styles["label"]),
            Paragraph("<b>Role</b>", styles["label"]),
            Paragraph("<b>Comments</b>", styles["label"]),
            Paragraph("<b>Focus Areas</b>", styles["label"]),
        ],
        ["Hendrik Scharfenberg", "Product Expert", "~30", "Terminology, technical accuracy"],
        ["Jens Fritzsche", "Application Engineer", "~28", "Terminology, content, tone"],
        ["Knut Schmidt", "Field Engineer", "~6", "Safety, installation correctness"],
    ]
    rev_table = Table(reviewer_data, colWidths=[w*0.25, w*0.22, w*0.13, w*0.40])
    rev_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SLATE_100),
        ("TEXTCOLOR", (0, 1), (-1, -1), SLATE_700),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, SLATE_200),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(rev_table)

    # ────────────────────────────────────────────────────────
    # PAGE 2: Per-Lesson Breakdown
    # ────────────────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("Lesson-by-Lesson Breakdown", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=SLATE_200, spaceAfter=8))

    story.append(Paragraph(
        "The 56 actions are distributed across 9 lessons. Lesson 3 (Understanding the LSH3) "
        "has the highest concentration with 17 actions, including 1 safety-critical item.",
        styles["body"]
    ))
    story.append(Spacer(1, 6))

    lessons = [
        (1, "Introduction to LSH3 Dress Pack", 8, 1, 2, 5, 0, 8),
        (2, "Lesson 1: Objectives", 6, 0, 5, 1, 0, 6),
        (3, "Understanding the LSH3", 17, 1, 12, 4, 0, 16),
        (4, "Core System Components", 9, 0, 9, 0, 0, 9),
        (5, "LSH3 Utilities and Media", 4, 0, 4, 0, 0, 4),
        (6, "Umbilical Routing: J1-J3", 3, 0, 3, 0, 0, 3),
        (7, "Upper Axis Retraction: J3-J6", 3, 1, 2, 0, 0, 3),
        (8, "Umbilical Loop Behavior: J4-J6", 2, 0, 2, 0, 0, 2),
        (9, "Dress Pack Sizes and Media", 4, 0, 3, 1, 0, 4),
    ]

    lesson_header = [
        Paragraph("<b>Lesson</b>", styles["label"]),
        Paragraph("<b>Total</b>", styles["label"]),
        Paragraph("<b>P1</b>", styles["label"]),
        Paragraph("<b>P2</b>", styles["label"]),
        Paragraph("<b>P3</b>", styles["label"]),
        Paragraph("<b>P4</b>", styles["label"]),
        Paragraph("<b>Pending</b>", styles["label"]),
    ]

    lesson_data = [lesson_header]
    for idx, title, total, p1, p2, p3, p4, pending in lessons:
        p1_text = f'<font color="{RED_600.hexval()}"><b>{p1}</b></font>' if p1 > 0 else str(p1)
        row = [
            Paragraph(f"<b>{idx}.</b> {title}", styles["body_small"]),
            str(total),
            Paragraph(p1_text, styles["body_small"]),
            str(p2),
            str(p3),
            str(p4),
            str(pending),
        ]
        lesson_data.append(row)

    # Totals row
    lesson_data.append([
        Paragraph("<b>TOTAL</b>", styles["body_small"]),
        "56",
        Paragraph(f'<font color="{RED_600.hexval()}"><b>3</b></font>', styles["body_small"]),
        "42", "11", "0", "55"
    ])

    lt = Table(lesson_data, colWidths=[w*0.44, w*0.09, w*0.09, w*0.09, w*0.09, w*0.09, w*0.11])
    lt_style = [
        ("BACKGROUND", (0, 0), (-1, 0), SLATE_100),
        ("BACKGROUND", (0, -1), (-1, -1), SLATE_100),
        ("TEXTCOLOR", (0, 1), (-1, -1), SLATE_700),
        ("FONTNAME", (0, 1), (-1, -2), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, SLATE_200),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (0, -1), 8),
    ]
    # Highlight rows with P1 items
    for i, row_data in enumerate(lessons):
        if row_data[3] > 0:  # P1 > 0
            lt_style.append(("BACKGROUND", (2, i+1), (2, i+1), RED_50))

    lt.setStyle(TableStyle(lt_style))
    story.append(lt)
    story.append(Spacer(1, 12))

    # Category breakdown
    story.append(Paragraph("Category Distribution", styles["h2"]))

    cat_data = [
        [
            Paragraph("<b>Category</b>", styles["label"]),
            Paragraph("<b>Count</b>", styles["label"]),
            Paragraph("<b>% of Total</b>", styles["label"]),
            Paragraph("<b>Description</b>", styles["label"]),
        ],
        ["TERMINOLOGY", "21", "37.5%", "Naming / product term corrections"],
        ["CONTENT", "26", "46.4%", "Paragraph / section rewrites"],
        ["TECHNICAL", "3", "5.4%", "Factual errors or safety risks"],
        ["TONE", "4", "7.1%", "Informal wording adjustments"],
        ["VISUAL", "2", "3.6%", "Image / diagram errors"],
    ]
    ct = Table(cat_data, colWidths=[w*0.20, w*0.12, w*0.15, w*0.53])
    ct_style = [
        ("BACKGROUND", (0, 0), (-1, 0), SLATE_100),
        ("TEXTCOLOR", (0, 1), (-1, -1), SLATE_700),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ALIGN", (1, 0), (2, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, SLATE_200),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]
    ct.setStyle(TableStyle(ct_style))
    story.append(ct)

    # ────────────────────────────────────────────────────────
    # PAGE 3: Global Rules
    # ────────────────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("Global Terminology Rules", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=SLATE_200, spaceAfter=8))

    story.append(Paragraph(
        "These 7 rules apply across <b>all lessons</b>. Each was extracted from repeated reviewer "
        "comments pointing out the same issue in multiple places. Applying them globally ensures "
        "consistency without fixing each occurrence individually.",
        styles["body"]
    ))
    story.append(Spacer(1, 6))

    rules = [
        ("G-01", "P1", "Inconsistent synonyms", "Standardize per BizLink glossary", "Hendrik", 4, "TERMINOLOGY"),
        ("G-02", "P1", "Dress pack System / cable mgmt / LSH3 system", "Dresspack system with LSH3 retraction", "Hendrik", 6, "TERMINOLOGY"),
        ("G-03", "P1", "LSH3 = Dresspack (wrong)", "Dresspack = hose package + LSH3 + system support", "Hendrik", 2, "TECHNICAL"),
        ("G-04", "P2", "tool / tooling (inconsistent)", "end-of-arm tooling (EOAT)", "Jens", 3, "TERMINOLOGY"),
        ("G-05", "P2", "Housing body / main body / housing unit", "LSH3 base body", "Hendrik", 2, "TERMINOLOGY"),
        ("G-06", "P3", "Informal/colloquial wording", "Technical register for OEM technicians", "Jens", 2, "TONE"),
        ("G-07", "P3", "Generic/vague descriptions", "Specific BizLink product references", "Jens", 2, "TONE"),
    ]

    rule_header = [
        Paragraph("<b>Rule</b>", styles["label"]),
        Paragraph("<b>Priority</b>", styles["label"]),
        Paragraph("<b>Wrong</b>", styles["label"]),
        Paragraph("<b>Correct</b>", styles["label"]),
        Paragraph("<b>Occ.</b>", styles["label"]),
    ]

    rule_data = [rule_header]
    for rule_id, priority, wrong, correct, reviewer, occ, cat in rules:
        pri_color = RED_600 if priority == "P1" else (AMBER_600 if priority == "P2" else SLATE_500)
        rule_data.append([
            Paragraph(f"<b>{rule_id}</b>", styles["body_small"]),
            Paragraph(f'<font color="{pri_color.hexval()}"><b>{priority}</b></font>', styles["body_small"]),
            Paragraph(f'<font color="{SLATE_500.hexval()}"><strike>{wrong}</strike></font>', styles["body_small"]),
            Paragraph(f'<font color="{GREEN_600.hexval()}">{correct}</font>', styles["body_small"]),
            str(occ),
        ])

    rt = Table(rule_data, colWidths=[w*0.08, w*0.08, w*0.34, w*0.40, w*0.10])
    rt.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SLATE_100),
        ("TEXTCOLOR", (0, 1), (-1, -1), SLATE_700),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("ALIGN", (4, 0), (4, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, SLATE_200),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        # P1 rows highlight
        ("BACKGROUND", (0, 1), (-1, 3), RED_50),
    ]))
    story.append(rt)

    # ────────────────────────────────────────────────────────
    # PAGE 4: Open Conflicts
    # ────────────────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("Open Conflicts — Decisions Required", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=SLATE_200, spaceAfter=8))

    story.append(Paragraph(
        "These 4 conflicts arise when reviewers disagree or when a decision requires "
        "management/budget input. <b>Each conflict blocks further progress</b> on affected lessons.",
        styles["body"]
    ))
    story.append(Spacer(1, 8))

    conflicts = [
        {
            "id": "C-01", "status": "OPEN",
            "title": "Product name format",
            "description": "'LSH 3 retract system' vs 'LSH3 retraction system'",
            "option_a": "LSH 3 retract system (Jens)",
            "option_b": "BizLink LSH3 retraction system (Hendrik)",
            "affects": "All 9 lessons",
            "recommendation": "Hendrik's version aligns with BizLink website. Recommend: 'LSH3 retraction system'.",
            "is_safety": False,
        },
        {
            "id": "C-02", "status": "OPEN",
            "title": "Video content revision scope",
            "description": "Should videos be re-recorded or just text updated?",
            "option_a": "Revise video wording to match text (Hendrik)",
            "option_b": "Keep existing videos, update only text (current state)",
            "affects": "Lessons 3, 4",
            "recommendation": "Budget/timeline decision needed. Hendrik explicitly states video wording should be revised.",
            "is_safety": False,
        },
        {
            "id": "C-03", "status": "OPEN — SAFETY",
            "title": "J6 bracket installation shown incorrectly",
            "description": "Course image shows bracket in wrong orientation",
            "option_a": "Bracket for axle 6 must point towards the axle (Knut)",
            "option_b": "Current image shows bracket as-is",
            "affects": "Lesson 3",
            "recommendation": "SAFETY ISSUE: Risk that welding pliers cannot be installed. Must fix image/content.",
            "is_safety": True,
        },
        {
            "id": "C-04", "status": "OPEN",
            "title": "Guidance terminology: 3 options proposed",
            "description": "'Hose guidance' vs 'umbilical guidance' vs 'dress pack guidance'",
            "option_a": "Hose guidance (Jens, preferred)",
            "option_b": "umbilical guidance / dress pack guidance (alternatives)",
            "affects": "Lesson 1",
            "recommendation": "SME team needs to pick one. Recommend 'hose package guidance' to align with Hendrik.",
            "is_safety": False,
        },
    ]

    for conflict in conflicts:
        border_color = RED_600 if conflict["is_safety"] else AMBER_600
        bg_color = RED_50 if conflict["is_safety"] else AMBER_50

        status_text = conflict["status"]
        if conflict["is_safety"]:
            status_text = '<font color="#dc2626"><b>OPEN — SAFETY ISSUE</b></font>'
        else:
            status_text = f'<font color="#d97706"><b>OPEN</b></font>'

        conflict_data = [
            [
                Paragraph(f'<b>{conflict["id"]}</b>', styles["body"]),
                Paragraph(status_text, styles["body"]),
                Paragraph(f'Affects: <b>{conflict["affects"]}</b>', styles["body_small"]),
            ],
            [
                Paragraph(f'<b>{conflict["title"]}</b>', styles["body"]),
                "", "",
            ],
            [
                Paragraph(f'<font color="#64748b">{conflict["description"]}</font>', styles["body_small"]),
                "", "",
            ],
            [
                Paragraph(f'<b>Option A:</b> {conflict["option_a"]}', styles["body_small"]),
                "", "",
            ],
            [
                Paragraph(f'<b>Option B:</b> {conflict["option_b"]}', styles["body_small"]),
                "", "",
            ],
            [
                Paragraph(f'<b>Recommendation:</b> <i>{conflict["recommendation"]}</i>', styles["body_small"]),
                "", "",
            ],
        ]

        ct = Table(conflict_data, colWidths=[w*0.5, w*0.28, w*0.22])
        ct_style_list = [
            ("BACKGROUND", (0, 0), (-1, -1), bg_color),
            ("BOX", (0, 0), (-1, -1), 1, border_color),
            ("SPAN", (0, 1), (-1, 1)),
            ("SPAN", (0, 2), (-1, 2)),
            ("SPAN", (0, 3), (-1, 3)),
            ("SPAN", (0, 4), (-1, 4)),
            ("SPAN", (0, 5), (-1, 5)),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("LINEBELOW", (0, 0), (-1, 0), 0.5, SLATE_200),
        ]
        ct.setStyle(TableStyle(ct_style_list))
        story.append(KeepTogether([ct, Spacer(1, 8)]))

    # ────────────────────────────────────────────────────────
    # PAGE 5: Next Steps & Timeline
    # ────────────────────────────────────────────────────────
    story.append(PageBreak())
    story.append(Paragraph("Recommended Next Steps", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=0.5, color=SLATE_200, spaceAfter=8))

    steps = [
        ("1", "Resolve safety conflict C-03", "URGENT",
         "J6 bracket orientation is a safety issue flagged by Knut Schmidt. "
         "The course image must be corrected before any further content publication.",
         RED_600, RED_50),
        ("2", "Decide on product naming (C-01)", "HIGH",
         "Choose between 'LSH 3 retract system' and 'LSH3 retraction system'. "
         "This affects all 9 lessons and 6+ terminology occurrences.",
         AMBER_600, AMBER_50),
        ("3", "Decide on video revision scope (C-02)", "HIGH",
         "Determine if videos will be re-recorded or only text updated. "
         "This is a budget/timeline decision that affects lessons 3 and 4.",
         AMBER_600, AMBER_50),
        ("4", "Apply global terminology rules (G-01 to G-05)", "MEDIUM",
         "Once naming decisions are made, apply the 7 global rules across all lessons. "
         "This will automatically resolve ~21 of the 56 pending actions.",
         BLUE_600, BLUE_50),
        ("5", "Review remaining 35 lesson-specific actions", "MEDIUM",
         "Course developer reviews each remaining action in the Content Validator tool: "
         "accept, skip, or modify. Estimated time: 2-3 hours.",
         BLUE_600, BLUE_50),
        ("6", "Final QA pass", "LOW",
         "After all actions are applied, a final review pass to ensure consistency "
         "and no regressions.",
         SLATE_500, SLATE_50),
    ]

    for num, title, urgency, description, color, bg in steps:
        step_data = [
            [
                Paragraph(f'<font color="{color.hexval()}"><b>{num}</b></font>',
                          ParagraphStyle("n", fontName="Helvetica-Bold", fontSize=14,
                                        textColor=color, alignment=TA_CENTER, leading=18)),
                Paragraph(f'<b>{title}</b>', styles["body"]),
                Paragraph(f'<font color="{color.hexval()}"><b>{urgency}</b></font>', styles["body_small"]),
            ],
            [
                "",
                Paragraph(description, styles["body_small"]),
                "",
            ],
        ]
        st = Table(step_data, colWidths=[w*0.08, w*0.76, w*0.16])
        st.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg),
            ("BOX", (0, 0), (-1, -1), 0.5, SLATE_200),
            ("SPAN", (0, 0), (0, 1)),
            ("VALIGN", (0, 0), (0, 0), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(KeepTogether([st, Spacer(1, 4)]))

    story.append(Spacer(1, 16))

    # Summary box
    summary_data = [
        [Paragraph(
            '<b>Bottom Line:</b> 98% of review actions are still pending. '
            '3 P1 safety/accuracy issues and 4 open conflicts must be resolved before '
            'the course can proceed to final editing. Estimated remaining effort: '
            '<b>1 management session</b> (conflict resolution) + <b>2-3 hours</b> (developer review) + '
            '<b>1 day</b> (apply changes and QA).',
            styles["body"]
        )]
    ]
    sb = Table(summary_data, colWidths=[w])
    sb.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SLATE_100),
        ("BOX", (0, 0), (-1, -1), 1, SLATE_900),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(sb)

    # ── Build ──
    doc.build(story, onFirstPage=first_page, onLaterPages=header_footer)
    print(f"PDF generated: {output_path}")
    return output_path


if __name__ == "__main__":
    build_report()
