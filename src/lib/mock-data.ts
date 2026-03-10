import type { Course, FeedbackItem, ContentSection, Lesson } from "@/types/validation.types";

// ── Lesson 1: Module Introduction & Learning Objectives (Slides 0-1) ──

const s0: ContentSection = {
  id: "s0",
  title: "Module 1: Introduction to LSH3 Dress Pack Systems",
  order: 1,
  body: `Welcome to Module 1 of the BizLink Cable Management System course. This module covers the fundamentals of the LSH 3 dress pack system. You will learn about the key components, installation principles, and maintenance requirements for robotic cable management solutions used in industrial manufacturing.`,
};

const s1: ContentSection = {
  id: "s1",
  title: "Learning Objectives",
  order: 2,
  body: `By the end of this lesson, you will be able to:

Identify the key components of the LSH 3 dress pack system
Understand how the dress pack protects and routes cables
Recognize the importance of proper dress pack maintenance`,
};

const lesson1Feedback: FeedbackItem[] = [
  {
    id: "S1-01",
    severity: "minor",
    category: "tone",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: "Rewrite module intro paragraph for technical register. Use precise industry-standard language throughout.",
    referencedText: "Welcome to Module 1 of the BizLink Cable Management System course.",
    correctedText: "Welcome to Module 1 of the BizLink Dresspack System course for robotic cable management.",
    refStart: 0,
    refEnd: 66,
  },
  {
    id: "S1-02",
    severity: "critical",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: 'Apply G-01 (Dresspack) and G-02 (LSH3) terminology. "Dress pack" must be one word, "LSH 3" must have no space.',
    referencedText: "This module covers the fundamentals of the LSH 3 dress pack system.",
    correctedText: "This module covers the fundamentals of the LSH3 Dresspack system.",
    refStart: 67,
    refEnd: 135,
  },
  {
    id: "S2-01",
    severity: "critical",
    category: "accuracy",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: "Fix terminology in learning objectives (G-01, G-02). LSH 3 → LSH3, dress pack → Dresspack.",
    referencedText: "Identify the key components of the LSH 3 dress pack system",
    correctedText: "Identify the key components of the LSH3 Dresspack system",
    refStart: 0,
    refEnd: 59,
  },
  {
    id: "S2-02",
    severity: "minor",
    category: "tone",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: 'Rewrite objectives from passive to active voice (G-08). Use action verbs like "Describe" instead of "Understand".',
    referencedText: "Understand how the dress pack protects and routes cables",
    correctedText: "Describe how the Dresspack protects and routes the hose package along the robot arm",
    refStart: 60,
    refEnd: 115,
  },
  {
    id: "S2-03",
    severity: "minor",
    category: "completeness",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Add specificity to maintenance objective — mention robot uptime and safety as key outcomes.",
    referencedText: "Recognize the importance of proper dress pack maintenance",
    correctedText: "Recognize the importance of proper Dresspack maintenance for robot uptime and safety",
    refStart: 116,
    refEnd: 173,
  },
];

// ── Lesson 2: System Overview & Core Components (Slides 2-3) ──

const s2: ContentSection = {
  id: "s2",
  title: "Understanding the LSH3 Dress Pack System",
  order: 1,
  body: `The LSH 3 dress pack system is a cable management solution designed for industrial robots. The system protects cables from damage during robot movement. It is used in automotive manufacturing. The retract system keeps cables tidy.`,
};

const s3: ContentSection = {
  id: "s3",
  title: "Core System Components",
  order: 2,
  body: `The dress pack consists of several key components. The tooling at the end of the robot arm connects to the cable routing system. Clamps hold the cables in place. Springs pull the cables back.`,
};

const lesson2Feedback: FeedbackItem[] = [
  {
    id: "S3-01",
    severity: "critical",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Comprehensive rewrite needed: define Dresspack formula (3 pillars) — hose package, LSH3 retraction mechanism, and system support structures.",
    referencedText: "The LSH 3 dress pack system is a cable management solution designed for industrial robots.",
    correctedText: "The LSH3 Dresspack system is a robotic cable management solution consisting of three integrated subsystems: the hose package (cables, hoses, and media lines), the LSH3 retraction mechanism (spring-loaded housing), and system support structures (clamps, brackets, and guides).",
    refStart: 0,
    refEnd: 88,
  },
  {
    id: "S3-02",
    severity: "critical",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: 'Apply G-01 globally on slide 3. "dress pack" → "Dresspack" (one word, capitalized).',
    referencedText: "dress pack",
    correctedText: "Dresspack",
    refStart: 8,
    refEnd: 18,
  },
  {
    id: "S3-04",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: "Add technical detail: specify what kind of damage (abrasion, pinching, excessive bending) and how protection works across all joint movements.",
    referencedText: "The system protects cables from damage during robot movement.",
    correctedText: "The system protects the hose package from mechanical abrasion, pinching, and excessive bending during all robot axis movements (J1-J6).",
    refStart: 89,
    refEnd: 150,
  },
  {
    id: "S3-05",
    severity: "major",
    category: "completeness",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: "Expand application scope with specific OEM examples — Audi, BMW, Ford, Porsche, Volkswagen for FANUC robot installations.",
    referencedText: "It is used in automotive manufacturing.",
    correctedText: "The LSH3 Dresspack is deployed across automotive OEM production lines including Audi, BMW, Ford, Porsche, and Volkswagen for FANUC robot installations.",
    refStart: 151,
    refEnd: 189,
  },
  {
    id: "S3-06",
    severity: "minor",
    category: "tone",
    status: "pending",
    author: "Knut Schmidt",
    feedbackText: 'Replace informal language with technical description (G-04, G-10). "Keeps cables tidy" is too colloquial for technical training.',
    referencedText: "The retract system keeps cables tidy.",
    correctedText: "The retraction system maintains controlled tension on the hose package, preventing slack accumulation and ensuring consistent loop geometry across all joint positions.",
    refStart: 190,
    refEnd: 226,
  },
  {
    id: "S4-01",
    severity: "critical",
    category: "accuracy",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: "Rewrite component intro with structured list of 3 pillars: hose package, LSH3 retraction unit, and support structure.",
    referencedText: "The dress pack consists of several key components.",
    correctedText: 'The Dresspack consists of three integrated subsystems: (1) Hose package — all cables, hoses, and pneumatic lines routed along the robot, (2) LSH3 retraction unit — spring-loaded mechanism housed in J3 area, (3) Support structure — clamps, brackets, guides, and protective conduits.',
    refStart: 0,
    refEnd: 50,
  },
  {
    id: "S4-03",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: 'Replace "tooling" with EOAT per G-05. Use full term "end-of-arm tooling (EOAT)" on first mention.',
    referencedText: "The tooling at the end of the robot arm",
    correctedText: "The end-of-arm tooling (EOAT) at Joint 6",
    refStart: 51,
    refEnd: 90,
  },
  {
    id: "S4-04",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Add technical specificity to clamp description — mention lateral displacement prevention and designed bend radius maintenance.",
    referencedText: "Clamps hold the cables in place.",
    correctedText: "Clamps secure the hose package at defined intervals along the robot arm, preventing lateral displacement and maintaining the designed bend radius.",
    refStart: 130,
    refEnd: 162,
  },
  {
    id: "S4-05",
    severity: "minor",
    category: "tone",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: 'Replace informal description "Springs pull the cables back" with technical mechanism description including constant-force spring and calibrated tension.',
    referencedText: "Springs pull the cables back.",
    correctedText: "The constant-force spring mechanism within the LSH3 housing applies calibrated retraction tension to the hose package, compensating for varying cable lengths as joints articulate.",
    refStart: 163,
    refEnd: 191,
  },
];

// ── Lesson 3: Media Management & Lower Axis Routing (Slides 4-5) ──

const s4: ContentSection = {
  id: "s4",
  title: "LSH3 Utilities and Media Management",
  order: 1,
  body: `The dress pack carries various utilities. The cables need to be the right size. Make sure the hose package is not too heavy.`,
};

const s5: ContentSection = {
  id: "s5",
  title: "Umbilical Routing: Joints 1 to 3 (J1-J3)",
  order: 2,
  body: `The cables are routed from the base up to the third joint. The routing should follow the natural path of the robot arm. Be careful not to pinch the cables.`,
};

const lesson3Feedback: FeedbackItem[] = [
  {
    id: "S5-01",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Rewrite media list with proper categorization — electrical power cables, signal/data cables, pneumatic hoses, hydraulic lines, and welding media.",
    referencedText: "The dress pack carries various utilities.",
    correctedText: "The Dresspack routes and protects multiple media types: electrical power cables, signal/data cables (Ethernet, DeviceNet), pneumatic hoses, hydraulic lines (where applicable), and welding media (wire feed, shielding gas).",
    refStart: 0,
    refEnd: 40,
  },
  {
    id: "S5-03",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Add specific sizing criteria with units (G-09). Reference BizLink sizing chart for maximum OD in mm and minimum bend radius specifications.",
    referencedText: "The cables need to be the right size.",
    correctedText: "Cable and hose diameters must match the LSH3 housing capacity. Refer to the BizLink sizing chart for maximum outer diameter (OD) in mm and minimum bend radius specifications.",
    refStart: 41,
    refEnd: 77,
  },
  {
    id: "S5-04",
    severity: "minor",
    category: "tone",
    status: "pending",
    author: "Knut Schmidt",
    feedbackText: 'Replace informal instruction with technical weight specification. "Not too heavy" is imprecise — reference kg/m and product datasheet.',
    referencedText: "Make sure the hose package is not too heavy.",
    correctedText: "Verify that the total hose package weight per meter (kg/m) does not exceed the LSH3 retraction unit capacity specified in the product datasheet.",
    refStart: 78,
    refEnd: 121,
  },
  {
    id: "S6-01",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: "Rewrite J1-J3 routing description with proper joint references. Specify the path from base (J1) through lower arm (J2) to upper arm pivot (J3).",
    referencedText: "The cables are routed from the base up to the third joint.",
    correctedText: "The hose package is routed from the robot base (J1) through the lower arm (J2) to the upper arm pivot at Joint 3 (J3), where it enters the LSH3 retraction housing.",
    refStart: 0,
    refEnd: 58,
  },
  {
    id: "S6-03",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Add technical routing guidance — mention designated cable channels, minimum bend radius, and BizLink-specified clamp intervals.",
    referencedText: "The routing should follow the natural path of the robot arm.",
    correctedText: "Route the hose package along the designated cable channels, maintaining minimum bend radius at each joint transition. Secure with BizLink-specified clamp intervals.",
    refStart: 59,
    refEnd: 118,
  },
  {
    id: "S6-04",
    severity: "minor",
    category: "tone",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: 'Replace informal safety note "Be careful not to pinch the cables" with proper CAUTION statement format.',
    referencedText: "Be careful not to pinch the cables.",
    correctedText: "CAUTION: Verify clearance at J2 and J3 joint transitions during full range-of-motion test. Pinch points can cause hose package failure and unplanned downtime.",
    refStart: 119,
    refEnd: 153,
  },
];

// ── Lesson 4: Upper Axis Retraction & Loop Control (Slides 6-7) ──

const s6: ContentSection = {
  id: "s6",
  title: "Upper Axis Retraction and Loop Control: J3-J6",
  order: 1,
  body: `The retract system controls the cable loop between joints 3 and 6. The loop should not be too tight or too loose. Adjusts Length / Prevents Twisting / Maintains Path / Protects Equipment`,
};

const s7: ContentSection = {
  id: "s7",
  title: "LSH3 Loop Behavior Across J4 to J6",
  order: 2,
  body: `The loop changes shape as the robot moves. Make sure the loop does not touch the robot. The video shows how the loop behaves.`,
};

const lesson4Feedback: FeedbackItem[] = [
  {
    id: "S7-01",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Rewrite with proper retraction mechanism description. Specify LSH3 retraction unit and spring-loaded housing that adjusts hose package length dynamically.",
    referencedText: "The retract system controls the cable loop between joints 3 and 6.",
    correctedText: "The LSH3 retraction unit controls the umbilical loop between Joint 3 (J3) and Joint 6 (J6). The spring-loaded housing adjusts hose package length dynamically as the upper axes articulate.",
    refStart: 0,
    refEnd: 64,
  },
  {
    id: "S7-02",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: 'Apply G-04: "retract system" → "retraction system". Always use "retraction" not "retract" as noun modifier.',
    referencedText: "retract system",
    correctedText: "retraction system",
    refStart: 4,
    refEnd: 18,
  },
  {
    id: "S7-03",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Replace informal loop guidance with technical specification — mention J4-J5-J6 range of motion, retraction unit travel limit, and minimum bend radius.",
    referencedText: "The loop should not be too tight or too loose.",
    correctedText: "The umbilical loop must maintain sufficient slack to accommodate full J4-J5-J6 range of motion without exceeding the retraction unit travel limit or dropping below minimum bend radius.",
    refStart: 65,
    refEnd: 111,
  },
  {
    id: "S7-04",
    severity: "major",
    category: "completeness",
    status: "pending",
    author: "Knut Schmidt",
    feedbackText: "Expand tab descriptions with technical detail — spring travel specs, anti-rotation guide function, loop geometry constraints, strain relief at J6.",
    referencedText: "Adjusts Length / Prevents Twisting / Maintains Path / Protects Equipment",
    correctedText: "Each expandable section needs technical specifics: Adjusts Length → spring travel specs; Prevents Twisting → anti-rotation guide function; Maintains Path → loop geometry constraints; Protects Equipment → strain relief at J6 connection.",
    refStart: 112,
    refEnd: 183,
  },
  {
    id: "S8-01",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Knut Schmidt",
    feedbackText: "Rewrite loop behavior description with axis-specific detail — J4 (wrist rotation), J5 (wrist pitch), J6 (tool flange rotation).",
    referencedText: "The loop changes shape as the robot moves.",
    correctedText: "The umbilical loop geometry changes dynamically as J4 (wrist rotation), J5 (wrist pitch), and J6 (tool flange rotation) articulate. The LSH3 retraction unit compensates by adjusting effective hose package length.",
    refStart: 0,
    refEnd: 43,
  },
  {
    id: "S8-02",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Replace informal instruction with clearance specification — reference BizLink installation guide and robot simulation software for collision checking.",
    referencedText: "Make sure the loop does not touch the robot.",
    correctedText: "Verify minimum clearance (refer to BizLink installation guide) between the umbilical loop and robot body/workpiece across all programmed positions. Use robot simulation software for collision checking.",
    refStart: 44,
    refEnd: 87,
  },
  {
    id: "S8-03",
    severity: "minor",
    category: "formatting",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: "Add video annotation requirements — slow-motion loop behavior at J5 extreme positions, retraction unit engagement callouts, minimum clearance measurement points.",
    referencedText: "The video shows how the loop behaves.",
    correctedText: "Video must include: (1) slow-motion loop behavior at J5 extreme positions, (2) callout overlays showing retraction unit engagement, (3) minimum clearance measurement points.",
    refStart: 88,
    refEnd: 124,
  },
];

// ── Lesson 5: Sizing, Media Types & Safe Handling (Slides 8-9) ──

const s8: ContentSection = {
  id: "s8",
  title: "Dress Pack Sizes and Media Types",
  order: 1,
  body: `Different sizes are available for different robots. The table shows sizes. Pick the right size for your application.`,
};

const s9: ContentSection = {
  id: "s9",
  title: "Safe Handling Practices",
  order: 2,
  body: `Handle the dress pack carefully.`,
};

const lesson5Feedback: FeedbackItem[] = [
  {
    id: "S9-01",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Rewrite sizing section with specific LSH3 variants — FANUC payload classes, housing sizes, and selection criteria.",
    referencedText: "Different sizes are available for different robots.",
    correctedText: "LSH3 Dresspack systems are available in multiple housing sizes matched to FANUC robot payload classes. Size selection depends on: number and diameter of media lines, total hose package weight (kg/m), and required bend radius at J3-J6.",
    refStart: 0,
    refEnd: 50,
  },
  {
    id: "S9-02",
    severity: "critical",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: 'Apply G-01 on slide 9. "dress pack" → "Dresspack" (one word, capitalized).',
    referencedText: "dress pack",
    correctedText: "Dresspack",
    refStart: 0,
    refEnd: 10,
  },
  {
    id: "S9-03",
    severity: "major",
    category: "accuracy",
    status: "pending",
    author: "Knut Schmidt",
    feedbackText: "Add units to all dimension columns per G-09 — outer diameter (mm), weight per meter (kg/m), minimum bend radius (mm), maximum retraction travel (mm).",
    referencedText: "The table shows sizes.",
    correctedText: "All dimension columns must include units: outer diameter (mm), weight per meter (kg/m), minimum bend radius (mm), maximum retraction travel (mm).",
    refStart: 51,
    refEnd: 72,
  },
  {
    id: "S9-04",
    severity: "minor",
    category: "tone",
    status: "pending",
    author: "Jens Fritzsche",
    feedbackText: 'Replace informal instruction "Pick the right size" with proper selection procedure with numbered steps.',
    referencedText: "Pick the right size for your application.",
    correctedText: "To select the correct LSH3 housing size: (1) inventory all media lines with OD measurements, (2) calculate total hose package cross-section, (3) verify against BizLink sizing chart, (4) confirm retraction travel meets robot reach requirements.",
    refStart: 73,
    refEnd: 113,
  },
  {
    id: "S10-01",
    severity: "critical",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: "Rewrite safety section with proper CAUTION/WARNING format. Include lockout/tagout and bend radius warnings.",
    referencedText: "Handle the dress pack carefully.",
    correctedText: "WARNING: Always de-energize the robot and lock out/tag out before performing any Dresspack maintenance. CAUTION: Do not exceed the specified bend radius when manually routing the hose package.",
    refStart: 0,
    refEnd: 31,
  },
  {
    id: "S10-02",
    severity: "critical",
    category: "accuracy",
    status: "pending",
    author: "Hendrik Scharfenberg",
    feedbackText: 'Apply G-01 on safe handling slide. "dress pack" → "Dresspack" per BizLink official branding.',
    referencedText: "dress pack",
    correctedText: "Dresspack",
    refStart: 11,
    refEnd: 21,
  },
];

// ── Assemble Lessons ──

const lesson1: Lesson = {
  id: "l1",
  title: "Module Introduction & Learning Objectives",
  order: 1,
  sections: [s0, s1],
  feedbackItems: lesson1Feedback,
};

const lesson2: Lesson = {
  id: "l2",
  title: "System Overview & Core Components",
  order: 2,
  sections: [s2, s3],
  feedbackItems: lesson2Feedback,
};

const lesson3: Lesson = {
  id: "l3",
  title: "Media Management & Lower Axis Routing",
  order: 3,
  sections: [s4, s5],
  feedbackItems: lesson3Feedback,
};

const lesson4: Lesson = {
  id: "l4",
  title: "Upper Axis Retraction & Loop Control",
  order: 4,
  sections: [s6, s7],
  feedbackItems: lesson4Feedback,
};

const lesson5: Lesson = {
  id: "l5",
  title: "Sizing, Media Types & Safe Handling",
  order: 5,
  sections: [s8, s9],
  feedbackItems: lesson5Feedback,
};

export const mockCourse: Course = {
  id: "BCM-100",
  title: "BizLink LSH3 Dresspack System — Module 1",
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5],
};
